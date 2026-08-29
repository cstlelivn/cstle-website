export type QualificationBand = "Hot" | "Warm" | "Nurture" | "Reject";

export type BudgetRange =
  | "Under $35,000"
  | "$35,000–$49,999"
  | "$50,000–$74,999"
  | "$75,000+";

export type ProjectTimeline =
  | "0–3 months"
  | "3–6 months"
  | "6–12 months"
  | "Researching";

export interface ProjectFitAnswers {
  city: string;
  budgetRange: BudgetRange | "";
  timeline: ProjectTimeline | "";
  ownsProperty: boolean;
  financingReady: boolean;
  consultationRequested: boolean;
}

export interface Attribution {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  fbclid: string | null;
  landing_page: string;
  referrer: string | null;
}

const ATTRIBUTION_STORAGE_KEY = "cstle:first-touch-attribution:v1";
const ATTRIBUTION_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

const SERVICE_AREA = new Set([
  "regina",
  "white city",
  "emerald park",
  "pilot butte",
  "balgonie",
]);

function attributionFromCurrentPage(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const value = (key: string) => params.get(key)?.trim() || null;

  return {
    utm_source: value("utm_source"),
    utm_medium: value("utm_medium"),
    utm_campaign: value("utm_campaign"),
    utm_content: value("utm_content"),
    utm_term: value("utm_term"),
    gclid: value("gclid"),
    fbclid: value("fbclid"),
    landing_page: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
  };
}

function hasAcquisitionSignal(attribution: Attribution) {
  return ATTRIBUTION_QUERY_KEYS.some((key) => Boolean(attribution[key]));
}

/**
 * Preserve the first useful acquisition touch for this browser session.
 * Internal navigation from the landing page to Project Fit must not erase the
 * campaign/click identifiers that brought the prospect to Cstle.
 */
export function rememberAttribution(): Attribution {
  const current = attributionFromCurrentPage();

  try {
    const storedValue = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    const stored = storedValue ? JSON.parse(storedValue) as Attribution : null;
    const shouldReplace = !stored || (!hasAcquisitionSignal(stored) && hasAcquisitionSignal(current));

    if (shouldReplace) {
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(current));
      return current;
    }

    return stored;
  } catch {
    return current;
  }
}

export function captureAttribution(): Attribution {
  return rememberAttribution();
}

/** Carry only recognized acquisition parameters into the Project Fit URL. */
export function acquisitionQueryString() {
  const current = new URLSearchParams(window.location.search);
  const forwarded = new URLSearchParams();
  ATTRIBUTION_QUERY_KEYS.forEach((key) => {
    const value = current.get(key)?.trim();
    if (value) forwarded.set(key, value);
  });
  const query = forwarded.toString();
  return query ? `?${query}` : "";
}

export function scoreReginaBasementFit(answers: ProjectFitAnswers) {
  const city = answers.city.trim().toLowerCase();
  if (!SERVICE_AREA.has(city)) {
    return {
      score: 0,
      band: "Reject" as QualificationBand,
      reasons: ["Outside the current Regina service area"],
    };
  }

  let score = 10;
  const reasons = ["Inside service area"];
  const budgetPoints: Record<BudgetRange, number> = {
    "Under $35,000": 0,
    "$35,000–$49,999": 15,
    "$50,000–$74,999": 25,
    "$75,000+": 30,
  };
  const timelinePoints: Record<ProjectTimeline, number> = {
    "0–3 months": 25,
    "3–6 months": 18,
    "6–12 months": 10,
    Researching: 3,
  };

  if (answers.budgetRange) {
    score += budgetPoints[answers.budgetRange];
    reasons.push(
      answers.budgetRange === "Under $35,000"
        ? "Budget below current target"
        : `Budget fit: ${answers.budgetRange}`,
    );
  }
  if (answers.timeline) {
    score += timelinePoints[answers.timeline];
    reasons.push(`Timeline: ${answers.timeline}`);
  }
  if (answers.ownsProperty) {
    score += 15;
    reasons.push("Property secured");
  }
  if (answers.financingReady) {
    score += 10;
    reasons.push("Funding readiness confirmed");
  }
  if (answers.consultationRequested) {
    score += 10;
    reasons.push("Consultation requested");
  }

  score = Math.min(100, score);
  const band: QualificationBand =
    score >= 75 ? "Hot" : score >= 50 ? "Warm" : score >= 25 ? "Nurture" : "Reject";
  return { score, band, reasons };
}
