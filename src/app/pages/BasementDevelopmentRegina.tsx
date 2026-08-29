import { useEffect } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import basementLivingImage from "../../assets/6c9c81f004e621b623a432bdb1fdea2a2f3038e9.png";
import basementMediaImage from "../../assets/0947c4766c3b4a3b6f639f6e1266d28c06a80a54.png";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { trackEvent } from "../utils/analytics";
import { acquisitionQueryString } from "../revenue/intake";

const fitPath = "/book/basement-development-regina";

const outcomes = [
  {
    label: "Everyday living",
    title: "More room for real life.",
    body: "Create a comfortable family room, guest space, home office or a combination that makes the whole house work better.",
  },
  {
    label: "Income potential",
    title: "A suite planned properly.",
    body: "Explore a legal secondary suite or shortlet layout with the practical requirements considered from the beginning.",
  },
  {
    label: "A better experience",
    title: "A space people want to use.",
    body: "Bring together lighting, storage, finishes and entertainment needs so the basement feels intentional—not leftover.",
  },
];

const process = [
  ["01", "Share the outcome", "Tell us what the basement needs to do, your timing and a realistic investment range."],
  ["02", "Review the fit", "We review the project before recommending a conversation, planning step or site visit."],
  ["03", "Build with clarity", "When the project is a fit, scope and next steps move forward in one connected Cstle process."],
];

const questions = [
  ["How much should I plan to invest?", "The right range depends on size, existing conditions, layout, plumbing, electrical work and the level of finish. The two-minute Project Fit assessment gives us enough context to recommend a useful next step instead of guessing."],
  ["Can you help if I do not have the layout figured out?", "Yes. You only need to know what you want the basement to accomplish. We can use that outcome, your priorities and the existing space to clarify the right planning direction."],
  ["What if I am considering a legal suite or shortlet?", "Choose that outcome in Project Fit and share what you already know. We will consider the practical scope and identify the questions that need to be resolved before the project moves forward."],
  ["Do I have to be ready to start immediately?", "No. The assessment includes a researching option. Being honest about timing helps us give you the right next step without forcing a sales conversation too early."],
];

