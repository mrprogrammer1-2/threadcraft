import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

type Pillar = { label: string; title: string; body: string };
type Value = { title: string; body: string };
type Stat = { num: string; label: string };

const THREAD_COLORS = ["#A0522D", "#C17A4E", "#7A3B1D"];

function StitchTicks({ color = "#A0522D" }: { color?: string }) {
  return (
    <svg
      className="flex-1 h-3 min-w-[24px]"
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1="6"
        x2="400"
        y2="6"
        stroke={color}
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      {Array.from({ length: 34 }).map((_, i) => (
        <line
          key={i}
          x1={i * 12 + 2}
          y1="1"
          x2={i * 12 + 8}
          y2="11"
          stroke={color}
          strokeOpacity="0.5"
          strokeWidth="1.4"
        />
      ))}
    </svg>
  );
}

function StitchDivider({ label, color }: { label?: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <StitchTicks color={color} />
      {label && (
        <>
          <span className="shrink-0 text-[8px] sm:text-[9px] tracking-[0.32em] uppercase text-[#A0522D]/70 font-[family-name:var(--font-dm-mono)]">
            {label}
          </span>
          <StitchTicks color={color} />
        </>
      )}
    </div>
  );
}

const FABRIC_TEXTURE = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(160,82,45,0.07) 1px, transparent 0)",
  backgroundSize: "18px 18px",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  const t = await getTranslations("AboutPage");
  const tProcess = await getTranslations("ProcessPage");
  const tGallery = await getTranslations("GalleryPage");

  const pillars = t.raw("pillars") as Pillar[];
  const values = t.raw("values") as Value[];
  const stats = tProcess.raw("stats") as Stat[];

  return (
    <main
      className="min-h-screen bg-[#F5F0E8] text-[#1a1310]"
      style={FABRIC_TEXTURE}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-24 pt-20 sm:pt-28 lg:pt-36 pb-10 sm:pb-16">
        <div className="max-w-6xl mx-auto grid gap-8 sm:gap-14 lg:grid-cols-[1.5fr_1fr] items-start">
          <div className="space-y-4 sm:space-y-5">
            <p className="text-[8px] sm:text-[9px] tracking-[0.4em] uppercase text-[#A0522D] font-[family-name:var(--font-dm-mono)]">
              {t("eyebrow")}
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.15] sm:leading-[1.1] tracking-tight">
              {t("headingLine1")}
              <br className="hidden md:block" />{" "}
              <em className="italic font-normal text-[#A0522D]">
                {t("headingEm")}
              </em>
            </h1>
            <p className="max-w-2xl text-base sm:text-lg leading-[1.7] sm:leading-[1.9] text-[#5f4b3c] font-[family-name:var(--font-cormorant)] pt-2">
              {t("intro")}
            </p>
          </div>

          {/* Signature: hand-stitched fact tag, real numbers not decoration */}
          <div className="relative border border-dashed border-[#A0522D]/50 bg-gradient-to-br from-[#A0522D]/10 via-[#F5F0E8] to-[#7A3B1D]/10 p-5 sm:p-6 lg:mt-2">
            <p className="text-[8px] sm:text-[9px] tracking-[0.32em] uppercase text-[#A0522D]/80 font-[family-name:var(--font-dm-mono)] mb-3 sm:mb-4">
              {tGallery("stitchLabel")}
            </p>
            <div className="space-y-3 sm:space-y-4">
              {stats.map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-[#1a1310]">
                      {s.num}
                    </span>
                    <span className="text-[9px] sm:text-[10px] tracking-[0.14em] uppercase text-[#5f4b3c] font-[family-name:var(--font-dm-mono)]">
                      {s.label}
                    </span>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="pt-3 sm:pt-4">
                      <StitchDivider
                        color={THREAD_COLORS[i % THREAD_COLORS.length]}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              className="absolute -bottom-3 -right-3 rtl:-right-auto rtl:-left-3 w-6 h-6 rounded-full border-2 border-[#F5F0E8]"
              style={{ backgroundColor: THREAD_COLORS[0] }}
              aria-hidden
            />
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 md:px-12 lg:px-24">
        <StitchDivider />
      </div>

      {/* Three pillars — tinted linen band to break up the cream */}
      <section className="bg-[#EFE3D0]/70 border-y border-[#d4c9b8]/60">
        <div className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto grid gap-8 sm:gap-10 lg:grid-cols-3">
            {pillars.map(({ label, title, body }, i) => (
              <div key={label} className="relative pt-6 space-y-3 sm:space-y-4">
                <div
                  className="absolute top-0 left-0 rtl:left-auto rtl:right-0 w-5 h-5 border-t-2 border-l-2 rtl:border-l-0 rtl:border-r-2"
                  style={{
                    borderColor: THREAD_COLORS[i % THREAD_COLORS.length],
                  }}
                />
                <p
                  className="text-[8px] sm:text-[9px] tracking-[0.4em] uppercase font-[family-name:var(--font-dm-mono)]"
                  style={{ color: THREAD_COLORS[i % THREAD_COLORS.length] }}
                >
                  {label}
                </p>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-semibold leading-snug">
                  {title}
                </h2>
                <p className="text-base sm:text-lg leading-[1.7] sm:leading-[1.9] text-[#5f4b3c] font-[family-name:var(--font-cormorant)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why + Values */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto grid gap-8 sm:gap-14 lg:grid-cols-[1.3fr_0.7fr] items-start">
          <div className="space-y-5 sm:space-y-6">
            <p className="text-[8px] sm:text-[9px] tracking-[0.4em] uppercase text-[#A0522D] font-[family-name:var(--font-dm-mono)]">
              {t("whyEyebrow")}
            </p>
            <div className="space-y-4 sm:space-y-5 text-[#5f4b3c] font-[family-name:var(--font-cormorant)] text-base sm:text-[1.15rem] leading-[1.7] sm:leading-[1.9]">
              <p>{t("whyParagraph1")}</p>
              <p>{t("whyParagraph2")}</p>
            </div>
          </div>

          {/* Thread-color swatch card */}
          <div className="border border-[#d4c9b8] bg-gradient-to-br from-white to-[#EFE3D0]/80 p-6 sm:p-8 shadow-[0_24px_64px_-32px_rgba(26,19,16,0.25)]">
            <p className="text-[8px] sm:text-[9px] tracking-[0.4em] uppercase text-[#A0522D] font-[family-name:var(--font-dm-mono)] mb-5 sm:mb-6">
              {t("valuesEyebrow")}
            </p>
            <ul className="space-y-5 sm:space-y-6 text-[#5f4b3c] font-[family-name:var(--font-cormorant)] text-[0.95rem] sm:text-[1.05rem] leading-[1.7] sm:leading-[1.8]">
              {values.map(({ title, body }, i) => (
                <li key={title} className="flex gap-3">
                  <span
                    className="mt-2 h-2.5 w-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: THREAD_COLORS[i % THREAD_COLORS.length],
                    }}
                    aria-hidden
                  />
                  <span>
                    <strong className="block text-[#1a1310] font-semibold font-[family-name:var(--font-playfair)] text-base mb-1">
                      {title}
                    </strong>
                    {body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA — full-bleed dark closing band */}
      <section className="bg-[#1a1310] text-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24">
          <div className="pb-8 sm:pb-10">
            <StitchDivider label={tGallery("stitchLabel")} color="#C17A4E" />
          </div>
          <div className="text-center space-y-4 sm:space-y-5">
            <p className="text-[8px] sm:text-[9px] tracking-[0.4em] uppercase text-[#C17A4E] font-[family-name:var(--font-dm-mono)]">
              {t("ctaEyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-4xl font-bold leading-snug">
              {t("ctaTitle")}
            </h2>
            <p className="text-[#d8c9b8] font-[family-name:var(--font-cormorant)] text-base sm:text-[1.15rem] leading-[1.7] sm:leading-[1.9] max-w-xl mx-auto">
              {t("ctaBody")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[#F5F0E8] px-6 sm:px-7 py-3 sm:py-3.5 text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-[#1a1310] font-[family-name:var(--font-dm-mono)] hover:bg-[#C17A4E] hover:text-[#F5F0E8] transition-colors"
              >
                {t("ctaShop")}
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-[#C17A4E] px-6 sm:px-7 py-3 sm:py-3.5 text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-[#C17A4E] font-[family-name:var(--font-dm-mono)] hover:bg-[#C17A4E]/10 transition-colors"
              >
                {t("ctaGallery")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
