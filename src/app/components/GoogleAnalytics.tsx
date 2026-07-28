// Google Analytics 4 Component
// Injects the exact GA4 tracking code provided by Google

import { useEffect } from 'react';

export function GoogleAnalytics() {
  useEffect(() => {
    // Inject gtag.js script
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-TTQCMC7CKS';
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag directly (not via innerHTML)
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer!.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'G-TTQCMC7CKS');

    console.log('Google Analytics loaded: G-TTQCMC7CKS');
  }, []);

  return null;
}