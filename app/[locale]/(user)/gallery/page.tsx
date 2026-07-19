"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

type GalleryImage = {
  url: string;
  publicId: string;
  tags: string[];
};

const FILTER_KEYS = [
  "all",
  "hoodie",
  "tshirt",
  "sweatshirt",
  "cap",
  "totebag",
  "uniform",
  "medical",
] as const;

const ASPECT_RATIOS = [
  "3/4",
  "1/1",
  "3/4",
  "4/3",
  "1/1",
  "2/3",
  "4/3",
  "1/1",
  "3/4",
];

export default function GalleryPage() {
  const t = useTranslations("GalleryPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTER_KEYS)[number]>("all");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    activeFilter === "all"
      ? images
      : images.filter((img) => img.tags?.includes(activeFilter));

  const openLightbox = (img: GalleryImage, index: number) => {
    setLightbox(img);
    setLightboxIndex(index);
  };

  const lightboxPrev = () => {
    const prev = (lightboxIndex - 1 + filtered.length) % filtered.length;
    setLightbox(filtered[prev]);
    setLightboxIndex(prev);
  };

  const lightboxNext = () => {
    const next = (lightboxIndex + 1) % filtered.length;
    setLightbox(filtered[next]);
    setLightboxIndex(next);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(null);
      // In RTL, arrow keys should feel natural, so swap them
      if (e.key === "ArrowLeft") (isRTL ? lightboxNext : lightboxPrev)();
      if (e.key === "ArrowRight") (isRTL ? lightboxPrev : lightboxNext)();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, lightboxIndex, filtered, isRTL]);

  return (
    <div className="min-h-screen bg-[#F5F0E8]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-8 sm:pt-14 pb-6 sm:pb-10 border-b border-[#d4c9b8] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[8px] sm:text-[9px] tracking-[0.32em] uppercase text-[#A0522D] font-mono mb-2 sm:mb-3">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#1a1310] leading-none">
            <span
              style={{
                fontFamily: "Garamond, Georgia, serif",
                fontStyle: "italic",
                color: "#A0522D",
              }}
            >
              {t("titleItalic")}
            </span>
            <br />
            {t("titleLine2")}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-[#8a7a6e] font-mono mt-2 sm:mt-3 tracking-wide">
            {t("subtitle")}
          </p>
        </div>

        {!loading && (
          <div className="text-left sm:text-right">
            <p className="font-serif text-3xl sm:text-5xl font-bold text-[#1a1310]">
              {images.length}+
            </p>
            <p className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#A0522D] font-mono mt-1">
              {t("piecesCrafted")}
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div
        className="px-4 sm:px-6 md:px-12 lg:px-20 py-3 sm:py-4 border-b border-[#d4c9b8] flex items-center gap-2 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTER_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-2 shrink-0">
            {/* divider before Caps and Uniforms */}
            {(key === "cap" || key === "uniform") && (
              <div className="w-px h-4 bg-[#d4c9b8] shrink-0" />
            )}
            <button
              onClick={() => setActiveFilter(key)}
              className={`text-[8px] sm:text-[9px] tracking-[0.16em] uppercase font-mono px-2.5 sm:px-3 py-1.5 border whitespace-nowrap transition-all ${
                activeFilter === key
                  ? "bg-[#1a1310] text-[#F5F0E8] border-[#1a1310]"
                  : "border-[#c4b5a4] text-[#8a7a6e] hover:border-[#A0522D] hover:text-[#A0522D]"
              }`}
            >
              {t(`filters.${key}`)}
              {activeFilter === key && key !== "all" && (
                <span className="ml-1.5 opacity-60">
                  ({images.filter((img) => img.tags?.includes(key)).length})
                </span>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8">
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 gap-3 text-center px-4">
            <p className="font-serif text-xl sm:text-2xl text-[#1a1310]">
              {t("emptyTitle")}
            </p>
            <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#A0522D] font-mono">
              {t("emptySubtitle")}
            </p>
            <button
              onClick={() => setActiveFilter("all")}
              className="mt-4 text-[9px] tracking-[0.18em] uppercase font-mono px-4 py-2 border border-[#A0522D] text-[#A0522D] hover:bg-[#A0522D] hover:text-[#F5F0E8] transition-colors"
            >
              {t("viewAll")}
            </button>
          </div>
        ) : (
          <div
            className="columns-2 md:columns-3 lg:columns-4"
            style={{ columnGap: "8px" }}
          >
            {filtered.map((img, i) => (
              <GalleryItem
                key={img.publicId}
                img={img}
                aspectRatio={ASPECT_RATIOS[i % ASPECT_RATIOS.length]}
                index={i}
                onClick={() => openLightbox(img, i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom label */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 pb-10 sm:pb-16 flex items-center gap-3 sm:gap-4">
        <div className="h-px flex-1 bg-[#A0522D]/20" />
        <p className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.28em] uppercase text-[#A0522D]/50 font-mono whitespace-nowrap">
          {t("stitchLabel")}
        </p>
        <div className="h-px flex-1 bg-[#A0522D]/20" />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center backdrop-blur-md"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-3xl mx-3 sm:mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-9 sm:-top-10 right-0 text-white/50 hover:text-white text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-mono flex items-center gap-2 transition-colors"
            >
              {t("lightboxClose")}
            </button>

            {/* Image */}
            <div
              className="relative w-full"
              style={{ aspectRatio: "4/3", maxHeight: "70vh" }}
            >
              <Image
                src={lightbox.url}
                alt={t("galleryImageAlt")}
                fill
                className="object-contain"
                sizes="900px"
              />
            </div>

            {/* Tags */}
            {lightbox.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center px-2">
                {lightbox.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[7px] sm:text-[8px] tracking-[0.18em] uppercase font-mono text-white/40 bg-white/10 px-2 py-1"
                  >
                    {t.has(`filters.${tag}`) ? t(`filters.${tag}`) : tag}
                  </span>
                ))}
              </div>
            )}

            {/* Prev / Next */}
            {filtered.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    lightboxPrev();
                  }}
                  className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-14 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white/70 sm:text-white/50 hover:text-white bg-black/30 sm:bg-transparent border border-white/30 sm:border-white/20 hover:border-white/50 transition-colors"
                >
                  {isRTL ? "→" : "←"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    lightboxNext();
                  }}
                  className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-14 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white/70 sm:text-white/50 hover:text-white bg-black/30 sm:bg-transparent border border-white/30 sm:border-white/20 hover:border-white/50 transition-colors"
                >
                  {isRTL ? "←" : "→"}
                </button>
                <p className="text-center text-white/25 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-mono mt-3">
                  {lightboxIndex + 1} / {filtered.length}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryItem({
  img,
  aspectRatio,
  index,
  onClick,
}: {
  img: GalleryImage;
  aspectRatio: string;
  index: number;
  onClick: () => void;
}) {
  const t = useTranslations("GalleryPage");
  const [loaded, setLoaded] = useState(false);

  const tagKey = FILTER_KEYS.find(
    (key) => img.tags?.includes(key) && key !== "all",
  );

  return (
    <div
      className="break-inside-avoid group relative overflow-hidden cursor-pointer bg-[#E8E0D0]"
      style={{ marginBottom: "8px", aspectRatio }}
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8E0D0] via-[#F0E8D8] to-[#E8E0D0] animate-pulse" />
      )}

      <Image
        src={img.url}
        alt={`${t("galleryImageAlt")} ${index + 1}`}
        fill
        className={`object-cover transition-all duration-700 group-hover:scale-[1.04] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        onLoad={() => setLoaded(true)}
      />

      <div className="absolute inset-0 bg-[#1a0e05]/0 group-hover:bg-[#1a0e05]/35 transition-all duration-500" />

      {tagKey && (
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-[7px] sm:text-[8px] tracking-[0.18em] uppercase font-mono text-white/90 bg-[#A0522D]/70 px-1.5 sm:px-2 py-1">
            {t(`filters.${tagKey}`)}
          </span>
        </div>
      )}

      <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-t-2 border-r-2 border-white/50" />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  const ratios = [
    "3/4",
    "1/1",
    "3/4",
    "4/3",
    "1/1",
    "2/3",
    "4/3",
    "1/1",
    "3/4",
    "1/1",
    "4/3",
    "2/3",
  ];
  return (
    <div
      className="columns-2 md:columns-3 lg:columns-4"
      style={{ columnGap: "8px" }}
    >
      {ratios.map((ratio, i) => (
        <div
          key={i}
          className="break-inside-avoid bg-[#E8E0D0] animate-pulse"
          style={{ marginBottom: "8px", aspectRatio: ratio }}
        />
      ))}
    </div>
  );
}
