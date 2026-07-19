"use client";

import UploadProductImage from "@/components/UploadProductImages";
import Image from "next/image";
import { useRef, useState, useTransition, useEffect, useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";
import { createProduct } from "@/lib/actions/productsActions";
import { toast } from "react-toastify";
import { getProductTypes } from "@/lib/queries/productsQueriry";
import { PositionPicker } from "./PositionPicker";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full bg-[#120e0a] border border-[#2a2420] px-4 py-3 font-[family-name:var(--font-dm-mono)] text-[13px] text-[var(--cream)] outline-none transition-colors focus:border-[var(--sienna)] focus:bg-[#0e0a08] placeholder:text-[#3a3028]";

const FONTS = [
  { id: "playfairItalic", index: 0 },
  { id: "cormorant", index: 1 },
  { id: "dmMono", index: 2 },
] as const;

const THREAD_COLORS = [
  { id: "sienna", hex: "#A0522D" },
  { id: "gold", hex: "#C9A84C" },
  { id: "ivory", hex: "#F5F0E8" },
  { id: "navy", hex: "#1B2A4A" },
  { id: "black", hex: "#1a1310" },
  { id: "sage", hex: "#7C9070" },
  { id: "burgundy", hex: "#6B2737" },
] as const;

const CUSTOMIZATION_MODES = [
  {
    mode: "none" as const,
    titleKey: "modeReadyTitle",
    descKey: "modeReadyDesc",
  },
  { mode: "free" as const, titleKey: "modeFreeTitle", descKey: "modeFreeDesc" },
  {
    mode: "template" as const,
    titleKey: "modeTemplateTitle",
    descKey: "modeTemplateDesc",
  },
];

export default function ProductForm() {
  const t = useTranslations("AdminProductFormPage");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const labelCls = cn(
    "block text-[9px] text-[#6a5e54] mb-2",
    isArabic ? "" : "tracking-[0.22em] uppercase",
  );

  const sectionCls =
    "mb-10 p-8 bg-[#1a1410] border border-[#2a2420] animate-[sectionIn_0.4s_ease_forwards] opacity-0 translate-y-4";

  const sectionEyebrowCls = cn(
    "text-[8px] text-(--sienna) mb-5 flex items-center gap-3 after:flex-1 after:h-px after:bg-[#2a2420]",
    isArabic ? "" : "tracking-[0.35em] uppercase",
  );

  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<ProductImageInput[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const config = selectedType ?? {
    hasSizes: false,
    sizes: [],
    hasThreadColor: false,
    imagePlacements: [],
  };
  const formRef = useRef<HTMLFormElement | null>(null);

  // Studio mode
  const [studioMode, setStudioMode] = useState<"none" | "free" | "template">(
    "none",
  );

  // Template config state
  const [nameplateTop, setNameplateTop] = useState("62%");
  const [nameplateLeft, setNameplateLeft] = useState("50%");
  const [nameplateWidth, setNameplateWidth] = useState(120);
  const [nameplateFontIndex, setNameplateFontIndex] = useState(0);
  const [nameplateThreadHex, setNameplateThreadHex] = useState("#A0522D");
  const [nameplatePlaceholder, setNameplatePlaceholder] = useState("");
  const [hasBaseDesign, setHasBaseDesign] = useState(false);
  const [baseDesignId, setBaseDesignId] = useState("");
  const [baseDesignThreadHex, setBaseDesignThreadHex] = useState("#A0522D");
  const [baseDesignTop, setBaseDesignTop] = useState("45%");
  const [baseDesignLeft, setBaseDesignLeft] = useState("50%");
  const [baseDesignWidth, setBaseDesignWidth] = useState(110);
  const [designs, setDesigns] = useState<
    { id: string; key: string; label: string }[]
  >([]);

  // Front image used as the live preview background for placement pickers
  const frontImage = images.find((img) => img.place === "front")?.url;

  useEffect(() => {
    startTransition(async () => {
      const data = await getProductTypes();
      setTypes(data);
      if (data.length) setSelectedType(data[0]);
    });
  }, []);

  useEffect(() => {
    if (studioMode === "template") {
      fetch("/api/designs")
        .then((r) => r.json())
        .then(setDesigns)
        .catch(() => {});
    }
  }, [studioMode]);

  function clearfrom(result: boolean) {
    if (result) {
      setImages([]);
      setVariants([]);
      setStudioMode("none");
      setNameplateTop("62%");
      setNameplateLeft("50%");
      setNameplateWidth(120);
      setNameplateFontIndex(0);
      setNameplateThreadHex("#A0522D");
      setNameplatePlaceholder("");
      setHasBaseDesign(false);
      setBaseDesignId("");
      setBaseDesignThreadHex("#A0522D");
      setBaseDesignTop("45%");
      setBaseDesignLeft("50%");
      setBaseDesignWidth(110);
      formRef.current?.reset();
      formRef.current
        ?.querySelector<HTMLInputElement>("input[name='name']")
        ?.focus();
    }
  }

  function action(formData: FormData) {
    formData.set("studioMode", studioMode);
    if (studioMode === "template") {
      const templateConfig = {
        baseDesign:
          hasBaseDesign && baseDesignId
            ? {
                designId: baseDesignId,
                threadHex: baseDesignThreadHex,
                top: baseDesignTop,
                left: baseDesignLeft,
                width: baseDesignWidth,
              }
            : null,
        nameplate: {
          top: nameplateTop,
          left: nameplateLeft,
          width: nameplateWidth,
          fontIndex: nameplateFontIndex,
          threadHex: nameplateThreadHex,
          placeholder: nameplatePlaceholder || t("yourNamePlaceholder"),
        },
      };
      formData.set("templateConfig", JSON.stringify(templateConfig));
    }
    startTransition(async () => {
      const result = await createProduct(formData);
      if (result.success) {
        toast.success(t("toastSuccess"));
        clearfrom(true);
      } else {
        toast.error(t("toastError"));
      }
    });
  }

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const type = types.find((item) => item.id === e.target.value) ?? null;
    setSelectedType(type);
  }

  const selectedNameplateColorLabel = THREAD_COLORS.find(
    (c) => c.hex === nameplateThreadHex,
  )?.id;

  const variantColumns = [
    { key: "colColor", show: true },
    { key: "colSize", show: config.hasSizes },
    { key: "colStock", show: true },
    { key: "colPrice", show: true },
  ].filter((c) => c.show);

  return (
    <main className="admin-main bg-[#0e0a08] min-h-screen">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-12 pb-8 border-b border-[#2a2420]">
        <div>
          <div
            className={cn(
              "text-[9px] text-[#4a3f35] mb-3 flex items-center gap-2",
              isArabic ? "" : "tracking-[0.25em] uppercase",
            )}
          >
            {t("breadcrumbProducts")}{" "}
            <span className="text-[#2a2420]">{isArabic ? "←" : "→"}</span>{" "}
            {t("breadcrumbNew")}
          </div>
          <h1 className="font-(family-name:--font-playfair) text-[36px] font-black leading-none text-(--cream)">
            {t("heroCreate")}
            <br />
            <em className="italic text-(--sienna)">{t("heroProduct")}</em>
          </h1>
          <p className="font-(family-name:--font-cormorant) text-[16px] font-light text-[#6a5e54] mt-1.5">
            {t("heroSubtitle")}
          </p>
        </div>
        {/* Step indicator */}
        <div className="flex items-center">
          {[
            { num: "✓", labelKey: "stepInfo", color: "text-[var(--sienna)]" },
            { num: "2", labelKey: "stepImages", color: "text-[var(--gold)]" },
            { num: "3", labelKey: "stepVariants", color: "text-[#3a3028]" },
          ].map((step, i) => (
            <div key={step.labelKey} className="flex items-center">
              {i > 0 && <div className="w-8 h-px bg-[#2a2420] mx-2" />}
              <div
                className={cn(
                  "flex items-center gap-2 text-[9px]",
                  isArabic ? "" : "tracking-[0.15em] uppercase",
                  step.color,
                )}
              >
                <div className="w-6 h-6 border border-current rounded-full flex items-center justify-center text-[9px]">
                  {step.num}
                </div>
                {t(step.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stitch accent */}
      <div className="stitch-border mb-8" />

      <form ref={formRef} action={action}>
        <input type="hidden" name="images" value={JSON.stringify(images)} />
        <input type="hidden" name="variants" value={JSON.stringify(variants)} />

        {/* ── 01 Basic Info ── */}
        <div className={sectionCls}>
          <div className={sectionEyebrowCls}>{t("section01")}</div>
          <p className="font-(family-name:--font-playfair) text-[18px] font-bold text-(--cream) mb-1.5">
            {t("productDetailsTitle")}
          </p>
          <p className="font-(family-name:--font-cormorant) text-[15px] font-light text-[#6a5e54] mb-6">
            {t("productDetailsSubtitle")}
          </p>

          <div className="mb-5">
            <label className={labelCls}>
              {t("productNameLabel")}{" "}
              <span className="text-(--sienna) ml-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder={t("productNamePlaceholder")}
              className={inputCls}
            />
          </div>

          <div className="mb-5">
            <label className={labelCls}>{t("descriptionLabel")}</label>
            <textarea
              name="description"
              rows={3}
              placeholder={t("descriptionPlaceholder")}
              className={`${inputCls} resize-y leading-relaxed`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                {t("basePriceLabel")}{" "}
                <span className="text-(--sienna) ml-1">*</span>
              </label>
              <input
                name="price"
                type="number"
                required
                placeholder="1999"
                className={inputCls}
              />
              <p
                className={cn(
                  "text-[10px] text-[#4a3f35] mt-1.5",
                  isArabic ? "" : "tracking-[0.06em]",
                )}
              >
                {t("basePriceHint")}
              </p>
            </div>
            <div>
              <label className={labelCls}>
                {t("productTypeLabel")}{" "}
                <span className="text-(--sienna) ml-1">*</span>
              </label>
              <select
                name="typeId"
                value={selectedType?.id || ""}
                onChange={(e) => handleTypeChange(e)}
                className={`${inputCls} bg-[image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A0522D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")] bg-no-repeat bg-position-[right_14px_center] pr-9 appearance-none`}
              >
                {types.map((type) => (
                  <option
                    key={type.id}
                    value={type.id}
                    className="bg-[#1a1410]"
                  >
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── 02 Settings ── */}
        <div className={sectionCls}>
          <div className={sectionEyebrowCls}>{t("section02")}</div>
          <p className="font-(family-name:--font-playfair) text-[18px] font-bold text-(--cream) mb-1.5">
            {t("productFlagsTitle")}
          </p>
          <p className="font-(family-name:--font-cormorant) text-[15px] font-light text-[#6a5e54] mb-6">
            {t("productFlagsSubtitle")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ToggleCard
              name="featured"
              title={t("featuredTitle")}
              desc={t("featuredDesc")}
              isArabic={isArabic}
            />
          </div>
        </div>

        {/* ── 03 Studio Mode ── */}
        <div className={sectionCls}>
          <div className={sectionEyebrowCls}>{t("section03")}</div>
          <p className="font-(family-name:--font-playfair) text-[18px] font-bold text-(--cream) mb-1.5">
            {t("customizationModeTitle")}
          </p>
          <p className="font-(family-name:--font-cormorant) text-[15px] font-light text-[#6a5e54] mb-6">
            {t("customizationModeSubtitle")}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {CUSTOMIZATION_MODES.map(({ mode, titleKey, descKey }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setStudioMode(mode)}
                className={`p-5 border text-left transition-all ${
                  studioMode === mode
                    ? "border-[var(--sienna)] bg-[rgba(160,82,45,0.06)]"
                    : "border-[#2a2420] hover:border-[#3a3028]"
                }`}
              >
                <p
                  className={cn(
                    "text-[11px] text-(--cream) mb-1.5",
                    isArabic ? "" : "tracking-[0.14em] uppercase",
                  )}
                >
                  {t(titleKey)}
                </p>
                <p className="font-(family-name:--font-cormorant) text-[14px] text-wrap font-light text-[#6a5e54]">
                  {t(descKey)}
                </p>
              </button>
            ))}
          </div>

          {/* Template config — only shown when template mode is selected */}
          {studioMode === "template" && (
            <div className="space-y-8 animate-[sectionIn_0.3s_ease_forwards] opacity-0">
              {!frontImage && (
                <div className="p-4 border border-[var(--gold)] bg-[rgba(201,168,76,0.08)] text-[12px] font-(family-name:--font-cormorant) text-[var(--gold)]">
                  {t("uploadFrontWarning")}
                </div>
              )}

              <div>
                <p
                  className={cn(
                    "text-[10px] text-(--sienna) mb-2",
                    isArabic ? "" : "tracking-[0.2em] uppercase",
                  )}
                >
                  {t("namePositionTitle")}
                </p>
                <p className="font-(family-name:--font-cormorant) text-[14px] text-[#6a5e54] mb-4">
                  {t("namePositionSubtitle")}
                </p>

                <div className="mb-4">
                  <PositionPicker
                    imageUrl={frontImage}
                    top={nameplateTop}
                    left={nameplateLeft}
                    width={nameplateWidth}
                    onPositionChange={(t, l) => {
                      setNameplateTop(t);
                      setNameplateLeft(l);
                    }}
                    markerColor={nameplateThreadHex}
                    markerText={
                      nameplatePlaceholder || t("yourNamePlaceholder")
                    }
                    label={t("nameplatePositionLabel")}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className={labelCls}>{t("widthPxLabel")}</label>
                    <input
                      type="number"
                      value={nameplateWidth}
                      onChange={(e) =>
                        setNameplateWidth(Number(e.target.value))
                      }
                      placeholder="120"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className={labelCls}>{t("fontLabel")}</label>
                    <div className="flex flex-col gap-2">
                      {FONTS.map((f) => (
                        <button
                          key={f.index}
                          type="button"
                          onClick={() => setNameplateFontIndex(f.index)}
                          className={`px-3 py-2 border text-left text-[11px] transition-all ${
                            nameplateFontIndex === f.index
                              ? "border-[var(--sienna)] bg-[rgba(160,82,45,0.06)] text-(--cream)"
                              : "border-[#2a2420] text-[#6a5e54] hover:border-[#3a3028]"
                          }`}
                        >
                          {t(`fonts.${f.id}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t("threadColorLabel")}</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {THREAD_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          title={t(`threadColors.${c.id}`)}
                          onClick={() => setNameplateThreadHex(c.hex)}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            nameplateThreadHex === c.hex
                              ? "border-[var(--cream)] scale-110"
                              : "border-transparent hover:scale-105"
                          }`}
                          style={{ background: c.hex }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-[#4a3f35]">
                      {t("selectedColor", {
                        color: selectedNameplateColorLabel
                          ? t(`threadColors.${selectedNameplateColorLabel}`)
                          : "",
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>
                    {t("placeholderTextLabel")}
                  </label>
                  <input
                    type="text"
                    value={nameplatePlaceholder}
                    onChange={(e) => setNameplatePlaceholder(e.target.value)}
                    placeholder={t("yourNamePlaceholder")}
                    className={inputCls}
                  />
                  <p
                    className={cn(
                      "text-[10px] text-[#4a3f35] mt-1.5",
                      isArabic ? "" : "tracking-[0.06em]",
                    )}
                  >
                    {t("placeholderHint")}
                  </p>
                </div>
              </div>

              {/* Base design */}
              <div className="border-t border-[#2a2420] pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p
                      className={cn(
                        "text-[10px] text-(--sienna) mb-1",
                        isArabic ? "" : "tracking-[0.2em] uppercase",
                      )}
                    >
                      {t("baseDesignTitle")}
                    </p>
                    <p className="font-(family-name:--font-cormorant) text-[14px] text-[#6a5e54]">
                      {t("baseDesignSubtitle")}
                    </p>
                  </div>
                  <label
                    className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                      hasBaseDesign
                        ? "border-[var(--sienna)] bg-[rgba(160,82,45,0.06)]"
                        : "border-[#2a2420] hover:border-[#3a3028]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={hasBaseDesign}
                      onChange={(e) => setHasBaseDesign(e.target.checked)}
                    />
                    <div
                      className={`relative w-9 h-5 border rounded-[10px] shrink-0 transition-all ${
                        hasBaseDesign
                          ? "border-[var(--sienna)] bg-[rgba(160,82,45,0.2)]"
                          : "border-[#3a3028]"
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] left-[3px] w-3 h-3 rounded-full transition-all ${
                          hasBaseDesign
                            ? "bg-[var(--sienna)] translate-x-4"
                            : "bg-[#3a3028]"
                        }`}
                      />
                    </div>
                    <p
                      className={cn(
                        "text-[11px] text-(--cream)",
                        isArabic ? "" : "tracking-[0.1em] uppercase",
                      )}
                    >
                      {t("addBaseDesign")}
                    </p>
                  </label>
                </div>

                {hasBaseDesign && (
                  <div className="space-y-4 animate-[sectionIn_0.3s_ease_forwards] opacity-0">
                    <div>
                      <label className={labelCls}>{t("designLabel")}</label>
                      <select
                        value={baseDesignId}
                        onChange={(e) => setBaseDesignId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t("selectDesignPlaceholder")}</option>
                        {designs.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label} ({d.key})
                          </option>
                        ))}
                      </select>
                    </div>

                    <PositionPicker
                      imageUrl={frontImage}
                      top={baseDesignTop}
                      left={baseDesignLeft}
                      width={baseDesignWidth}
                      onPositionChange={(t, l) => {
                        setBaseDesignTop(t);
                        setBaseDesignLeft(l);
                      }}
                      markerColor={baseDesignThreadHex}
                      markerText={t("designMarkerText")}
                      label={t("baseDesignPositionLabel")}
                    />

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>{t("widthPxLabel")}</label>
                        <input
                          type="number"
                          value={baseDesignWidth}
                          onChange={(e) =>
                            setBaseDesignWidth(Number(e.target.value))
                          }
                          placeholder="110"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t("threadColorLabel")}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {THREAD_COLORS.map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            title={t(`threadColors.${c.id}`)}
                            onClick={() => setBaseDesignThreadHex(c.hex)}
                            className={`w-7 h-7 rounded-full border-2 transition-all ${
                              baseDesignThreadHex === c.hex
                                ? "border-[var(--cream)] scale-110"
                                : "border-transparent hover:scale-105"
                            }`}
                            style={{ background: c.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── 04 Images ── */}
        <div className={sectionCls}>
          <div className={sectionEyebrowCls}>{t("section04")}</div>
          <p className="font-(family-name:--font-playfair) text-[18px] font-bold text-(--cream) mb-1.5">
            {t("productImagesTitle")}
          </p>
          <p className="font-(family-name:--font-cormorant) text-[15px] font-light text-[#6a5e54] mb-6">
            {t("productImagesSubtitle")}
          </p>

          {/* Upload zone — wraps the UploadProductImage trigger */}
          <div className="border-[1.5px] border-dashed border-[#2a2420] p-8 text-center transition-colors hover:border-(--sienna) hover:bg-[rgba(160,82,45,0.04)] group">
            <span className="block text-2xl text-[#3a3028] mb-3 group-hover:text-(--sienna) transition-colors">
              ✦
            </span>
            <p className="font-(family-name:--font-cormorant) text-[18px] font-light text-[#6a5e54] mb-1.5">
              {t("dropImages")}
            </p>
            <p
              className={cn(
                "text-[9px] text-[#3a3028] mb-3",
                isArabic ? "" : "tracking-[0.18em] uppercase",
              )}
            >
              {t("imageHint")}
            </p>
            <UploadProductImage
              onUpload={(url) =>
                setImages((prev) => [
                  ...prev,
                  { url, place: "front", color: "", position: prev.length },
                ])
              }
            />
          </div>

          {images.length > 0 && (
            <div className="flex flex-col gap-3 mt-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[72px_1fr_1fr_auto] gap-3 items-center p-3 border border-[#2a2420] bg-[#120e0a] animate-[rowIn_0.3s_ease_forwards]"
                >
                  <div className="relative w-18 h-18 border border-[#2a2420]">
                    <Image
                      src={image.url}
                      alt="product-image"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <select
                    value={image.place}
                    className={inputCls}
                    onChange={(e) => {
                      const copy = [...images];
                      copy[index].place = e.target
                        .value as ProductImageInput["place"];
                      setImages(copy);
                    }}
                  >
                    <option value="front">{t("placementFront")}</option>
                    <option value="back">{t("placementBack")}</option>
                    <option value="left-sleeve">
                      {t("placementLeftSleeve")}
                    </option>
                    <option value="right-sleeve">
                      {t("placementRightSleeve")}
                    </option>
                  </select>

                  <input
                    placeholder={t("colorOptionalPlaceholder")}
                    value={image.color ?? ""}
                    className={inputCls}
                    onChange={(e) => {
                      const copy = [...images];
                      copy[index].color = e.target.value;
                      setImages(copy);
                    }}
                  />

                  <button
                    type="button"
                    className="w-8 h-8 border border-[#3a3028] text-[#6a5e54] flex items-center justify-center text-sm transition-colors hover:border-red-800 hover:text-red-500 hover:bg-red-950/20"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 05 Variants ── */}
        <div className={sectionCls}>
          <div className={sectionEyebrowCls}>{t("section05")}</div>
          <p className="font-(family-name:--font-playfair) text-[18px] font-bold text-(--cream) mb-1.5">
            {t("productVariantsTitle")}
          </p>
          <p className="font-(family-name:--font-cormorant) text-[15px] font-light text-[#6a5e54] mb-6">
            {t("productVariantsSubtitle")}
          </p>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_90px_90px_36px] gap-2.5 mb-2 px-3.5">
            {variantColumns.map((c) => (
              <span
                key={c.key}
                className={cn(
                  "text-[8px] text-[#3a3028]",
                  isArabic ? "" : "tracking-[0.2em] uppercase",
                )}
              >
                {t(c.key)}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {variants.map((variant, index) => (
              <div
                key={index}
                data-num={String(index + 1).padStart(2, "0")}
                className="relative grid grid-cols-[1fr_1fr_90px_90px_36px] gap-2.5 items-center p-3.5 border border-[#2a2420] bg-[#120e0a] before:content-[attr(data-num)] before:absolute before:-left-px before:-top-px before:bg-(--sienna) before:text-(--cream) before:text-[8px] before:tracking-widest before:px-1.5 before:py-0.5 animate-[rowIn_0.3s_ease_forwards]"
              >
                <input
                  placeholder={t("colorPlaceholder")}
                  value={variant.color}
                  className={inputCls}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[index].color = e.target.value as Variant["color"];
                    setVariants(copy);
                  }}
                />

                {config?.hasSizes && (
                  <select
                    name="size"
                    value={variant.size}
                    className={inputCls}
                    onChange={(e) => {
                      const copy = [...variants];
                      copy[index].size = e.target.value as Variant["size"];
                      setVariants(copy);
                    }}
                  >
                    {config.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="number"
                  placeholder={t("stockPlaceholder")}
                  value={variant.stock ?? ""}
                  className={inputCls}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[index].stock = parseInt(e.target.value) || 0;
                    setVariants(copy);
                  }}
                />
                <input
                  type="number"
                  placeholder={t("pricePlaceholder")}
                  value={variant.price ?? ""}
                  className={inputCls}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[index].price = parseFloat(e.target.value) || 0;
                    setVariants(copy);
                  }}
                />
                <button
                  type="button"
                  className="w-9 h-9 border border-[#3a3028] text-[#6a5e54] flex items-center justify-center text-base transition-colors hover:border-red-800 hover:text-red-500 hover:bg-red-950/20"
                  onClick={() =>
                    setVariants((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={cn(
              "flex items-center gap-2.5 w-full mt-2.5 px-4 py-3 border border-dashed border-[#2a2420] font-(family-name:--font-dm-mono) text-[10px] text-[#4a3f35] transition-colors hover:border-(--sienna) hover:text-(--sienna) before:content-['+'] before:text-base",
              isArabic ? "" : "tracking-[0.15em] uppercase",
            )}
            onClick={() =>
              setVariants((prev) => [
                ...prev,
                {
                  color: "",
                  size:
                    config.hasSizes && config.sizes.length > 0
                      ? config.sizes[0]
                      : "",
                  stock: 0,
                  price: 0,
                },
              ])
            }
          >
            {t("addVariant")}
          </button>
        </div>

        {/* ── Submit Bar ── */}
        <div className="sticky bottom-0 bg-[#0e0a08] border-t border-[#2a2420] px-8 py-5 flex items-center justify-between -mx-15 w-[calc(100%+120px)]">
          <div
            className={cn(
              "text-[11px] text-[#4a3f35]",
              isArabic ? "" : "tracking-[0.08em]",
            )}
          >
            {t("readyToCreate")}{" "}
            <strong className="text-(--gold)">{t("fillRequiredFields")}</strong>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className={cn(
                "px-7 py-3 border border-[#2a2420] font-(family-name:--font-dm-mono) text-[10px] text-[#6a5e54] transition-colors hover:border-(--mist) hover:text-(--cream)",
                isArabic ? "" : "tracking-[0.18em] uppercase",
              )}
            >
              {t("discard")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "flex items-center gap-2.5 px-9 py-3 bg-(--thread) font-(family-name:--font-dm-mono) text-[10px] text-(--cream) transition-colors hover:bg-(--sienna) disabled:opacity-50",
                isArabic ? "" : "tracking-[0.2em] uppercase",
              )}
            >
              {isPending ? <Spinner /> : t("createProduct")}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

function ToggleCard({
  name,
  title,
  desc,
  isArabic,
}: {
  name: string;
  title: string;
  desc: string;
  isArabic: boolean;
}) {
  const [checked, setChecked] = useState(false);
  return (
    <label
      className={`flex items-center gap-3.5 p-4 border transition-colors cursor-pointer ${
        checked
          ? "border-(--sienna) bg-[rgba(160,82,45,0.06)]"
          : "border-[#2a2420] hover:border-[#3a3028]"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        className="hidden"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      {/* Toggle pill */}
      <div
        className={`relative w-9 h-5 border rounded-[10px] shrink-0 transition-all ${
          checked
            ? "border-(--sienna) bg-[rgba(160,82,45,0.2)]"
            : "border-[#3a3028]"
        }`}
      >
        <span
          className={`absolute top-0.75 left-0.75 w-3 h-3 rounded-full transition-all ${
            checked
              ? "bg-(--sienna) translate-x-4"
              : "bg-[#3a3028] translate-x-0"
          }`}
        />
      </div>
      <div>
        <p
          className={cn(
            "text-[11px] text-(--cream) mb-0.5",
            isArabic ? "" : "tracking-widest uppercase",
          )}
        >
          {title}
        </p>
        <p className="font-(family-name:--font-cormorant) text-[14px] font-light text-[#6a5e54]">
          {desc}
        </p>
      </div>
    </label>
  );
}
