'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Patient, PostureCapture } from '@/lib/models/patient';
import type { PostureView } from '@/lib/models/landmark';

type CaptureStep = 'consent' | 'lateral' | 'ap' | 'done';

interface CaptureFlowProps {
  patient: Patient;
  sessionId: string;
  onCaptureComplete: (lateral: PostureCapture, ap: PostureCapture) => void;
  saveImage: (blob: Blob, patientId: string, hint: string) => Promise<string | undefined>;
  upsertPatient: (patient: Patient) => Promise<void>;
}

export function CaptureFlow({ patient, sessionId, onCaptureComplete, saveImage, upsertPatient }: CaptureFlowProps) {
  const [step, setStep] = useState<CaptureStep>(patient.consentSigned ? 'lateral' : 'consent');
  const [lateralCapture, setLateralCapture] = useState<PostureCapture | null>(null);

  const handleConsent = useCallback(async () => {
    const updated: Patient = { ...patient, consentSigned: true, consentDate: new Date().toISOString() };
    await upsertPatient(updated);
    setStep('lateral');
  }, [patient, upsertPatient]);

  const handleCapture = useCallback(
    async (blob: Blob, view: PostureView, width: number, height: number) => {
      const imageKey = await saveImage(blob, patient.id, `${view}-${sessionId}`);
      if (!imageKey) return;

      const capture: PostureCapture = {
        id: crypto.randomUUID(),
        view,
        imageKey,
        imageWidth: width,
        imageHeight: height,
        landmarks: [],
        capturedAt: new Date().toISOString(),
      };

      if (view === 'lateral') {
        setLateralCapture(capture);
        setStep('ap');
      } else if (lateralCapture) {
        onCaptureComplete(lateralCapture, capture);
        setStep('done');
      }
    },
    [patient.id, sessionId, saveImage, lateralCapture, onCaptureComplete]
  );

  if (step === 'consent') {
    return <ConsentGate patientName={patient.firstName} onAccept={handleConsent} />;
  }

  if (step === 'done') {
    return (
      <div className="rounded-lg border border-green-300 bg-green-50 p-6 text-center">
        <p className="text-sm font-medium text-green-800">Both photos captured. Place landmarks below.</p>
      </div>
    );
  }

  return (
    <CameraCapture
      view={step}
      onCapture={(blob, w, h) => handleCapture(blob, step, w, h)}
    />
  );
}

function ConsentGate({ patientName, onAccept }: { patientName: string; onAccept: () => void }) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-6">
      <h3 className="text-lg font-semibold text-navy">Patient consent required</h3>
      <p className="mt-2 text-sm text-neutral-700">
        Before capturing posture photos, please confirm that <strong>{patientName}</strong> has
        provided written consent for clinical photography in accordance with the Privacy Act 1988
        and APP 11.
      </p>
      <button
        type="button"
        onClick={onAccept}
        className="mt-4 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-midblue"
      >
        Consent signed — proceed
      </button>
    </div>
  );
}

