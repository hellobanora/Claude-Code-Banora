'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Landing Page (/xray)
//
// Patient selection, exam date, view type, image upload.
// Matches the dark-mode Posture Pro aesthetic.
//
// TODO: Claude Code — wire up PatientRepository for patient list.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ViewType, ClinicId } from '@/lib/xray/types';
import { setSpineViewSession } from '@/lib/xray/session-store';
import { ViewSelector } from '@/components/xray';

export default function XrayLandingPage() {
  const router = useRouter();
  const [patientName, setPatientName] = useState('');
  const [examDate, setExamDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [viewType, setViewType] = useState<ViewType>('cervical_lateral');
  const [clinicId, setClinicId] = useState<ClinicId>('banora');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleStart = useCallback(() => {
    if (!imagePreview || !patientName.trim()) return;

    setSpineViewSession({
      patientName,
      examDate,
      viewType,
      clinicId,
      imageDataUrl: imagePreview,
    });

    router.push('/xray/analyse');
  }, [imagePreview, patientName, examDate, viewType, clinicId, router]);

  const isReady = imagePreview && patientName.trim();

  return (
    <div className="min-h-screen bg-[#0F1A2E] text-white">
      {/* Header */}
      <div className="bg-[#1B3A5C] border-b-2 border-[#FFD232]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">
            <span className="text-[#FFD232]">SpineView</span>{' '}
            <span className="text-[#8BA4C4] font-normal text-lg">
              X-Ray Analysis
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Patient Details */}
        <div className="bg-[#162440] rounded-xl p-6 border border-[#1E3455]">
          <h2 className="text-[#FFD232] font-semibold mb-4">Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#8BA4C4] text-sm block mb-1">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                className="w-full px-4 py-2.5 bg-[#0F1A2E] border border-[#1E3455] rounded-lg text-white placeholder:text-[#5B7A9E] focus:border-[#FFD232] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[#8BA4C4] text-sm block mb-1">
                Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0F1A2E] border border-[#1E3455] rounded-lg text-white focus:border-[#FFD232] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* View Selection */}
        <div className="bg-[#162440] rounded-xl p-6 border border-[#1E3455]">
          <h2 className="text-[#FFD232] font-semibold mb-4">X-Ray View</h2>
          <ViewSelector selected={viewType} onChange={setViewType} />
        </div>

        {/* Clinic Branding */}
        <div className="bg-[#162440] rounded-xl p-6 border border-[#1E3455]">
          <h2 className="text-[#FFD232] font-semibold mb-4">Clinic</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setClinicId('banora')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                clinicId === 'banora'
                  ? 'bg-[#FFD232] text-[#1B3A5C]'
                  : 'bg-[#1E3455] text-[#8BA4C4] hover:bg-[#2C5F8A]'
              }`}
            >
              Banora Chiropractic
            </button>
            <button
              onClick={() => setClinicId('palmbeach')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                clinicId === 'palmbeach'
                  ? 'bg-[#FFD232] text-[#1B3A5C]'
                  : 'bg-[#1E3455] text-[#8BA4C4] hover:bg-[#2C5F8A]'
              }`}
            >
              Palm Beach Chiropractic
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-[#162440] rounded-xl p-6 border border-[#1E3455]">
          <h2 className="text-[#FFD232] font-semibold mb-4">
            Upload X-Ray Image
          </h2>

          {!imagePreview ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-[#1E3455] rounded-xl p-12 text-center hover:border-[#FFD232] transition-colors cursor-pointer"
            >
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
                id="xray-upload"
              />
              <label htmlFor="xray-upload" className="cursor-pointer">
                <div className="text-[#FFD232] text-4xl mb-3">📁</div>
                <p className="text-white font-medium mb-1">
                  Drop X-ray image here or click to upload
                </p>
                <p className="text-[#5B7A9E] text-sm">
                  JPEG or PNG exported from your PACS viewer
                </p>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Uploaded X-ray"
                className="max-h-64 mx-auto rounded-lg"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-[#E74C3C] text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Start Analysis */}
        <div className="text-center pb-8">
          <button
            onClick={handleStart}
            disabled={!isReady}
            className={`px-12 py-4 rounded-xl text-lg font-bold transition-all ${
              isReady
                ? 'bg-[#FFD232] text-[#1B3A5C] hover:bg-[#D4A017] hover:scale-105'
                : 'bg-[#1E3455] text-[#5B7A9E] cursor-not-allowed'
            }`}
          >
            Start Analysis →
          </button>
        </div>
      </div>
    </div>
  );
}
