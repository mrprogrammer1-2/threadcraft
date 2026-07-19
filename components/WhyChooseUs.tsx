import { Link } from "@/i18n/navigation";
import SectionSubTitle from "./SectionSubTitle";
import { getLocale, getTranslations } from "next-intl/server";

export default async function WhyChooseUs() {
  const t = await getTranslations("WhyChooseUs");
  const locale = await getLocale();
  const isArabic = locale === "ar";

  const reasons = [
    {
      num: "01",
      title: t("reason1Title"),
      description: t("reason1Desc"),
      detail: t("reason1Detail"),
    },
    {
      num: "02",
      title: t("reason2Title"),
      description: t("reason2Desc"),
      detail: t("reason2Detail"),
    },
    {
      num: "03",
      title: t("reason3Title"),
      description: t("reason3Desc"),
      detail: t("reason3Detail"),
    },
  ];

  return (
    <section className="bg-[var(--ink)] py-16 sm:py-20 lg:py-[120px] px-6 sm:px-10 lg:px-[80px] text-[var(--cream)]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 sm:mb-14 lg:mb-16">
          <SectionSubTitle text={t("eyebrow")} w={120} />
          <h1 className="leading-none font-black font-family-playfair text-[clamp(40px,7vw,88px)]">
            {t("headingLine1")} <br />
            <em className="italic text-[var(--sienna)] block font-semibold">
              {t("headingEm")}
            </em>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#333] border-t border-[#333]">
          {reasons.map((reason) => (
            <div
              key={reason.num}
              className="relative p-8 sm:p-10 lg:p-[48px_36px] bg-[var(--ink)] hover:bg-[#241e18] transition-colors duration-200 group"
            >
              <div
                className={`text-5xl sm:text-6xl lg:text-[72px] font-black text-[#2a241e] absolute top-4 sm:top-5 ${
                  isArabic
                    ? "left-4 sm:left-6 lg:left-[24px]"
                    : "right-4 sm:right-6 lg:right-[24px]"
                } leading-none transition-colors duration-300 group-hover:text-[#3a3028] font-family-playfair`}
              >
                {reason.num}
              </div>
              <div className="w-px h-10 bg-[var(--gold)] opacity-60 mb-6 sm:mb-7 lg:mb-8" />
              <div className="text-[11px] tracking-[0.35em] uppercase text-[var(--gold)] mb-4 font-mono">
                {reason.title}
              </div>
              <p className="text-lg sm:text-xl lg:text-[20px] font-bold leading-tight text-[var(--cream)] mb-4 [font-family:'Playfair_Display',serif]">
                {reason.description}
              </p>
              <p className="text-base leading-[1.8] font-light text-[#8a7e74] mb-8 [font-family:'Cormorant_Garamond',serif]">
                {reason.detail}
              </p>
              <Link
                href="/about"
                className="text-[11px] tracking-[0.18em] uppercase text-[var(--cream)] border-b border-[var(--cream)] pb-0.5 transition-colors hover:text-[var(--sienna)] hover:border-[var(--sienna)]"
              >
                {t("learnMore")}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
