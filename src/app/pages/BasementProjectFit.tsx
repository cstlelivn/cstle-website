import { FormEvent, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { trackEvent } from "../utils/analytics";
import {
  BudgetRange,
  captureAttribution,
  ProjectFitAnswers,
  ProjectTimeline,
  scoreReginaBasementFit,
} from "../revenue/intake";
import { MARKETING_EMAIL_CONSENT_TEXT, marketingConsentEvidence } from "../revenue/consent";

type Goal = "Family living space" | "Legal secondary suite" | "Short-term rental (shortlet)" | "Entertainment space" | "Help me plan";

interface FitForm extends ProjectFitAnswers {
  goal: Goal | "";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  details: string;
  company: string;
  marketingEmailConsent: boolean;
}

const initialForm: FitForm = {
  goal: "",
  city: "Regina",
  budgetRange: "",
  timeline: "",
  ownsProperty: false,
  financingReady: false,
  consultationRequested: true,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  details: "",
  company: "",
  marketingEmailConsent: false,
};

const goals: Goal[] = ["Family living space", "Legal secondary suite", "Short-term rental (shortlet)", "Entertainment space", "Help me plan"];
const budgets: BudgetRange[] = ["Under $35,000", "$35,000–$49,999", "$50,000–$74,999", "$75,000+"];
const timelines: ProjectTimeline[] = ["0–3 months", "3–6 months", "6–12 months", "Researching"];

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`min-h-[52px] rounded-[14px] border px-4 py-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,box-shadow,border-color,background-color,color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#191919] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none ${selected ? "-translate-y-px border-[#191919] bg-[#191919] text-white shadow-[0_10px_24px_rgba(0,0,0,0.14)]" : "border-black/10 bg-white text-[#191919] hover:-translate-y-px hover:border-black/25 hover:shadow-[0_10px_28px_rgba(0,0,0,0.09)]"}`}>
      <span className="flex items-center justify-between gap-3 font-['Anybody',_sans-serif] text-[14px] leading-[1.25]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 700 }}>
        {children}{selected && <Check size={17} strokeWidth={2.5} />}
      </span>
    </button>
  );
}

