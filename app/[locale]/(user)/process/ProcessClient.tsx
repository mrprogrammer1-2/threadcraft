import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type StepText = {
  label: string;
  title: string;
  desc: string;
  details: string[];
};
type StatText = { num: string; label: string };
type GuaranteeText = { num: string; title: string; desc: string };
type FaqText = { q: string; a: string };

// Non-translatable visual metadata (numbers/icons stay identical across locales)
const STEP_META = [
  { num: "01", icon: "👕" },
  { num: "02", icon: "✦" },
  { num: "03", icon: "🧵" },
  { num: "04", icon: "📦" },
];

export default async function ProcessPage() {
  const t = await getTranslations("ProcessPage");

  const stepTexts = t.raw("steps") as StepText[];
  const stats = t.raw("stats") as StatText[];
  const guarantees = t.raw("guarantees") as GuaranteeText[];
  const faqs = t.raw("faqs") as FaqText[];

  const steps = STEP_META.map((meta, i) => ({ ...meta, ...stepTexts[i] }));

  return (
    <div className="bg-[#F5F0E8] min-h-screen">
      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 px-4 sm:px-6 md:px-12 lg:px-20 pt-10 sm:pt-16 pb-8 sm:pb-12 border-b border-[#d4c9b8] items-start md:items-end">
        <div>
          <p className="text-[8px] sm:text-[9px] tracking-[0.32em] uppercase text-[#A0522D] font-mono mb-2 sm:mb-3">
            {t("heroEyebrow")}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#1a1310] leading-tight sm:leading-none">
            {t("heroTitleLine1")}
            <br />
            {t("heroTitleLine2")}{" "}
            <span
              style={{
                fontFamily: "Garamond, Georgia, serif",
                fontStyle: "italic",
                color: "#A0522D",
              }}
            >
              {t("heroTitleItalic")}
            </span>
            <br />
            {t("heroTitleLine3")}
          </h1>
        </div>

        <div>
          <p className="text-[12px] sm:text-[13px] text-[#8a7a6e] font-mono leading-relaxed mb-5 sm:mb-6">
            {t("heroBody")}
          </p>

          <div className="grid grid-cols-2 border border-[#d4c9b8]">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`p-4 sm:p-5 ${i % 2 === 1 ? "border-l border-[#d4c9b8]" : ""} ${
                  i >= 2 ? "border-t border-[#d4c9b8]" : ""
                }`}
              >
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1310] leading-none">
                  {s.num}
                </p>
                <p className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#8a7a6e] font-mono mt-1.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`grid md:grid-cols-[64px_1.4fr_1fr] gap-0 ${
              i !== steps.length - 1 ? "border-b border-[#d4c9b8]" : ""
            }`}
          >
            {/* Number column */}
            <div className="hidden md:flex flex-col items-center gap-4 py-10 border-r border-[#d4c9b8]">
              <span
                dir="ltr"
                className="text-[11px] tracking-[0.2em] font-mono text-[#A0522D]"
              >
                {step.num}
              </span>
              <div className="flex-1 w-px bg-[#d4c9b8]" />
              <div className="w-2 h-2 rounded-full bg-[#A0522D]" />
            </div>

            {/* Content */}
            <div className="py-8 sm:py-10 md:px-10 px-0 md:border-r border-[#d4c9b8]">
              <span
                dir="ltr"
                className="md:hidden text-[11px] tracking-[0.2em] font-mono text-[#A0522D] block mb-3"
              >
                {step.num}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1310] mb-3 leading-tight">
                {step.title}
              </h2>
              <p className="text-[12px] sm:text-[13px] text-[#8a7a6e] font-mono leading-relaxed mb-5">
                {step.desc}
              </p>
              <div className="flex flex-col gap-2">
                {step.details.map((d) => (
                  <div
                    key={d}
                    className="flex items-start gap-2.5 text-[10px] sm:text-[11px] font-mono text-[#6b5c4e] leading-relaxed"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#A0522D] mt-1.5 shrink-0" />
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="hidden md:flex items-center justify-center p-10">
              <div className="w-40 h-40 border border-[#d4c9b8] relative flex items-center justify-center">
                <span className="text-5xl">{step.icon}</span>
                <div className="absolute bottom-0 left-0 right-0 bg-[#1a1310] text-[#F5F0E8] text-[8px] tracking-[0.2em] uppercase font-mono py-1.5 text-center">
                  {step.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee strip */}
      <div className="bg-[#1a1310] px-4 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-14 grid md:grid-cols-3 gap-8 md:gap-0">
        {guarantees.map((g, i) => (
          <div
            key={g.title}
            className={`${
              i > 0 ? "md:border-l border-white/10 md:pl-8" : ""
            } ${i < guarantees.length - 1 ? "md:pr-8" : ""}`}
          >
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#A0522D] leading-none mb-2">
              {g.num}
            </p>
            <p className="text-sm font-bold text-[#F5F0E8] mb-1.5">{g.title}</p>
            <p className="text-[10px] sm:text-[11px] text-[#F5F0E8]/50 font-mono leading-relaxed">
              {g.desc}
            </p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-16" id="faq">
        <div className="mb-6 sm:mb-8">
          <p className="text-[8px] sm:text-[9px] tracking-[0.32em] uppercase text-[#A0522D] font-mono mb-2 sm:mb-3">
            {t("faqEyebrow")}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1310]">
            {t("faqTitle")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 border border-[#d4c9b8]">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className={`p-5 sm:p-6 border-[#d4c9b8] ${
                i % 2 === 0 ? "md:border-r" : ""
              } ${i < faqs.length - 1 ? "border-b md:border-b-0" : ""} ${
                i < faqs.length - (faqs.length % 2 === 0 ? 2 : 1)
                  ? "md:border-b"
                  : ""
              }`}
            >
              <p className="text-sm font-bold text-[#1a1310] mb-2">{faq.q}</p>
              <p className="text-[10px] sm:text-[11px] text-[#8a7a6e] font-mono leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom divider label */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 flex items-center gap-3 sm:gap-4 mb-2">
        <div className="h-px flex-1 bg-[#A0522D]/20" />
        <p className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.28em] uppercase text-[#A0522D]/50 font-mono whitespace-nowrap">
          {t("stitchLabel")}
        </p>
        <div className="h-px flex-1 bg-[#A0522D]/20" />
      </div>

      {/* CTA strip */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-14 border-t border-[#d4c9b8] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1310] leading-tight">
          {t("ctaLine1")}
          <br />
          {t("ctaLine2")}{" "}
          <span
            style={{
              fontFamily: "Garamond, Georgia, serif",
              fontStyle: "italic",
              color: "#A0522D",
            }}
          >
            {t("ctaItalic")}
          </span>
        </h2>
        <Link
          href="/shop"
          className="bg-[#A0522D] hover:bg-[#8B4513] text-[#F5F0E8] text-[9px] tracking-[0.2em] uppercase font-mono px-6 sm:px-7 py-3.5 sm:py-4 transition-colors self-start md:self-auto"
        >
          {t("ctaButton")}
        </Link>
      </div>
    </div>
  );
}
