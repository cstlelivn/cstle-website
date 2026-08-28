export const MARKETING_EMAIL_CONSENT_VERSION = "email-marketing-v1";

export const MARKETING_EMAIL_CONSENT_TEXT =
  "Send me occasional project planning tips and Cstle updates by email. I can unsubscribe anytime.";

export function marketingConsentEvidence(consented: boolean, sourcePage: string) {
  return {
    marketingEmailConsent: consented,
    marketingConsentVersion: MARKETING_EMAIL_CONSENT_VERSION,
    marketingConsentText: MARKETING_EMAIL_CONSENT_TEXT,
    marketingConsentPage: sourcePage,
    marketingConsentRecordedAt: new Date().toISOString(),
  };
}
