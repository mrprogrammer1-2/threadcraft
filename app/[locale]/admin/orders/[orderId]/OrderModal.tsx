"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, Download, ImageIcon } from "lucide-react";
import { FONTS } from "@/lib/data";
import { useTranslations, useLocale } from "next-intl";

type Design = {
  id: string;
  key: string;
  label: string;
  svg: string | null;
  url: string | null;
  createdAt: string;
};

type EmbLayer = {
  id: string;
  raw?: {
    // text layers
    text?: string;
    fontIndex?: number;
    threadHex?: string;
    // library layers
    designKey?: string;
  };
  type: "library" | "upload" | "text" | "draw";
  content: string;
  top: string;
  left: string;
  width: number;
  url?: string;
};

type Customization = {
  garmentColor?: string;
  layers?: EmbLayer[];
};

type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  productName: string | null;
  variantColor: string | null;
  variantSize: string | null;
  customization: Customization | null;
  imageUrl: string | null;
};

const PREVIEW_W = 320;
const PREVIEW_H = 384;
const ZOOM_SCALE = 2;
const ZOOM_W = PREVIEW_W * ZOOM_SCALE;
const ZOOM_H = PREVIEW_H * ZOOM_SCALE;

export default function OrderModal({
  selectedItem,
  onClose,
}: {
  selectedItem: OrderItem | null;
  onClose: () => void;
}) {
  const t = useTranslations("AdminOrderModal");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [zoomed, setZoomed] = useState(false);
  const [zoomedUpload, setZoomedUpload] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingUpload, setDownloadingUpload] = useState(false);
  const [libraryDesigns, setLibraryDesigns] = useState<Design[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/designs")
      .then((r) => r.json())
      .then(setLibraryDesigns);
  }, []);

  if (!selectedItem) return null;

  const customization = selectedItem.customization;

  const uploadLayers =
    customization?.layers?.filter((l) => l.type === "upload" && l.url) ?? [];
  const hasUploads = uploadLayers.length > 0;

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  function buildTextSvg(text: string, fontIndex: number, threadHex: string) {
    const f = FONTS[fontIndex];
    const isMono = f.font === "DM Mono";
    const safeVal = escapeXml(text);
    return `<svg class="emb-svg" viewBox="0 0 80 80" style="width:100%;height:100%;overflow:visible">
      <text x="40" y="46" text-anchor="middle" font-family="${f.font},serif" font-style="${f.italic ? "italic" : "normal"}"
        font-size="${isMono ? 10 : 16}" letter-spacing="${isMono ? 2 : 0.5}"
        fill="none" stroke="${threadHex}" stroke-width="1.1">${safeVal}</text></svg>`;
  }

  function RenderLayer({ layer }: { layer: EmbLayer }) {
    switch (layer.type) {
      case "text": {
        if (
          !layer.raw?.text ||
          layer.raw.fontIndex === undefined ||
          !layer.raw.threadHex
        ) {
          return null;
        }
        return (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{
              __html: buildTextSvg(
                layer.raw.text,
                layer.raw.fontIndex,
                layer.raw.threadHex,
              ),
            }}
          />
        );
      }

      case "upload": {
        if (!layer.url) return null;
        return (
          <Image
            src={layer.url}
            fill
            alt=""
            className="object-contain"
            crossOrigin="anonymous"
          />
        );
      }

      case "library": {
        const design = libraryDesigns.find(
          (d) => d.id === layer.raw?.designKey,
        );
        if (!design) return null;
        if (design.svg) {
          return (
            <div
              className="w-full h-full"
              style={{ color: layer.raw?.threadHex }}
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="0 0 80 80" style="width:100%;height:100%">${design.svg}</svg>`,
              }}
            />
          );
        }
        if (design.url) {
          return (
            <Image
              src={design.url}
              fill
              alt=""
              className="object-contain"
              crossOrigin="anonymous"
            />
          );
        }
        return null;
      }

      default:
        return null;
    }
  }

  function LayerWrapper({
    layer,
    scale = 1,
  }: {
    layer: EmbLayer;
    scale?: number;
  }) {
    return (
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: layer.width * scale,
          height: layer.width * scale,
          top: layer.top,
          left: layer.left,
          transform: "translate(-50%, -50%)",
        }}
      >
        <RenderLayer layer={layer} />
      </div>
    );
  }

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const domtoimage = (await import("dom-to-image-more")).default;
      const blob = await domtoimage.toBlob(previewRef.current, {
        width: PREVIEW_W,
        height: PREVIEW_H,
        style: { borderRadius: "0" },
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `customization-${selectedItem.id}-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadUpload = async (url: string, index: number) => {
    setDownloadingUpload(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `upload-${selectedItem.id}-${index}-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Upload download failed:", err);
    } finally {
      setDownloadingUpload(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative bg-[#1f1911]/95 border border-white/10 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.45)] w-full max-w-4xl overflow-hidden mx-4 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="flex flex-col gap-4 px-6 py-5 border-b border-white/10 bg-white/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-gold/70">
                {t("customizationPreview")}
              </p>
              {selectedItem.productName && (
                <p className="mt-2 text-base font-semibold text-cream">
                  {selectedItem.productName}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-cream transition hover:bg-white/15"
            >
              <span className="sr-only">{t("close")}</span>
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 bg-[#18120e]/80">
            {!customization ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-8 py-12 text-center text-cream">
                {t("noCustomization")}
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={`flex flex-col gap-6 ${hasUploads ? "lg:flex-row lg:items-start" : "items-center"}`}
                >
                  {/* Left: product + customization */}
                  <div className="flex flex-1 flex-col items-center gap-4">
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold/70">
                      {hasUploads ? t("customizationLabel") : t("previewLabel")}
                    </p>

                    <div
                      ref={previewRef}
                      onClick={() => setZoomed(true)}
                      className="group relative cursor-zoom-in overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14100c]/80 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)]"
                      style={{ width: PREVIEW_W, height: PREVIEW_H }}
                    >
                      {selectedItem.imageUrl && (
                        <Image
                          src={selectedItem.imageUrl}
                          alt={t("productImageAlt")}
                          fill
                          className="object-cover"
                          crossOrigin="anonymous"
                        />
                      )}
                      {customization.layers?.map((layer, i) => (
                        <LayerWrapper key={i} layer={layer} scale={1} />
                      ))}
                      <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/25 flex items-center justify-center">
                        <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/60 rounded-full p-3">
                          <ZoomIn className="text-white" size={18} />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#8d6b4c]/15 px-4 py-2 text-xs font-semibold text-cream transition hover:bg-[#8d6b4c]/25 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Download size={13} />
                      {downloading ? t("exporting") : t("download")}
                    </button>
                  </div>

                  {/* Right: uploaded image(s) */}
                  {hasUploads && (
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gold/70">
                        {uploadLayers.length > 1
                          ? t("customerUploads")
                          : t("customerUpload")}
                      </p>

                      <div className="flex flex-col gap-4">
                        {uploadLayers.map((layer, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center gap-3"
                          >
                            <div
                              onClick={() => setZoomedUpload(layer.url!)}
                              className="group relative cursor-zoom-in overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14100c]/80 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)]"
                              style={{ width: PREVIEW_W, height: PREVIEW_H }}
                            >
                              <Image
                                src={layer.url!}
                                alt={t("customerUploadAlt", { index: i + 1 })}
                                fill
                                className="object-contain p-4"
                                crossOrigin="anonymous"
                              />
                              <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                                <ImageIcon size={9} className="text-white/70" />
                                <span className="text-[9px] text-white/70 font-medium">
                                  {t("customerFile")}
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-3">
                                  <ZoomIn className="text-white" size={18} />
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                handleDownloadUpload(layer.url!, i)
                              }
                              disabled={downloadingUpload}
                              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#5a4a7f]/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5a4a7f]/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Download size={13} />
                              {downloadingUpload
                                ? t("downloading")
                                : t("download")}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Layer Info */}
                <div className="grid gap-3">
                  <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-gold/70">
                    {t("layers", { count: customization.layers?.length || 0 })}
                  </p>
                  {customization.layers?.map((layer, i) => (
                    <div
                      key={i}
                      className="rounded-[1.75rem] border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold capitalize text-cream">
                          {layer.type}
                        </span>
                        <span
                          className="text-xs uppercase tracking-[0.2em] text-gold/70"
                          dir="ltr"
                        >
                          {layer.width}px
                        </span>
                      </div>
                      <div className="mt-2 text-[11px] text-gray-400" dir="ltr">
                        top: {layer.top} · left: {layer.left}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom: customization */}
      {zoomed && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setZoomed(false)}
        >
          <div
            className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-[#0f0b08]/95"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative overflow-hidden"
              style={{ width: ZOOM_W, height: ZOOM_H }}
            >
              {selectedItem.imageUrl && (
                <Image
                  src={selectedItem.imageUrl}
                  alt={t("productImageAlt")}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              )}
              {customization?.layers?.map((layer, i) => (
                <LayerWrapper key={i} layer={layer} scale={ZOOM_SCALE} />
              ))}
            </div>
            <button
              onClick={() => setZoomed(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-cream transition hover:bg-white/20"
            >
              <span className="sr-only">{t("close")}</span>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Zoom: uploaded image */}
      {zoomedUpload && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setZoomedUpload(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div
              className="relative rounded-xl overflow-hidden bg-black"
              style={{ width: ZOOM_W, height: ZOOM_H }}
            >
              <Image
                src={zoomedUpload}
                alt={t("customerUploadZoomedAlt")}
                fill
                className="object-contain p-6"
                crossOrigin="anonymous"
              />
            </div>
            <button
              onClick={() => setZoomedUpload(null)}
              className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-9 h-9 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <span className="sr-only">{t("close")}</span>
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
