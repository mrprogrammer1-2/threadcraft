import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] lg:min-h-screen p-0">
      <div className="flex flex-col justify-center relative px-6 py-16 sm:px-10 sm:py-20 lg:p-[80px_48px_80px_80px]">
        <div className="text-[10px] tracking-[0.3em] text-[var(--sienna)] mb-6 sm:mb-8 flex items-center gap-3 uppercase">
          {t("eyebrow")}
        </div>
        <h1 className="leading-none font-black mb-6 sm:mb-8 [font-family:var(--font-family-playfair)] [font-size:clamp(40px,8vw,88px)] [&_em]:italic [&_em]:text-[var(--sienna)] [&_em]:block [&_em]:font-semibold">
          {t("headingLine1")} <br />
          <em>{t("headingEm")}</em>
        </h1>
        <p className="text-base sm:text-lg lg:text-[20px] font-[300] leading-[1.7] text-[#4a3f35] max-w-[420px] mb-10 sm:mb-12 [font-family:var(--font-family-cormorant)]">
          {t("body")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <button className="inline-block px-8 py-3.5 sm:px-10 sm:py-4 bg-(--thread) text-(--cream) font-mono text-[11px] tracking-[0.2em] uppercase no-underline border-none transition-[background,transform] duration-[250ms,200ms] hover:-translate-y-0.5 hover:bg-[var(--ink)] [font-family:var(--font-family-dm-mono)]">
            <Link href="#configurator">{t("ctaPrimary")}</Link>
          </button>
          <button className="text-[11px] tracking-[0.18em] uppercase text-(--ink) no-underline border-b border-(--ink) pb-0.5 transition-[color,border-color] duration-200 hover:text-[var(--sienna)] hover:border-[var(--sienna)]">
            <Link href="#gallery">{t("ctaSecondary")}</Link>
          </button>
        </div>
      </div>
      <div className="bg-(--pale) flex items-center justify-center relative overflow-hidden py-16 sm:py-20 lg:py-0 min-h-[420px] sm:min-h-[520px] lg:min-h-0">
        <div className="w-[260px] h-[318px] sm:w-[320px] sm:h-[391px] lg:w-[360px] lg:h-[440px] relative">
          {/* Shirt SVG */}
          <svg
            className="w-full h-full"
            viewBox="0 0 360 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 40 L20 100 L50 140 L80 120 L80 380 L280 380 L280 120 L310 140 L340 100 L260 40 L220 20 Q180 10 140 20 Z"
              fill="#EDE5D8"
              stroke="#C8B8A2"
              strokeWidth="1.5"
            />
            <path
              d="M140 20 Q180 40 220 20"
              fill="none"
              stroke="#C8B8A2"
              strokeWidth="1.5"
            />
            {/* Collar */}
            <path
              d="M155 22 Q180 50 205 22"
              fill="#F5F0E8"
              stroke="#C8B8A2"
              strokeWidth="1"
            />
            {/* Seams */}
            <line
              x1="80"
              y1="120"
              x2="80"
              y2="380"
              stroke="#C8B8A2"
              strokeWidth="0.5"
              strokeDasharray="3 4"
            />
            <line
              x1="280"
              y1="120"
              x2="280"
              y2="380"
              stroke="#C8B8A2"
              strokeWidth="0.5"
              strokeDasharray="3 4"
            />
          </svg>

          {/* Embroidery Preview */}
          <div className="absolute top-[38%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 lg:w-30 lg:h-30">
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              {/* Decorative embroidery frame */}
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#A0522D"
                strokeWidth="1.5"
                strokeDasharray="5 3"
                opacity="0.7"
              />
              <circle
                cx="60"
                cy="60"
                r="38"
                fill="none"
                stroke="#C8A96E"
                strokeWidth="1"
                strokeDasharray="3 4"
                opacity="0.5"
              />
              {/* Flower motif */}
              <g transform="translate(60,60)">
                <ellipse
                  rx="8"
                  ry="20"
                  fill="none"
                  stroke="#A0522D"
                  strokeWidth="1.5"
                  transform="rotate(0)"
                />
                <ellipse
                  rx="8"
                  ry="20"
                  fill="none"
                  stroke="#A0522D"
                  strokeWidth="1.5"
                  transform="rotate(45)"
                />
                <ellipse
                  rx="8"
                  ry="20"
                  fill="none"
                  stroke="#A0522D"
                  strokeWidth="1.5"
                  transform="rotate(90)"
                />
                <ellipse
                  rx="8"
                  ry="20"
                  fill="none"
                  stroke="#A0522D"
                  strokeWidth="1.5"
                  transform="rotate(135)"
                />
                <circle r="10" fill="#C8A96E" opacity="0.6" />
                <circle r="6" fill="#A0522D" opacity="0.8" />
              </g>
              {/* Corner stitches */}
              <path
                d="M20 20 L30 20 M20 20 L20 30"
                stroke="#A0522D"
                strokeWidth="1"
                opacity="0.5"
              />
              <path
                d="M100 20 L90 20 M100 20 L100 30"
                stroke="#A0522D"
                strokeWidth="1"
                opacity="0.5"
              />
              <path
                d="M20 100 L30 100 M20 100 L20 90"
                stroke="#A0522D"
                strokeWidth="1"
                opacity="0.5"
              />
              <path
                d="M100 100 L90 100 M100 100 L100 90"
                stroke="#A0522D"
                strokeWidth="1"
                opacity="0.5"
              />
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="3s"
                repeatCount="indefinite"
              />
            </svg>
          </div>
        </div>
        <div className="absolute bg-(--ink) text-(--cream) text-[9px] sm:text-[10px] tracking-[0.15em] p-[8px_14px] sm:p-[10px_18px] uppercase top-6 right-4 sm:top-8 sm:-right-5">
          {t("badgeEmbroidered")}
        </div>
        <div className="absolute bg-(--ink) text-(--cream) text-[9px] sm:text-[10px] tracking-[0.15em] p-[8px_14px] sm:p-[10px_18px] uppercase bottom-8 left-4 sm:bottom-15 sm:-left-2">
          {t("badgeShipping")}
        </div>
      </div>
    </section>
  );
}
