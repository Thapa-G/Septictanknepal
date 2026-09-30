'use client';

import { useEffect, useLayoutEffect } from 'react';

interface CanonicalTagProps {
  url: string;
}

export default function CanonicalTag({ url }: CanonicalTagProps) {
  // Use layout effect in browser for immediate DOM execution before paint
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!url || typeof document === 'undefined') return;

    const targetUrl = url.trim();

    const deduplicateCanonical = () => {
      const canonicalLinks = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')
      );

      if (canonicalLinks.length === 0) {
        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', targetUrl);
        document.head.appendChild(link);
      } else {
        // Enforce that the first canonical tag has the current page URL
        if (canonicalLinks[0].getAttribute('href') !== targetUrl) {
          canonicalLinks[0].setAttribute('href', targetUrl);
        }
        // Remove any secondary, stale, or duplicate canonical tags
        for (let i = 1; i < canonicalLinks.length; i++) {
          canonicalLinks[i].parentNode?.removeChild(canonicalLinks[i]);
        }
      }
    };

    // Run immediately on mount / URL change
    deduplicateCanonical();

    // Re-check after next microtask/tick to catch React 19's asynchronous link hoisting
    const timerId = setTimeout(deduplicateCanonical, 0);
    const secondaryTimerId = setTimeout(deduplicateCanonical, 100);

    // Watch head mutations in case React 19 or external scripts append another canonical tag
    const observer = new MutationObserver(() => {
      const allCanonicals = document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]');
      if (allCanonicals.length > 1) {
        deduplicateCanonical();
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: false,
    });

    return () => {
      clearTimeout(timerId);
      clearTimeout(secondaryTimerId);
      observer.disconnect();
    };
  }, [url]);

  return <link rel="canonical" href={url} />;
}
