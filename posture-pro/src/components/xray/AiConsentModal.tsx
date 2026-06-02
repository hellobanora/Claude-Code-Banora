'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — AI Consent Modal
//
// Shown before sending the X-ray image to Claude Vision API.
// AHPRA/privacy compliant: clearly explains what data is sent,
// where it goes, and what is NOT sent.
// ═══════════════════════════════════════════════════════════════

import React from 'react';

interface AiConsentModalProps {
  isOpen: boolean;
  onConsent: () => void;
  onCancel: () => void;
}

export default function AiConsentModal({
  isOpen,
  onConsent,
  onCancel,
}: AiConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#162440] rounded-2xl border border-[#1E3455] max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#1E3455]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#2C5F8A] rounded-full flex items-center justify-center text-lg">
              🤖
            </div>
            <h2 className="text-xl font-bold text-white">
              AI Landmark Detection
            </h2>
          </div>
          <p className="text-[#8BA4C4] text-sm">
            SpineView can use AI to automatically estimate landmark positions
            on your X-ray. Please review the following before proceeding.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* What IS sent */}
          <div className="bg-[#0F1A2E] rounded-lg p-4">
            <h3 className="text-[#FFD232] font-semibold text-sm mb-2">
              What is sent to the AI:
            </h3>
            <ul className="text-[#E8EDF3] text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#5B9EC9] mt-0.5">•</span>
                The X-ray image only
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#5B9EC9] mt-0.5">•</span>
                Image dimensions (width × height)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#5B9EC9] mt-0.5">•</span>
                The X-ray view type (e.g. cervical lateral)
              </li>
            </ul>
          </div>

          {/* What is NOT sent */}
          <div className="bg-[#0F1A2E] rounded-lg p-4">
            <h3 className="text-[#2ECC71] font-semibold text-sm mb-2">
              What is NOT sent:
            </h3>
            <ul className="text-[#E8EDF3] text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#2ECC71] mt-0.5">✓</span>
                No patient name, date of birth, or ID
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2ECC71] mt-0.5">✓</span>
                No clinic or practitioner information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2ECC71] mt-0.5">✓</span>
                No medical history or clinical notes
              </li>
            </ul>
          </div>

          {/* Data handling */}
          <div className="bg-[#0F1A2E] rounded-lg p-4">
            <h3 className="text-[#8BA4C4] font-semibold text-sm mb-2">
              Data handling:
            </h3>
            <ul className="text-[#E8EDF3] text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#8BA4C4] mt-0.5">•</span>
                Processed by Anthropic&apos;s Claude AI via encrypted API
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8BA4C4] mt-0.5">•</span>
                Not stored or used for AI training (API tier)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8BA4C4] mt-0.5">•</span>
                AI suggestions are estimates only — practitioner review is required
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-[#1E3455] flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-[#1E3455] text-[#8BA4C4] rounded-lg hover:bg-[#2C5F8A] hover:text-white transition-colors font-medium"
          >
            Cancel — Place Manually
          </button>
          <button
            onClick={onConsent}
            className="flex-1 py-3 bg-[#FFD232] text-[#1B3A5C] rounded-lg hover:bg-[#D4A017] transition-colors font-bold"
          >
            I Understand — Detect
          </button>
        </div>
      </div>
    </div>
  );
}
