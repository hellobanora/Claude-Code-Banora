'use client';

import { useCallback, useState } from 'react';

interface DownloadPdfButtonProps {
  targetSelector?: string;
  filename?: string;
}

export function DownloadPdfButton({
  targetSelector = '.report-page',
  filename = 'posture-report.pdf',
}: DownloadPdfButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ]);

      const pages = document.querySelectorAll<HTMLElement>(targetSelector);
      if (pages.length === 0) return;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();

        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        if (imgHeight <= pdfHeight) {
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          // Scale to fit page height
          const scaledWidth = (canvas.width * pdfHeight) / canvas.height;
          pdf.addImage(imgData, 'JPEG', (pdfWidth - scaledWidth) / 2, 0, scaledWidth, pdfHeight);
        }
      }

      pdf.save(filename);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
  }, [targetSelector, filename]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={generating}
      className="rounded-md bg-gradient-to-r from-gold to-goldlight px-5 py-2 text-sm font-medium text-navy shadow hover:from-goldlight hover:to-gold disabled:opacity-50"
    >
      {generating ? 'Generating PDF…' : 'Download PDF'}
    </button>
  );
}
