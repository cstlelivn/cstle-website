import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "./pages/Home";
import { Gallery } from "./pages/Gallery";
import { Mission } from "./pages/Mission";
import { Contact } from "./pages/Contact";
import { BookService } from "./pages/BookService";
import { BasementProjectFit } from "./pages/BasementProjectFit";
import { BasementDevelopmentRegina } from "./pages/BasementDevelopmentRegina";
import { Reviews } from "./pages/Reviews";
import { FAQ } from "./pages/FAQ";
import { Terms } from "./pages/Terms";
import { LogoTest } from "./pages/LogoTest";
import { Admin } from "./pages/Admin";
import { AdminSetup } from "./pages/AdminSetup";
import { trackPageView, GA_MEASUREMENT_ID } from "./utils/analytics";
import { rememberAttribution } from "./revenue/intake";

const publicPageSeo: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Cstle Construction | Renovations & Basement Development Regina",
    description: "Cstle Construction provides basement development, renovations and detail-driven interior finishing in Regina and surrounding Saskatchewan communities.",
  },
  "/basement-development-regina": {
    title: "Basement Development Regina | Cstle Construction",
    description: "Plan a finished basement for family living, a legal suite, shortlet use or entertainment with Cstle Construction in Regina, Saskatchewan.",
  },
  "/book/basement-development-regina": {
    title: "Basement Project Fit | Cstle Construction Regina",
    description: "Share your Regina basement goals, investment range and timing in a focused Project Fit assessment from Cstle Construction.",
  },
  "/gallery": {
    title: "Construction & Renovation Work | Cstle Construction Regina",
    description: "Explore selected renovation, basement and interior finishing work completed by Cstle Construction in Regina and Saskatchewan.",
  },
  "/mission": {
    title: "Our Approach | Cstle Construction Regina",
    description: "Learn how Cstle Construction approaches renovation, installation and finishing work with practical planning and attention to detail.",
  },
  "/contact": {
    title: "Contact Cstle Construction | Regina, Saskatchewan",
    description: "Contact Cstle Construction in Regina about basement development, renovations, commercial interiors and detail-driven finishing work.",
  },
  "/faq": {
    title: "Construction & Renovation FAQ | Cstle Construction Regina",
    description: "Answers about working with Cstle Construction on renovations, basement development and finishing projects in Regina and Saskatchewan.",
  },
  "/book": {
    title: "Request a Construction Estimate | Cstle Construction Regina",
    description: "Tell Cstle Construction about your Regina-area renovation, basement, commercial interior or finishing project and request the right next step.",
  },
  "/reviews": {
    title: "Client Reviews | Cstle Construction Regina",
    description: "Read verified client feedback about Cstle Construction projects in Regina and Saskatchewan as it becomes available.",
  },
};

function upsertMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

// Analytics wrapper component to track page views
function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    rememberAttribution();
    const seo = publicPageSeo[location.pathname] ?? publicPageSeo["/"];
    const isPrivateUtility = ["/admin", "/admin-setup", "/logo-test"].includes(location.pathname);
    const canonicalPath = publicPageSeo[location.pathname] ? location.pathname : "/";
    const canonicalUrl = `https://www.cstle.ca${canonicalPath === "/" ? "/" : canonicalPath}`;

    document.title = seo.title;
    upsertMeta('meta[name="description"]', "name", "description", seo.description);
    upsertMeta('meta[name="robots"]', "name", "robots", isPrivateUtility ? "noindex, nofollow" : "index, follow");
    upsertMeta('meta[property="og:title"]', "property", "og:title", seo.title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", seo.description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

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
          <Route path="/basement-development-regina" element={<BasementDevelopmentRegina />} />
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