export function BasementProjectFit() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FitForm>(initialForm);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const started = useRef(false);
  const fit = useMemo(() => scoreReginaBasementFit(form), [form]);

  const update = <K extends keyof FitForm>(key: K, value: FitForm[K]) => {
    if (!started.current) {
      started.current = true;
      trackEvent("project_fit_start", { offer: "regina-basement-development" });
    }
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const stepValid = step === 1 ? Boolean(form.goal) : step === 2 ? Boolean(form.city && form.budgetRange && form.timeline) : true;
  const next = () => {
    if (!stepValid) {
      setError("Choose an answer so we can personalize the next step.");
      return;
    }
    trackEvent("project_fit_step", { offer: "regina-basement-development", completed_step: step });
    setStep((current) => Math.min(4, current + 1));
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.company) { setState("success"); return; }
    if (!form.firstName || !form.lastName || (!form.email && !form.phone)) {
      setError("Add your name and either an email address or phone number.");
      return;
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setState("submitting");
    setError("");
    const attribution = captureAttribution();
    try {
      const response = await fetch(`https://${projectId}.supabase.co/rest/v1/leads`, {
        method: "POST",
        headers: { apikey: publicAnonKey, Authorization: `Bearer ${publicAnonKey}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          source_form: "regina-basement-project-fit",
          source_page: "/book/basement-development-regina",
          first_name: form.firstName,
          last_name: form.lastName,
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email || null,
          phone: form.phone || null,
          project_address: form.address || null,
          city: form.city,
          province: "Saskatchewan",
          service_type: "Basement Development",
          project_type: "Basement Development",
          project_details: [form.goal, form.details].filter(Boolean).join(" — "),
          notes: form.details || null,
          status: "new",
          pipeline_stage: fit.band === "Hot" || fit.band === "Warm" ? "Qualified" : "New",
          qualification_band: fit.band,
          qualification_score: fit.score,
          qualification_reasons: fit.reasons,
          qualification_answers: {
            goal: form.goal,
            city: form.city,
            budgetRange: form.budgetRange,
            timeline: form.timeline,
            ownsProperty: form.ownsProperty,
            financingReady: form.financingReady,
            consultationRequested: form.consultationRequested,
            ...marketingConsentEvidence(form.marketingEmailConsent, "/book/basement-development-regina"),
          },
          ...attribution,
        }),
      });
      if (!response.ok) throw new Error(`Lead intake failed (${response.status})`);
      trackEvent("generate_lead", { offer: "regina-basement-development", qualification_band: fit.band, value: fit.score });
      setState("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      console.error("Project Fit submission error", submitError);
      trackEvent("project_fit_error", { offer: "regina-basement-development" });
      setState("error");
      setError("We couldn't send your request. Please try again, or contact Cstle directly.");
    }
  };

  return (
    <div id="basement-project-fit" className="min-h-screen bg-white text-[#191919]" style={{ hyphens: "none", wordBreak: "normal" }}>
      <style>{`
        #basement-project-fit, #basement-project-fit * { -webkit-hyphens: none !important; hyphens: none !important; word-break: normal; }
        #basement-project-fit h1 {
          color: #191919;
          font-size: 24px;
          font-variation-settings: 'wdth' 137 !important;
          font-weight: 700;
          letter-spacing: -0.96px !important;
          line-height: 1.031 !important;
        }
        #basement-project-fit form h2 {
          color: rgba(25, 25, 25, 0.9);
          font-size: 21px;
          font-variation-settings: 'wdth' 135 !important;
          font-weight: 650;
          letter-spacing: -0.45px !important;
          line-height: 1.18 !important;
        }
        @media (min-width: 640px) {
          #basement-project-fit h1 { font-size: 32px; }
          #basement-project-fit form h2 { font-size: 22px; }
        }
        @media (min-width: 768px) {
          #basement-project-fit h1 { font-size: 39.075px; letter-spacing: -1.563px !important; }
          #basement-project-fit form h2 { font-size: 24px; letter-spacing: -0.65px !important; }
        }
      `}</style>
      <section className="bg-gradient-to-b from-[#d9d9d9] to-white px-5 pb-10 pt-7 md:px-10 md:pb-14 md:pt-14">
        <Header />
        <div className="mx-auto mt-12 max-w-[860px] text-center md:mt-14">
          <p className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase tracking-[0.16em]">Regina basement development</p>
          <h1 className="mx-auto mt-5 max-w-[820px] font-['Anybody',_sans-serif] text-[29px] leading-[1.02] tracking-[-1.15px] sm:text-[34px] md:text-[46px] md:tracking-[-2px]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 700 }}>
            <span className="block">Plan the basement</span>
            <span className="block">that works for you.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] font-['Anybody',_sans-serif] text-[12px] leading-[1.55] tracking-[-0.4px] text-[#191919]/70 sm:text-[13px] md:text-[14px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
            Answer a few focused questions. We’ll review your project and recommend the right next step, without the sales pressure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase">
            <span>About 2 minutes</span><span>Clear next steps</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[920px] px-5 pb-24 md:px-10">
        {state === "success" ? (
          <section className="mx-auto mt-4 max-w-[700px] rounded-[24px] border border-black/[0.06] bg-[#e6efc1] p-7 text-center shadow-[0_24px_70px_rgba(32,43,14,0.12)] md:rounded-[32px] md:p-14">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#191919] text-white"><Check size={22} /></div>
            <h2 className="mt-6 font-['Anybody',_sans-serif] text-[25px] leading-[1.05] md:text-[34px]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 700 }}>Your project is now in Cstle.</h2>
            <p className="mx-auto mt-4 max-w-[500px] font-['Anybody',_sans-serif] text-[15px] leading-[1.55]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 600 }}>We’ll review what you shared and contact you about the most useful next step. Your answers help us make that first conversation specific to your project.</p>
          </section>
        ) : (
          <section className="relative mt-4 overflow-hidden rounded-[24px] border border-black/[0.055] bg-[#f4f4f2] p-5 shadow-[0_22px_65px_rgba(0,0,0,0.08)] md:rounded-[32px] md:p-10">
            <div className="mb-9 flex items-center gap-4">
              <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-black/10"><div className="h-full rounded-full bg-[#191919] transition-all" style={{ width: `${step * 25}%` }} /></div>
              <span className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase">{step} / 4</span>
            </div>

            <form key={step} onSubmit={submit} className="animate-in fade-in slide-in-from-right-2 duration-300 motion-reduce:animate-none">
              {step === 1 && <div><p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.12em] text-[#191919]/55">01 — Start with the outcome</p><h2 className="mt-3 max-w-[650px] font-['Anybody',_sans-serif] text-[21px] leading-[1.18] tracking-[-0.45px] text-[#191919]/90 sm:text-[22px] md:max-w-none md:whitespace-nowrap md:!text-[24px] md:tracking-[-0.65px]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 650 }}>What should this basement do for you?</h2><div className="mt-7 grid gap-3 md:grid-cols-2">{goals.map((goal) => <Choice key={goal} selected={form.goal === goal} onClick={() => update("goal", goal)}>{goal}</Choice>)}</div></div>}

              {step === 2 && <div><p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.12em] text-[#191919]/55">02 — Project fit</p><h2 className="mt-3 max-w-[680px] font-['Anybody',_sans-serif]">Where are you in the planning process?</h2><label className="mt-7 block font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase">Project city</label><input value={form.city} onChange={(e) => update("city", e.target.value)} className="mt-2 h-[52px] w-full rounded-[12px] border border-black/10 bg-white px-4 font-['Anybody',_sans-serif] text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none transition-shadow focus:border-black focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 600 }} /><label className="mt-6 block font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase">Working investment range</label><div className="mt-2 grid gap-3 md:grid-cols-2">{budgets.map((budget) => <Choice key={budget} selected={form.budgetRange === budget} onClick={() => update("budgetRange", budget)}>{budget}</Choice>)}</div><label className="mt-6 block font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase">Ideal start</label><div className="mt-2 grid gap-3 md:grid-cols-2">{timelines.map((timeline) => <Choice key={timeline} selected={form.timeline === timeline} onClick={() => update("timeline", timeline)}>{timeline}</Choice>)}</div></div>}

              {step === 3 && <div><p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.12em] text-[#191919]/55">03 — Readiness</p><h2 className="mt-3 max-w-[680px] font-['Anybody',_sans-serif]">A few details help us recommend the right next step.</h2><div className="mt-7 space-y-3"><Choice selected={form.ownsProperty} onClick={() => update("ownsProperty", !form.ownsProperty)}>I own or control the property</Choice><Choice selected={form.financingReady} onClick={() => update("financingReady", !form.financingReady)}>My project funds or financing are ready</Choice><Choice selected={form.consultationRequested} onClick={() => update("consultationRequested", !form.consultationRequested)}>I’d like to discuss this with Cstle</Choice></div><label className="mt-7 block font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase">Anything important we should know? <span className="opacity-50">Optional</span></label><textarea value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Layout, bedrooms, bathroom, shortlet goals, permits, or questions…" rows={4} className="mt-2 w-full resize-y rounded-[12px] border border-black/10 bg-white p-4 font-['Anybody',_sans-serif] text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none transition-shadow focus:border-black focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 600 }} /></div>}

              {step === 4 && <div><p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.12em] text-[#191919]/55">04 — Your next step</p><h2 className="mt-3 max-w-[680px] font-['Anybody',_sans-serif]">Where should we send your project follow-up?</h2><p className="mt-3 max-w-[640px] font-['Anybody',_sans-serif] text-[13px] leading-[1.6] sm:text-[14px]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 600 }}>Share either an email address or phone number. A street address is optional until a site visit is appropriate.</p><div className="mt-7 grid gap-4 md:grid-cols-2">{([['firstName','First name *'],['lastName','Last name *'],['email','Email'],['phone','Phone'],['address','Project address (optional)']] as const).map(([key,label]) => <label key={key} className={key === 'address' ? 'md:col-span-2' : ''}><span className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase">{label}</span><input type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} value={form[key]} onChange={(e) => update(key, e.target.value)} className="mt-2 h-[52px] w-full rounded-[12px] border border-black/10 bg-white px-4 font-['Anybody',_sans-serif] text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none transition-shadow focus:border-black focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 600 }} /></label>)}</div><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[14px] border border-black/10 bg-white p-4 text-left"><input type="checkbox" checked={form.marketingEmailConsent} onChange={(e) => update("marketingEmailConsent", e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#191919]" /><span className="font-['Anybody',_sans-serif] text-[12px] leading-[1.5] text-[#191919]/75 sm:text-[13px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>{MARKETING_EMAIL_CONSENT_TEXT} <span className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase">Optional</span></span></label><input aria-hidden="true" tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => update("company", e.target.value)} className="absolute -left-[9999px] h-0 w-0" /><button disabled={state === "submitting"} className="mt-7 flex min-h-[54px] w-full items-center justify-center rounded-full bg-[#191919] px-6 font-['Roboto_Mono',_sans-serif] text-[11px] font-bold uppercase text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-px hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none disabled:opacity-50">{state === "submitting" ? "Sending…" : "Send my project fit request"}</button><p className="mt-4 text-center font-['Roboto_Mono',_sans-serif] text-[9px] uppercase leading-[1.5] opacity-60">By submitting, you’re asking Cstle to contact you about this project. Marketing is optional.</p></div>}

              {error && <p role="alert" className="mt-5 rounded-[12px] bg-[#f6d4cb] p-4 font-['Anybody',_sans-serif] text-[13px]" style={{ fontVariationSettings: "'wdth' 135", fontWeight: 700 }}>{error}</p>}
              {step < 4 && <div className="mt-8 flex items-center justify-between gap-3"><button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} className={`flex min-h-[48px] items-center gap-2 rounded-full px-4 font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase transition-colors hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${step === 1 ? "invisible" : ""}`}><ChevronLeft size={16} /> Back</button><button type="button" onClick={next} className="flex min-h-[50px] items-center gap-2 rounded-full bg-[#191919] px-6 font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase text-white shadow-[0_8px_22px_rgba(0,0,0,0.14)] transition-[transform,box-shadow] duration-300 hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none">Continue <ChevronRight size={16} /></button></div>}
            </form>
          </section>
        )}

        <section aria-label="What happens next" className="grid gap-8 border-t border-black/10 py-12 md:grid-cols-3 md:gap-0 md:py-14"><div className="md:pr-7"><p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.1em] text-[#191919]/65">01 · Fit review</p><p className="mt-3 max-w-[250px] font-['Anybody',_sans-serif] text-[12px] leading-[1.55] text-[#191919]/70" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>We review your goals, location, timing and budget.</p></div><div className="md:border-l md:border-black/10 md:px-7"><p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.1em] text-[#191919]/65">02 · Focused conversation</p><p className="mt-3 max-w-[250px] font-['Anybody',_sans-serif] text-[12px] leading-[1.55] text-[#191919]/70" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>If it fits, we discuss your actual project—not a sales script.</p></div><div className="md:border-l md:border-black/10 md:pl-7"><p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.1em] text-[#191919]/65">03 · Clear next step</p><p className="mt-3 max-w-[250px] font-['Anybody',_sans-serif] text-[12px] leading-[1.55] text-[#191919]/70" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>We recommend the right move: planning, consultation or site visit.</p></div></section>
      </main>
      <Footer />
    </div>
  );
}
