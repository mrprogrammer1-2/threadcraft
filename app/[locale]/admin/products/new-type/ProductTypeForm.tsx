"use client";

import { createProductType } from "@/lib/actions/productsActions";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const IMAGE_PLACEMENTS = [
  "front",
  "back",
  "left-sleeve",
  "right-sleeve",
  "side",
] as const;

const inputCls =
  "w-full bg-[#120e0a] border border-[#2a2420] px-4 py-3 font-[family-name:var(--font-dm-mono)] text-[13px] text-[var(--cream)] outline-none transition-colors focus:border-[var(--sienna)] focus:bg-[#0e0a08] placeholder:text-[#3a3028]";

const labelCls = "block text-[9px] uppercase text-[#6a5e54] mb-2";

const sectionCls =
  "mb-10 p-8 bg-[#1a1410] border border-[#2a2420] animate-[sectionIn_0.4s_ease_forwards] opacity-0 translate-y-4";

export default function ProductTypeForm() {
  const t = useTranslations("AdminProductTypePage");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [isPending, startTransition] = useTransition();
  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setSizes] = useState("");
  const [hasThreadColor, setHasThreadColor] = useState(false);
  const [imagePlacements, setImagePlacements] = useState<string[]>([
    "front",
    "back",
  ]);
  const formRef = useRef<HTMLFormElement | null>(null);

  function clearfrom(result: boolean) {
    if (result) {
      formRef.current?.reset();
      setHasSizes(false);
      setSizes("");
      setHasThreadColor(false);
      setImagePlacements(["front", "back"]);
      formRef.current
        ?.querySelector<HTMLInputElement>("input[name='name']")
        ?.focus();
    }
  }

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createProductType(formData);
      if (result.success) {
        toast.success(t("success"));
        clearfrom(true);
      } else {
        toast.error(t("error"));
      }
    });
  }

  function togglePlacement(value: string) {
    setImagePlacements((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  // Helper mapping dynamic DB keys to your exact JSON localization keys
  function getPlacementTranslationKey(placement: string) {
    switch (placement) {
      case "front":
        return "placementFront";
      case "back":
        return "placementBack";
      case "left-sleeve":
        return "placementLeftSleeve";
      case "right-sleeve":
        return "placementRightSleeve";
      case "side":
        return "placementSide";
      default:
        return "placementFront";
    }
  }

  return (
    <main className="admin-main bg-[#0e0a08] min-h-screen">
      <div className="flex items-end justify-between mb-12 pb-8 border-b border-[#2a2420]">
        <div>
          <div
            className={cn(
              "text-[9px] text-[#4a3f35] mb-3 flex items-center gap-2",
              isArabic ? "" : "tracking-[0.25em] uppercase",
            )}
          >
            {t("breadcrumbProducts")} <span className="text-[#2a2420]">→</span>{" "}
            {t("breadcrumbNewType")}
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[36px] font-black leading-none text-[var(--cream)]">
            {t("title")}
            <br />
            <em className="italic text-[var(--sienna)]">{t("titleAccent")}</em>
          </h1>
          <p className="font-[family-name:var(--font-cormorant)] text-[16px] font-light text-[#6a5e54] mt-1.5">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="stitch-border mb-8" />

      <form action={handleSubmit} ref={formRef}>
        {/* ── 01 Basic Info ── */}
        <div className={sectionCls}>
          <div
            className={cn(
              "text-[8px] text-[var(--sienna)] mb-5 flex items-center gap-3 after:flex-1 after:h-px after:bg-[#2a2420]",
              isArabic ? "" : "tracking-[0.35em] uppercase",
            )}
          >
            {t("basicInfoSection")}
          </div>
          <p className="font-[family-name:var(--font-playfair)] text-[18px] font-bold text-[var(--cream)] mb-1.5">
            {t("basicInfoTitle")}
          </p>
          <p className="font-[family-name:var(--font-cormorant)] text-[15px] font-light text-[#6a5e54] mb-6">
            {t("basicInfoDescription")}
          </p>
          <div>
            <label
              htmlFor="name"
              className={cn(labelCls, isArabic ? "" : "tracking-[0.22em]")}
            >
              {t("typeName")}{" "}
              <span className="text-[var(--sienna)] ml-1">{t("required")}</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder={t("typeNamePlaceholder")}
              className={inputCls}
            />
          </div>
        </div>

        {/* ── 02 Settings ── */}
        <div className={sectionCls}>
          <div
            className={cn(
              "text-[8px] text-[var(--sienna)] mb-5 flex items-center gap-3 after:flex-1 after:h-px after:bg-[#2a2420]",
              isArabic ? "" : "tracking-[0.35em] uppercase",
            )}
          >
            {t("settingsSection")}
          </div>
          <p className="font-[family-name:var(--font-playfair)] text-[18px] font-bold text-[var(--cream)] mb-1.5">
            {t("settingsTitle")}
          </p>
          <p className="font-[family-name:var(--font-cormorant)] text-[15px] font-light text-[#6a5e54] mb-6">
            {t("settingsDescription")}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <ToggleCard
              id="hasSizes"
              name="hasSizes"
              title={t("hasSizesTitle")}
              desc={t("hasSizesDescription")}
              checked={hasSizes}
              onChange={setHasSizes}
              isArabic={isArabic}
            />
            <ToggleCard
              id="hasThreadColor"
              name="hasThreadColor"
              title={t("hasThreadColorTitle")}
              desc={t("hasThreadColorDescription")}
              checked={hasThreadColor}
              onChange={setHasThreadColor}
              isArabic={isArabic}
            />
          </div>

          {hasSizes && (
            <div className="animate-[sectionIn_0.3s_ease_forwards] opacity-0">
              <label
                htmlFor="sizes"
                className={cn(labelCls, isArabic ? "" : "tracking-[0.22em]")}
              >
                {t("sizes")}
              </label>
              <input
                type="text"
                name="sizes"
                id="sizes"
                value={sizes}
                onChange={(e) => setSizes(e.target.value.toUpperCase())}
                placeholder={t("sizesPlaceholder")}
                className={inputCls}
              />
              <p
                className={cn(
                  "text-[10px] text-[#4a3f35] mt-1.5",
                  isArabic ? "" : "tracking-[0.06em]",
                )}
              >
                {t("sizesHint")}
              </p>
            </div>
          )}
        </div>

        {/* ── 03 Image Placements ── */}
        <div className={sectionCls}>
          <div
            className={cn(
              "text-[8px] text-[var(--sienna)] mb-5 flex items-center gap-3 after:flex-1 after:h-px after:bg-[#2a2420]",
              isArabic ? "" : "tracking-[0.35em] uppercase",
            )}
          >
            {t("mediaSection")}
          </div>
          <p className="font-[family-name:var(--font-playfair)] text-[18px] font-bold text-[var(--cream)] mb-1.5">
            {t("mediaTitle")}
          </p>
          <p className="font-[family-name:var(--font-cormorant)] text-[15px] font-light text-[#6a5e54] mb-6">
            {t("mediaDescription")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {IMAGE_PLACEMENTS.map((placement) => (
              <label
                key={placement}
                className={`flex items-center gap-3.5 p-4 border transition-colors cursor-pointer ${
                  imagePlacements.includes(placement)
                    ? "border-[var(--sienna)] bg-[rgba(160,82,45,0.06)]"
                    : "border-[#2a2420] hover:border-[#3a3028]"
                }`}
              >
                <input
                  type="checkbox"
                  name="imagePlacements"
                  value={placement}
                  checked={imagePlacements.includes(placement)}
                  onChange={() => togglePlacement(placement)}
                  className="hidden"
                />
                <div
                  className={`relative w-9 h-5 border rounded-[10px] shrink-0 transition-all ${
                    imagePlacements.includes(placement)
                      ? "border-[var(--sienna)] bg-[rgba(160,82,45,0.2)]"
                      : "border-[#3a3028]"
                  }`}
                >
                  <span
                    className={`absolute top-[3px] left-[3px] w-3 h-3 rounded-full transition-all ${
                      imagePlacements.includes(placement)
                        ? "bg-[var(--sienna)] translate-x-4"
                        : "bg-[#3a3028]"
                    }`}
                  />
                </div>
                <p
                  className={cn(
                    "text-[11px] text-[var(--cream)]",
                    isArabic ? "" : "tracking-[0.1em] uppercase",
                  )}
                >
                  {t(getPlacementTranslationKey(placement))}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* ── Submit Bar ── */}
        <div className="sticky bottom-0 bg-[#0e0a08] border-t border-[#2a2420] px-8 py-5 flex items-center justify-between -mx-[60px] w-[calc(100%+120px)]">
          <div
            className={cn(
              "text-[11px] text-[#4a3f35]",
              isArabic ? "" : "tracking-[0.08em]",
            )}
          >
            {t("ready")}{" "}
            <strong className="text-[var(--gold)]">
              {t("readyHighlight")}
            </strong>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => clearfrom(true)}
              className={cn(
                "px-7 py-3 border border-[#2a2420] font-[family-name:var(--font-dm-mono)] text-[10px] text-[#6a5e54] transition-colors hover:border-[var(--mist)] hover:text-[var(--cream)]",
                isArabic ? "" : "tracking-[0.18em] uppercase",
              )}
            >
              {t("discard")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "flex items-center gap-2.5 px-9 py-3 bg-[var(--thread)] font-[family-name:var(--font-dm-mono)] text-[10px] text-[var(--cream)] transition-colors hover:bg-[var(--sienna)] disabled:opacity-50",
                isArabic ? "" : "tracking-[0.2em] uppercase",
              )}
            >
              {isPending ? <Spinner /> : t("createType")}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

function ToggleCard({
  id,
  name,
  title,
  desc,
  checked,
  onChange,
  isArabic,
}: {
  id: string;
  name: string;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  isArabic: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3.5 p-4 border transition-colors cursor-pointer ${
        checked
          ? "border-[var(--sienna)] bg-[rgba(160,82,45,0.06)]"
          : "border-[#2a2420] hover:border-[#3a3028]"
      }`}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <div
        className={`relative w-9 h-5 border rounded-[10px] shrink-0 transition-all ${
          checked
            ? "border-[var(--sienna)] bg-[rgba(160,82,45,0.2)]"
            : "border-[#3a3028]"
        }`}
      >
        <span
          className={`absolute top-[3px] left-[3px] w-3 h-3 rounded-full transition-all ${
            checked ? "bg-[var(--sienna)] translate-x-4" : "bg-[#3a3028]"
          }`}
        />
      </div>
      <div>
        <p
          className={cn(
            "text-[11px] text-[var(--cream)] mb-0.5",
            isArabic ? "" : "tracking-[0.1em] uppercase",
          )}
        >
          {title}
        </p>
        <p className="font-[family-name:var(--font-cormorant)] text-[14px] font-light text-[#6a5e54]">
          {desc}
        </p>
      </div>
    </label>
  );
}
