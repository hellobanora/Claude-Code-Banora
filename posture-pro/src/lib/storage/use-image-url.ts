'use client';

import { useEffect, useState } from 'react';
import { usePatientStore } from './use-patient-store';

/**
 * Loads an image blob from IndexedDB and exposes it as an object URL the browser
 * can render via <img src>. Cleans up the URL on unmount so we don't leak memory.
 *
 * Returns undefined while loading or if the key isn't found.
 */
export function useImageUrl(
  patientId: string | undefined,
  imageKey: string | undefined
): string | undefined {
  const { loadImage } = usePatientStore();
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!patientId || !imageKey) {
      setUrl(undefined);
      return;
    }

    let cancelled = false;
    let currentUrl: string | undefined;

    (async () => {
      const blob = await loadImage(imageKey, patientId);
      if (cancelled || !blob) return;
      currentUrl = URL.createObjectURL(blob);
      setUrl(currentUrl);
    })();

    return () => {
      cancelled = true;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [patientId, imageKey, loadImage]);

  return url;
}
