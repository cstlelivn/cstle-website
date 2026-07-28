// Google Analytics 4 Implementation
// Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Initialize Google Analytics
export const GA_MEASUREMENT_ID = 'G-TTQCMC7CKS'; // Google Analytics 4 Measurement ID

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }
};

// Predefined tracking events for common actions
export const analytics = {
  // Navigation tracking
  trackNavigation: (destination: string) => {
    trackEvent('navigation_click', {
      destination,
      timestamp: new Date().toISOString(),
    });
  },

  // Form tracking
  trackFormStart: (formName: 'contact' | 'booking' | 'review') => {
    trackEvent('form_start', {
      form_name: formName,
      timestamp: new Date().toISOString(),
    });
  },

  trackFormSubmit: (
    formName: 'contact' | 'booking' | 'review',
    success: boolean
  ) => {
    trackEvent('form_submit', {
      form_name: formName,
      success,
      timestamp: new Date().toISOString(),
    });
  },

  trackFormError: (formName: string, errorType: string) => {
    trackEvent('form_error', {
      form_name: formName,
      error_type: errorType,
      timestamp: new Date().toISOString(),
    });
  },

  // CTA tracking
  trackCTAClick: (ctaName: string, location: string) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      location,
      timestamp: new Date().toISOString(),
    });
  },

  // Gallery tracking
  trackGalleryView: (itemId: string) => {
    trackEvent('gallery_item_view', {
      item_id: itemId,
      timestamp: new Date().toISOString(),
    });
  },

  // Social media tracking
  trackSocialClick: (platform: string) => {
    trackEvent('social_click', {
      platform,
      timestamp: new Date().toISOString(),
    });
  },

  // Phone/Email click tracking
  trackContactClick: (method: 'phone' | 'email') => {
    trackEvent('contact_method_click', {
      method,
      timestamp: new Date().toISOString(),
    });
  },

  // Service interest tracking
  trackServiceInterest: (serviceType: string) => {
    trackEvent('service_interest', {
      service_type: serviceType,
      timestamp: new Date().toISOString(),
    });
  },

  // Download tracking
  trackDownload: (fileName: string) => {
    trackEvent('file_download', {
      file_name: fileName,
      timestamp: new Date().toISOString(),
    });
  },

  // Outbound link tracking
  trackOutboundClick: (url: string) => {
    trackEvent('outbound_click', {
      url,
      timestamp: new Date().toISOString(),
    });
  },

  // Video/Media tracking
  trackMediaPlay: (mediaType: 'video' | 'audio', mediaName: string) => {
    trackEvent('media_play', {
      media_type: mediaType,
      media_name: mediaName,
      timestamp: new Date().toISOString(),
    });
  },

  // Scroll depth tracking
  trackScrollDepth: (depth: 25 | 50 | 75 | 100) => {
    trackEvent('scroll_depth', {
      depth_percentage: depth,
      timestamp: new Date().toISOString(),
    });
  },

  // Time on page tracking
  trackTimeOnPage: (page: string, seconds: number) => {
    trackEvent('time_on_page', {
      page,
      time_seconds: seconds,
      timestamp: new Date().toISOString(),
    });
  },
};

// Custom Supabase-based analytics (optional - for privacy-conscious tracking)
export const trackToSupabase = async (
  eventType: string,
  eventData: Record<string, any>
) => {
  try {
    // This would require a new 'analytics_events' table in Supabase
    // Commented out - implement only if you want self-hosted analytics
    
    // const { error } = await supabase
    //   .from('analytics_events')
    //   .insert({
    //     event_type: eventType,
    //     event_data: eventData,
    //     page_url: window.location.href,
    //     user_agent: navigator.userAgent,
    //     timestamp: new Date().toISOString(),
    //   });
    
    // if (error) console.error('Analytics tracking error:', error);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};