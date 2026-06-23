'use client';

// src/components/rom/RomCaptureFlow.tsx
//
// Walks the practitioner through the fixed 6-movement ROM capture sequence
// (3 camera stages, per capture-flow.ts), recording one short video per
// movement, then runs analysis on each clip and assembles a RomAssessment.
//
// Live skeleton overlay during recording and gyroscope-based camera
// levelling (both mentioned in the spec as capture-protocol niceties) are
// not implemented in this pass — flagged as follow-up work, not required
// for the analysis pipeline to function. The spec itself lists camera
// calibration UI as a "Next Step" (Section 11, item 4), not part of the
// core build.

import { useCallback, useRef, useState } from 'react';
import { CAPTURE_STAGES, type CaptureStep } from '@/lib/rom/capture-flow';
import { runMovementAnalysis } from '@/lib/rom/run-analysis';
import type { MovementResult } from '@/lib/rom/types';

const RECORDING_SECONDS = 12;

interface RomCaptureFlowProps {
  onComplete: (results: MovementResult[], videoBlobsByMovement: Map<string, Blob>) => void;
  onCancel: () => void;
}

type StepPhase = 'instructions' | 'recording' | 'analysing' | 'error';

export function RomCaptureFlow({ onComplete, onCancel }: RomCaptureFlowProps) {
  const allSteps = CAPTURE_STAGES.flatMap((s) => s.steps);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<StepPhase>('instructions');
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RECORDING_SECONDS);

  const allResults = useRef<MovementResult[]>([]);
  const allVideoBlobs = useRef<Map<string, Blob>>(new Map());

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = allSteps[stepIndex];
  const currentStage = CAPTURE_STAGES.find((s) => s.steps.includes(currentStep))!;
  const isFirstInStage = currentStage.steps[0] === currentStep;

  const startCamera = useCallback(async () => {
    const constraints = [
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: 'user' }, audio: false },
      { video: true, audio: false },
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
      setError('Could not access camera. Check browser permissions and try again.');
      setPhase('error');
      return;
    }
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => {});
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async (step: CaptureStep) => {
    if (!streamRef.current) {
      await startCamera();
    }
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      allVideoBlobs.current.set(step.movement, blob);
      stopCamera();
      setPhase('analysing');

      try {
        // Sagittal facing direction defaults to "right" (patient's right
        // side toward camera) — matches the protocol's standard side-on
        // positioning. If the clinic photographs the other side, this
        // would need to become a practitioner-selectable toggle.
        const results = await runMovementAnalysis(step, blob, true);
        allResults.current.push(...results);

        if (stepIndex + 1 < allSteps.length) {
          setStepIndex(stepIndex + 1);
          setPhase('instructions');
        } else {
          onComplete(allResults.current, allVideoBlobs.current);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Analysis failed for this movement.');
        setPhase('error');
      }
    };

    recorderRef.current = recorder;
    recorder.start();
    setSecondsLeft(RECORDING_SECONDS);
    setPhase('recording');

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          recorder.stop();
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [startCamera, stopCamera, stepIndex, allSteps.length, onComplete]);

  const handleStopEarly = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  }, []);

  const handleRetryStep = useCallback(() => {
    setError(null);
    setPhase('instructions');
  }, []);

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy">ROM Assessment Capture</h2>
        <span className="rounded-full bg-navy/10 px-3 py-1 text-xs font-medium text-navy">
          Movement {stepIndex + 1} of {allSteps.length} · Stage {currentStage.stage} of 3
        </span>
      </div>

      {isFirstInStage && phase === 'instructions' && (
        <div className="rounded-lg border border-lightblue/40 bg-lightblue/5 p-3 text-sm text-neutral-700">
          <strong className="text-navy">Camera setup — Stage {currentStage.stage}:</strong> {currentStage.cameraInstruction}
        </div>
      )}

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
        <h3 className="font-semibold text-navy">{currentStep.label}</h3>
        <p className="mt-1 text-sm text-neutral-600">{currentStep.instruction}</p>
      </div>

      {phase === 'error' && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={handleRetryStep}
            className="ml-3 font-medium underline"
          >
            Retry this movement
          </button>
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg border border-neutral-300 bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoRef} autoPlay playsInline muted className="block w-full" style={{ minHeight: 280 }} />
        {phase === 'recording' && (
          <div className="absolute top-2 right-2 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> REC {secondsLeft}s
          </div>
        )}
        {phase === 'analysing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy/80 text-white text-sm font-medium">
            Analysing movement…
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {phase === 'instructions' && (
          <button
            type="button"
            onClick={() => startRecording(currentStep)}
            className="flex-1 rounded-md bg-gold px-4 py-3 text-sm font-semibold text-navy hover:bg-goldlight"
          >
            Start camera &amp; record ({RECORDING_SECONDS}s)
          </button>
        )}
        {phase === 'recording' && (
          <button
            type="button"
            onClick={handleStopEarly}
            className="flex-1 rounded-md bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-midblue"
          >
            Stop recording
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-neutral-300 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          Cancel assessment
        </button>
      </div>

      <p className="text-xs text-neutral-500">
        Single take per movement — the system auto-detects the neutral position and both end-ranges.
        No need to hold or tap; just perform the movement smoothly and hold briefly at each end-range.
      </p>
    </div>
  );
}
