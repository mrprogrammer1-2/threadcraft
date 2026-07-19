// app/admin/designs/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, ImageIcon, Code2, X, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

type Design = {
  id: string;
  key: string;
  label: string;
  svg: string | null;
  url: string | null;
  createdAt: string;
};

type FormMode = "svg" | "png";

export default function DesignsPage() {
  const t = useTranslations("AdminDesignsPage");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("svg");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // form fields
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [svg, setSvg] = useState("");
  const [url, setUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  async function fetchDesigns() {
    setLoading(true);
    const res = await fetch("/api/designs");
    const data = await res.json();
    setDesigns(data);
    setLoading(false);
  }

  function resetForm() {
    setKey("");
    setLabel("");
    setSvg("");
    setUrl("");
    setFormMode("svg");
    setShowForm(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      setUrl(data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit() {
    if (
      !key ||
      !label ||
      (formMode === "svg" && !svg) ||
      (formMode === "png" && !url)
    )
      return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          label,
          svg: formMode === "svg" ? svg : null,
          url: formMode === "png" ? url : null,
        }),
      });
      if (res.ok) {
        await fetchDesigns();
        resetForm();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/designs/${id}`, { method: "DELETE" });
    setDesigns((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
  }

  // auto-generate key from label
  function handleLabelChange(val: string) {
    setLabel(val);
    setKey(
      val
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, ""),
    );
  }

  const svgDesigns = designs.filter((d) => d.svg);
  const pngDesigns = designs.filter((d) => d.url && !d.svg);

  return (
    <div className="min-h-screen rounded-[2rem] border border-border bg-gradient-to-br from-surface/95 via-[#231c14]/95 to-[#1b140d]/95 p-8 shadow-[0_0_80px_rgba(0,0,0,0.35)]">
      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#1b140d]/90 p-8 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div
              className={cn(
                "inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-gold/80 shadow-sm shadow-black/10",
                isArabic ? "" : "uppercase tracking-[0.3em]",
              )}
            >
              {t("eyebrow")}
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-cream">
                {t("title")}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#b37a47] to-[#8e5a28] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8a5e38]/25 transition hover:from-[#d19b5c] hover:to-[#ad7c44]"
          >
            <Plus size={16} />
            {t("addDesign")}
          </button>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-cream shadow-sm shadow-black/10">
            <span
              className={cn(
                "block text-xs text-gold/70",
                isArabic ? "" : "uppercase tracking-[0.27em]",
              )}
            >
              {t("totalDesigns")}
            </span>
            <p className="mt-2 text-3xl font-semibold">{designs.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-cream shadow-sm shadow-black/10">
            <span
              className={cn(
                "block text-xs text-gold/70",
                isArabic ? "" : "uppercase tracking-[0.27em]",
              )}
            >
              {t("latestUpdate")}
            </span>
            <p className="mt-2 text-base text-gray-300">
              {t("latestUpdateDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty */}
      {!loading && designs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/5 p-16 text-center shadow-2xl shadow-black/10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-cream">
            <Code2 size={22} />
          </div>
          <p className="text-base font-semibold text-cream">
            {t("noDesignsTitle")}
          </p>
          <p className="mt-2 text-sm text-muted max-w-md">
            {t("noDesignsSubtitle")}
          </p>
        </div>
      )}

      {/* SVG Designs */}
      {svgDesigns.length > 0 && (
        <section className="mb-10">
          <p
            className={cn(
              "text-[10px] font-semibold text-gold/80 mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 shadow-sm shadow-black/10",
              isArabic ? "" : "uppercase tracking-[0.14em]",
            )}
          >
            <Code2 size={11} />
            {t("svgMotifs")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {svgDesigns.map((d) => (
              <DesignCard
                key={d.id}
                design={d}
                onDelete={handleDelete}
                deletingId={deletingId}
                t={t}
              />
            ))}
          </div>
        </section>
      )}

      {/* PNG Designs */}
      {pngDesigns.length > 0 && (
        <section>
          <p
            className={cn(
              "text-[10px] font-semibold text-gold/80 mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 shadow-sm shadow-black/10",
              isArabic ? "" : "uppercase tracking-[0.14em]",
            )}
          >
            <ImageIcon size={11} />
            {t("pngDesigns")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pngDesigns.map((d) => (
              <DesignCard
                key={d.id}
                design={d}
                onDelete={handleDelete}
                deletingId={deletingId}
                t={t}
              />
            ))}
          </div>
        </section>
      )}

      {/* Add Design Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={resetForm}
        >
          <div
            className="relative bg-white dark:bg-[#1a1d2e] border border-gray-100 dark:border-white/[0.07] rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {t("modalTitle")}
              </p>
              <button
                onClick={resetForm}
                aria-label={t("closeModal")}
                title={t("closeModal")}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/[0.06] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Type toggle */}
              <div className="flex rounded-lg border border-gray-200 dark:border-white/[0.08] overflow-hidden">
                {(["svg", "png"] as FormMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFormMode(mode)}
                    className={cn(
                      "flex-1 py-2 text-xs font-semibold transition-colors",
                      isArabic ? "" : "uppercase tracking-wider",
                      formMode === mode
                        ? "bg-[#A0522D] text-white"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                    )}
                  >
                    {mode === "svg" ? t("svgMotifTab") : t("pngDesignTab")}
                  </button>
                ))}
              </div>

              {/* Label */}
              <div className="space-y-1.5">
                <label
                  className={cn(
                    "text-[11px] font-semibold text-gray-400",
                    isArabic ? "" : "uppercase tracking-wider",
                  )}
                >
                  {t("labelField")}
                </label>
                <input
                  value={label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder={t("labelPlaceholder")}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#A0522D]/50"
                />
              </div>

              {/* Key (auto-generated, editable) */}
              <div className="space-y-1.5">
                <label
                  className={cn(
                    "text-[11px] font-semibold text-gray-400",
                    isArabic ? "" : "uppercase tracking-wider",
                  )}
                >
                  {t("keyField")}{" "}
                  <span className="normal-case font-normal text-gray-400">
                    ({t("keyHint")})
                  </span>
                </label>
                <input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={t("keyPlaceholder")}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm font-mono text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#A0522D]/50"
                />
              </div>

              {/* SVG input */}
              {formMode === "svg" && (
                <div className="space-y-1.5">
                  <label
                    className={cn(
                      "text-[11px] font-semibold text-gray-400",
                      isArabic ? "" : "uppercase tracking-wider",
                    )}
                  >
                    {t("svgPathsField")}{" "}
                    <span className="normal-case font-normal">
                      ({t("svgPathsHint")})
                    </span>
                  </label>
                  <textarea
                    value={svg}
                    onChange={(e) => setSvg(e.target.value)}
                    rows={4}
                    placeholder={`<circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" stroke-width="1.5"/>`}
                    dir="ltr"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-xs font-mono text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#A0522D]/50 resize-none text-left"
                  />
                  {/* Live preview */}
                  {svg && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-16 h-16 border border-gray-200 dark:border-white/[0.08] rounded-lg flex items-center justify-center bg-gray-50 dark:bg-[#0f1018]">
                        <svg
                          viewBox="0 0 80 80"
                          className="w-10 h-10"
                          style={{ color: "#A0522D" }}
                          dangerouslySetInnerHTML={{ __html: svg }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        {t("livePreview")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* PNG upload */}
              {formMode === "png" && (
                <div className="space-y-1.5">
                  <label
                    className={cn(
                      "text-[11px] font-semibold text-gray-400",
                      isArabic ? "" : "uppercase tracking-wider",
                    )}
                  >
                    {t("uploadPng")}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {url ? (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 border border-gray-200 dark:border-white/[0.08] rounded-lg overflow-hidden relative bg-gray-50 dark:bg-[#0f1018]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={label}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setUrl("");
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="text-xs text-red-400 hover:text-red-500"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full py-8 border-2 border-dashed border-gray-200 dark:border-white/[0.08] rounded-lg text-gray-400 hover:border-[#A0522D]/50 hover:text-[#A0522D] transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <ImageIcon size={18} />
                      )}
                      <span className="text-xs">
                        {uploadingImage
                          ? t("uploadingCloudinary")
                          : t("clickToUpload")}
                      </span>
                    </button>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  !key ||
                  !label ||
                  (formMode === "svg" && !svg) ||
                  (formMode === "png" && !url)
                }
                className="w-full py-2.5 rounded-lg bg-[#A0522D] hover:bg-[#8B4513] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? t("saving") : t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DesignCard({
  design,
  onDelete,
  deletingId,
  t,
}: {
  design: Design;
  onDelete: (id: string) => void;
  deletingId: string | null;
  t: ReturnType<typeof useTranslations>;
}) {
  const isDeleting = deletingId === design.id;

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5/80 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-black/25">
      {/* Preview */}
      <div className="aspect-square flex items-center justify-center rounded-[1.75rem] border border-white/10 bg-[#15100c]/85 p-4 backdrop-blur-sm">
        {design.svg ? (
          <svg
            viewBox="0 0 80 80"
            className="w-full h-full max-w-[60px]"
            style={{ color: "#A0522D" }}
            dangerouslySetInnerHTML={{ __html: design.svg }}
          />
        ) : design.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={design.url}
            alt={design.label}
            className="w-full h-full object-contain"
          />
        ) : null}
      </div>

      {/* Info */}
      <div className="space-y-1 rounded-b-[2rem] border-t border-white/10 bg-[#120e09]/80 px-4 py-4 text-cream">
        <p className="text-sm font-semibold truncate">{design.label}</p>
        <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-gold/70 truncate">
          {design.key}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(design.id)}
        disabled={isDeleting}
        aria-label={t("deleteDesign")}
        title={t("deleteDesign")}
        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/80 dark:bg-black/60 border border-gray-200 dark:border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-500/30 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
      >
        {isDeleting ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Trash2 size={12} />
        )}
      </button>

      {/* Type badge */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/30 backdrop-blur-sm text-white/70">
          {design.svg ? "svg" : "png"}
        </span>
      </div>
    </div>
  );
}
