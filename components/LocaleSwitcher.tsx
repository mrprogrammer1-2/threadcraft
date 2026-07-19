"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
] as const;

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      dir="ltr"
      className="relative flex items-center border border-foreground/15 p-0.5"
    >
      {LOCALES.map(({ code, label }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            onClick={() => {
              if (active) return;
              router.replace(pathname, { locale: code });
              router.refresh();
            }}
            aria-current={active}
            className={`px-2.5 py-1 text-[9px] tracking-[0.25em] uppercase font-mono transition-colors duration-200 ${
              active
                ? "bg-foreground text-background"
                : "text-foreground/50 hover:text-sienna"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
