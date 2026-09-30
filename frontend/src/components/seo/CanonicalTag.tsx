'use client';

import { useEffect } from 'react';

interface CanonicalTagProps {
  url: string;
}

/**
 * Dynamically manages the document's canonical link tag.
 * Guarantees exactly ONE <link rel="canonical"> exists in document.head
 * by mutating it in-place and eliminating duplicates across client-side page transitions.
 */
export default function CanonicalTag({ url }: CanonicalTagProps) {
  useEffect(() => {
    if (!url || typeof document === 'undefined') return;

    const canonicals = document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]');

    if (canonicals.length === 0) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    } else {
      // Update the primary canonical tag in place
      canonicals[0].setAttribute('href', url);

      // Clean up any extra/stale duplicate canonical tags
      for (let i = 1; i < canonicals.length; i++) {
        canonicals[i].remove();
      }
    }
  }, [url]);

  return null;
}
