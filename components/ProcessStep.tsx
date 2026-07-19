import { getLocale } from "next-intl/server";

export default async function ProcessStep({
  num,
  icon,
  title,
  description,
}: {
  num: string;
  icon: string;
  title: string;
  description: string;
}) {
  const locale = await getLocale();
  const isArabic = locale === "ar";

  return (
    <div className="relative p-8 sm:p-10 lg:p-[48px_36px] bg-(--ink) hover:bg-[#241e18] transition-colors duration-200 group">
      <div
        dir="ltr"
        className={`text-5xl sm:text-6xl lg:text-[72px] font-black text-[#2a241e] absolute top-4 sm:top-5 lg:top-[20px] leading-none transition-colors duration-300 group-hover:text-[#3a3028] [font-family:var(--font-family-playfair)] pointer-events-none select-none z-0 ${
          isArabic
            ? "left-4 sm:left-6 lg:left-[24px]"
            : "right-4 sm:right-6 lg:right-[24px]"
        }`}
      >
        {num}
      </div>

      <div className="relative z-10 w-12 h-12 flex items-center justify-center mb-6 sm:mb-7 lg:mb-[28px] text-[20px] border border-[var(--gold)] text-[var(--gold)]">
        {icon}
      </div>

      <div className="relative z-10 text-lg sm:text-xl lg:text-[22px] font-bold mb-3 sm:mb-3.5 lg:mb-[14px] [font-family:'Playfair_Display',serif] text-[var(--cream)]">
        {title}
      </div>
      <p className="relative z-10 text-base leading-[1.8] font-light [font-family:'Cormorant_Garamond',serif] text-[#8a7e74]">
        {description}
      </p>
    </div>
  );
}