function ConversionLink({ location, light = false, children }: { location: string; light?: boolean; children: React.ReactNode }) {
  const destination = `${fitPath}${acquisitionQueryString()}`;
  return (
    <Link
      to={destination}
      onClick={() => trackEvent("basement_funnel_cta", { offer: "regina-basement-development", location })}
      className={`group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full px-6 font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase tracking-[0.02em] transition-[transform,box-shadow,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none ${light ? "bg-white text-[#191919] shadow-[0_10px_34px_rgba(0,0,0,0.2)] hover:-translate-y-px hover:bg-[#f4f4f2] focus-visible:ring-white" : "bg-[#191919] text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] hover:-translate-y-px hover:shadow-[0_14px_36px_rgba(0,0,0,0.22)] focus-visible:ring-[#191919]"}`}
    >
      {children}<ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function BasementDevelopmentRegina() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = "Plan a finished basement for family living, a legal suite, shortlet use or entertainment with Cstle in Regina, Saskatchewan.";
    document.title = "Basement Development Regina | Cstle Livn";

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const createdMeta = !meta;
    const previousDescription = meta?.content;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonical;
    const previousCanonical = canonical?.href;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://www.cstle.ca/basement-development-regina";
    trackEvent("basement_funnel_view", { offer: "regina-basement-development" });

    return () => {
      document.title = previousTitle;
      if (createdMeta) meta?.remove();
      else if (meta && previousDescription !== undefined) meta.content = previousDescription;
      if (createdCanonical) canonical?.remove();
      else if (canonical && previousCanonical) canonical.href = previousCanonical;
    };
  }, []);

  return (
    <div id="regina-basement-funnel" className="min-h-screen bg-[#f5f5f3] text-[#191919]">
      <style>{`
        #regina-basement-funnel, #regina-basement-funnel * {
          -webkit-hyphens: none !important;
          hyphens: none !important;
          word-break: normal !important;
          overflow-wrap: normal;
        }
        #regina-basement-funnel .body-copy {
          font-family: 'Anybody', sans-serif;
          font-variation-settings: 'wdth' 137;
          font-weight: 500;
          letter-spacing: -0.018em;
        }
      `}</style>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#d9d9d9_0%,#efefed_72%,#f5f5f3_100%)] px-5 pb-12 pt-7 md:px-10 md:pb-20 md:pt-14">
        <Header />
        <div className="mx-auto grid max-w-[1280px] items-end gap-10 pt-14 md:pt-20 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
          <div className="pb-1 lg:pb-8">
            <p className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase tracking-[0.15em] text-[#191919]/70">Basement development · Regina</p>
            <h1 className="brand-heading brand-heading--hero mt-5 max-w-[620px]">
              More room for the life you want.
            </h1>
            <p className="body-copy mt-6 max-w-[570px] text-[15px] leading-[1.55] text-[#191919]/68 sm:text-[17px]">
              Plan a finished basement around how you want to live, earn or grow—then move forward with a clear, practical next step.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <ConversionLink location="hero">Check your project fit</ConversionLink>
              <p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase leading-[1.5] text-[#191919]/55">About 2 minutes · No-pressure review</p>
            </div>
          </div>

          <div className="relative min-h-[400px] overflow-hidden rounded-[26px] bg-[#d2d2cf] shadow-[0_34px_90px_rgba(0,0,0,0.15)] md:min-h-[500px] md:rounded-[36px]">
            <img src={basementLivingImage} alt="A bright finished living space with comfortable seating" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.015] motion-reduce:transform-none" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-6 pb-6 pt-28 text-white md:px-8 md:pb-8">
              <p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.12em] text-white/70">Start with the outcome</p>
              <p className="body-copy mt-2 max-w-[440px] text-[14px] leading-[1.45] text-white/82 md:text-[16px]">Built around your reason, not just square footage.</p>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <p className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase tracking-[0.14em] text-[#536329]">Choose the outcome</p>
              <h2 className="brand-heading brand-heading--section max-w-[790px]">The right basement begins with what it needs to change for you.</h2>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {outcomes.map((outcome, index) => (
                <article key={outcome.label} className="group rounded-[22px] border border-black/[0.065] bg-white p-6 shadow-[0_4px_18px_rgba(0,0,0,0.035)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#72813d]/30 hover:shadow-[0_18px_46px_rgba(0,0,0,0.08)] motion-reduce:transform-none md:min-h-[310px] md:p-8">
                  <div className="flex items-center justify-between">
                    <p className="font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.1em] text-[#191919]/55">0{index + 1} · {outcome.label}</p>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#899a4a] opacity-55 transition-opacity group-hover:opacity-100" />
                  </div>
                  <h3 className="brand-heading brand-heading--card mt-16 md:mt-20">{outcome.title}</h3>
                  <p className="body-copy mt-4 text-[14px] leading-[1.55] text-[#191919]/63">{outcome.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#191919] px-5 py-20 text-white md:px-10 md:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <div className="relative min-h-[390px] overflow-hidden rounded-[24px] bg-[#30302e] md:min-h-[590px] md:rounded-[32px]">
              <img src={basementMediaImage} alt="A calm finished media wall with integrated lighting and storage" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </div>
            <div>
              <p className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase tracking-[0.14em] text-[#b7c679]">Clear before complicated</p>
              <h2 className="brand-heading brand-heading--section mt-5 max-w-[600px]">Know the next move before committing to the whole project.</h2>
              <p className="body-copy mt-6 max-w-[520px] text-[15px] leading-[1.6] text-white/64">You should not need a construction vocabulary to begin. Project Fit gives us the few details that actually shape the recommendation.</p>
              <ul className="mt-8 space-y-4">
                {["Your intended use and priorities", "A workable investment range", "Your preferred timing and readiness", "The right next conversation—not a generic sales call"].map((item) => (
                  <li key={item} className="flex items-start gap-3 border-t border-white/10 pt-4 font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase leading-[1.5] text-white/78"><Check size={15} className="mt-px shrink-0 text-[#b7c679]" />{item}</li>
                ))}
              </ul>
              <div className="mt-9"><ConversionLink location="clarity" light>Start Project Fit</ConversionLink></div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1180px]">
            <p className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase tracking-[0.14em] text-[#536329]">One connected path</p>
            <h2 className="brand-heading brand-heading--section mt-5 max-w-[720px]">From an idea downstairs to a useful plan forward.</h2>
            <div className="mt-12 grid border-y border-black/10 md:grid-cols-3">
              {process.map(([number, title, body], index) => (
                <article key={number} className={`py-8 md:min-h-[285px] md:px-8 md:py-10 ${index > 0 ? "border-t border-black/10 md:border-l md:border-t-0" : ""}`}>
                  <p className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold text-[#536329]">{number}</p>
                  <h3 className="brand-heading brand-heading--card mt-12">{title}</h3>
                  <p className="body-copy mt-4 max-w-[300px] text-[14px] leading-[1.55] text-[#191919]/62">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#e5edc4] px-5 py-20 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase tracking-[0.14em] text-[#536329]">Before you begin</p>
              <h2 className="brand-heading brand-heading--section mt-5 max-w-[480px]">The questions people usually ask first.</h2>
              <p className="body-copy mt-5 max-w-[440px] text-[14px] leading-[1.6] text-[#191919]/62">Useful answers now make the first conversation better later.</p>
            </div>
            <div className="border-t border-black/15">
              {questions.map(([question, answer]) => (
                <details key={question} className="group border-b border-black/15 py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#536329] focus-visible:ring-offset-4 focus-visible:ring-offset-[#e5edc4]">
                    <span className="brand-heading brand-heading--question">{question}</span>
                    <ChevronDown size={18} className="shrink-0 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="body-copy max-w-[720px] pb-6 pr-8 text-[14px] leading-[1.6] text-[#191919]/65">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f5f3] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1180px] rounded-[28px] bg-[#191919] px-6 py-14 text-center text-white shadow-[0_28px_80px_rgba(0,0,0,0.16)] md:rounded-[38px] md:px-14 md:py-20">
            <p className="font-['Roboto_Mono',_sans-serif] text-[10px] font-bold uppercase tracking-[0.14em] text-[#b7c679]">Your basement · Your next move</p>
            <h2 className="brand-heading brand-heading--section mx-auto mt-5 max-w-[820px]">Plan the basement that works for you.</h2>
            <p className="body-copy mx-auto mt-5 max-w-[570px] text-[14px] leading-[1.6] text-white/62 sm:text-[16px]">Answer a few focused questions and let us recommend the most useful next step for your Regina project.</p>
            <div className="mt-8"><ConversionLink location="final" light>Check my project fit</ConversionLink></div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <ConversionLink location="mobile_sticky">Check your project fit</ConversionLink>
      </div>
      <Footer />
    </div>
  );
}