function CameraCapture({
  view,
  onCapture,
}: {
  view: PostureView;
  onCapture: (blob: Blob, width: number, height: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setVideoReady(false);

    // Try back camera first, fall back to any camera if it fails.
    const constraints = [
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } },
      { video: { facingMode: 'user' } },
      { video: true },
    ];

    let stream: MediaStream | null = null;
    for (const c of constraints) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(c);
        break;
      } catch {
        // try next constraint
      }
    }

    if (!stream) {
      setCameraError(
        'Could not access camera. Check browser permissions, then try the upload option below.'
      );
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;

    // Wait for the video to actually have frame data before showing capture button.
    // iOS Safari needs this — play() can resolve before frames are ready.
    await new Promise<void>((resolve) => {
      const onPlaying = () => {
        video.removeEventListener('playing', onPlaying);
        resolve();
      };
      video.addEventListener('playing', onPlaying);
      video.play().catch(() => {
        video.removeEventListener('playing', onPlaying);
        resolve();
      });
    });

    // Double-check video dimensions are available (may take an extra frame on iOS)
    if (video.videoWidth === 0) {
      await new Promise<void>((resolve) => {
        const onMeta = () => {
          video.removeEventListener('loadedmetadata', onMeta);
          resolve();
        };
        video.addEventListener('loadedmetadata', onMeta);
        // Timeout fallback — don't hang forever
        setTimeout(resolve, 2000);
      });
    }

    setCameraActive(true);
    setVideoReady(video.videoWidth > 0 && video.videoHeight > 0);

    // Final fallback: poll until dimensions appear (some iOS versions are slow)
    if (video.videoWidth === 0) {
      const poll = setInterval(() => {
        if (video.videoWidth > 0) {
          setVideoReady(true);
          clearInterval(poll);
        }
      }, 100);
      setTimeout(() => clearInterval(poll), 5000);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
    setVideoReady(false);
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (w === 0 || h === 0) return; // video not ready yet

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          stopCamera();
          onCapture(blob, w, h);
        }
      },
      'image/jpeg',
      0.92
    );
  }, [stopCamera, onCapture]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) onCapture(blob, canvas.width, canvas.height);
          },
          'image/jpeg',
          0.92
        );
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    },
    [onCapture]
  );

  const label = view === 'lateral' ? 'Lateral (side)' : 'Anterior (front)';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-navy">Capture {label} photo</h3>
        <span className="rounded-full bg-navy/10 px-3 py-1 text-xs font-medium text-navy">
          Step {view === 'lateral' ? '1' : '2'} of 2
        </span>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-neutral-300 bg-black">
        {cameraActive ? (
          <div className="relative">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="block w-full"
              style={{ WebkitTransform: 'translateZ(0)' }}
            />
            <CaptureOverlay view={view} />
          </div>
        ) : (
          <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-400">
            {cameraError ? (
              <p className="max-w-xs text-center text-sm text-red-500">{cameraError}</p>
            ) : (
              <p className="text-sm">Camera not started</p>
            )}
            <button
              type="button"
              onClick={startCamera}
              className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-midblue"
            >
              Start camera
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        {cameraActive && (
          <button
            type="button"
            onClick={captureFrame}
            disabled={!videoReady}
            className="flex-1 rounded-md bg-gold px-4 py-3 text-sm font-semibold text-navy hover:bg-goldlight disabled:opacity-50"
          >
            {videoReady ? 'Capture photo' : 'Camera loading…'}
          </button>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-neutral-300 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          Upload photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <p className="text-xs text-neutral-500">
        {view === 'lateral'
          ? 'Position the patient side-on. Align their ankle with the plumb line.'
          : 'Position the patient facing the camera. Centre them on the vertical guide.'}
      </p>
    </div>
  );
}

function CaptureOverlay({ view }: { view: PostureView }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Vertical plumb line */}
      <line
        x1="50" y1="0" x2="50" y2="100"
        stroke="#2C8A3B" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.7"
      />
      {/* Horizontal eye-level guide */}
      <line
        x1="0" y1="20" x2="100" y2="20"
        stroke="#FFD232" strokeWidth="0.2" strokeDasharray="1,1" opacity="0.5"
      />
      {view === 'lateral' ? (
        <>
          {/* Lateral silhouette hint — vertical dots for posture chain */}
          <circle cx="48" cy="15" r="0.8" fill="#FFD232" opacity="0.4" />
          <circle cx="50" cy="30" r="0.8" fill="#FFD232" opacity="0.4" />
          <circle cx="50" cy="55" r="0.8" fill="#FFD232" opacity="0.4" />
          <circle cx="50" cy="72" r="0.8" fill="#FFD232" opacity="0.4" />
          <circle cx="50" cy="90" r="0.8" fill="#FFD232" opacity="0.4" />
        </>
      ) : (
        <>
          {/* AP silhouette hint — horizontal shoulder and hip lines */}
          <line x1="35" y1="30" x2="65" y2="30" stroke="#FFD232" strokeWidth="0.2" opacity="0.3" />
          <line x1="38" y1="55" x2="62" y2="55" stroke="#FFD232" strokeWidth="0.2" opacity="0.3" />
        </>
      )}
    </svg>
  );
}
