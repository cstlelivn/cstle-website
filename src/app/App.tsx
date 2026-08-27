import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "./pages/Home";
import { Gallery } from "./pages/Gallery";
import { Mission } from "./pages/Mission";
import { Contact } from "./pages/Contact";
import { BookService } from "./pages/BookService";
import { BasementProjectFit } from "./pages/BasementProjectFit";
import { Reviews } from "./pages/Reviews";
import { FAQ } from "./pages/FAQ";
import { Terms } from "./pages/Terms";
import { LogoTest } from "./pages/LogoTest";
import { Admin } from "./pages/Admin";
import { AdminSetup } from "./pages/AdminSetup";
import { trackPageView, GA_MEASUREMENT_ID } from "./utils/analytics";

// Analytics wrapper component to track page views
function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location]);

  return <>{children}</>;
}

export default function App() {
  // Load Google Analytics script
  useEffect(() => {
    // Check if already loaded
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      return;
    }

    // Add gtag.js script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer!.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }, []);

  // Ensure viewport meta tag is set for proper mobile rendering
  useEffect(() => {
    const meta = document.querySelector('meta[name=\"viewport\"]');
    if (!meta) {
      const newMeta = document.createElement('meta');
      newMeta.name = 'viewport';
      newMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';
      document.head.appendChild(newMeta);
    } else {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
    }
  }, []);

  return (
    <Router>
      <AnalyticsWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<BookService />} />
          <Route path="/book/basement-development-regina" element={<BasementProjectFit />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faq" element={<FAQ />} />
          {/* Terms disabled while being rewritten to match SHBA/RenoMark requirements -- see Terms.tsx, kept intact for reuse */}
          <Route path="/terms" element={<Navigate to="/" replace />} />
          <Route path="/logo-test" element={<LogoTest />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnalyticsWrapper>
    </Router>
  );
}
