"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PRICING_CONFIG } from "@/lib/pricing";
import { useTranslations, useLocale } from "next-intl";
import { AlertTriangle, Check, Loader2, Save, Coins } from "lucide-react";

export default function PricingSettings() {
  const t = useTranslations("AdminPricingPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [customizationPerSide, setCustomizationPerSide] = useState(
    PRICING_CONFIG.customization.perSide,
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = async () => {
    setStatus("saving");
    console.log("Saving pricing config:", { customizationPerSide });
    // simulated latency until this is wired to the database
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl" dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-sienna mb-1">
          {t("eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold text-cream tracking-tight">
          {t("title")}
        </h1>
        <p className="text-[11px] text-muted mt-1">{t("subtitle")}</p>

        <div className="mt-3 flex items-start gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-amber-300/90">
            {t("notWiredWarning")}
          </p>
        </div>
      </div>

      {/* Customization Pricing */}
      <div className="border border-border bg-surface">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <Coins className="h-3 w-3 text-sienna" />
          <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
            {t("customizationPricingTitle")}
          </p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
              {t("pricePerSide")}
            </label>
            <div className="flex items-center gap-0 border border-border bg-raised focus-within:border-sienna/60 transition-colors">
              <span className="px-3 text-[11px] text-muted font-mono border-r border-border rtl:border-r-0 rtl:border-l select-none">
                EGP
              </span>
              <Input
                type="number"
                step="1"
                min="0"
                value={customizationPerSide}
                onChange={(e) =>
                  setCustomizationPerSide(parseInt(e.target.value) || 0)
                }
                dir="ltr"
                className="flex-1 bg-transparent border-0 text-cream rounded-none focus-visible:ring-0 text-left"
              />
            </div>
            <p className="text-[10px] text-muted mt-1.5">
              {t("pricePerSideHint")}
            </p>
          </div>

          <div className="border border-sienna/20 bg-sienna/5 p-3">
            <p className="text-[11px] text-cream/80 leading-relaxed">
              <span className="text-sienna font-semibold">
                {t("exampleLabel")}{" "}
              </span>
              {t("exampleText", {
                sides: 2,
                price: customizationPerSide,
                total: customizationPerSide * 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border border-border bg-raised/40">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-[9px] tracking-[0.25em] uppercase text-muted">
            {t("summaryTitle")}
          </p>
        </div>
        <div className="p-5 space-y-2 text-[11px] font-mono">
          <div className="flex justify-between text-dim">
            <span>{t("summaryPerSide")}</span>
            <span className="text-cream" dir="ltr">
              {customizationPerSide} EGP
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border text-dim">
            <span>{t("summaryMax")}</span>
            <span className="text-gold" dir="ltr">
              {customizationPerSide * 4} EGP
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={status === "saving"}
        className="w-full py-2.5 border border-sienna/50 text-[10px] tracking-[0.3em] uppercase text-sienna hover:bg-sienna/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
        {status === "saved" && <Check className="h-3 w-3" />}
        {status === "idle" && <Save className="h-3 w-3" />}
        <span>
          {status === "saving"
            ? t("saving")
            : status === "saved"
              ? t("saved")
              : t("saveChanges")}
        </span>
      </button>
    </div>
  );
}
