"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type GalleryImage = {
  url: string;
  publicId: string;
};

// Aspect ratios cycle through to create natural masonry rhythm
// These are actual CSS aspect-ratio values
const ASPECT_RATIOS = [
  "3/4", // tall portrait
  "1/1", // square
  "3/4", // tall portrait
  "4/3", // wide landscape
  "1/1", // square
  "2/3", // taller portrait
  "4/3", // wide landscape
  "1/1", // square
  "3/4", // tall portrait
];

export default function Gallery() {
  const t = useTranslations("StudioGallery");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#F5F0E8] py-20 px-6 md:px-12 lg:px-20">
      {/* Section header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#A0522D] mb-3 font-mono">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#1a1310] leading-none">
            {t("headingThe") && <>{t("headingThe")}{" "}</>}
            <span
              style={{
                fontFamily: "Garamond, Georgia, serif",
                fontStyle: "italic",
                color: "#A0522D",
              }}
            >
              {t("headingStudio")}
            </span>
            <br />
            {t("headingGallery")}
          </h2>
        </div>

        {/* Stitch decoration */}
        <div className="hidden md:flex items-center gap-1.5 mb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="block w-3 bg-[#A0522D] opacity-40"
              style={{
                height: "1.5px",
                transform: i % 2 === 0 ? "rotate(-20deg)" : "rotate(20deg)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      {loading ? (
        <SkeletonGrid />
      ) : images.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#A0522D]/50 font-mono">
            {t("empty")}
          </p>
        </div>
      ) : (
        <div
          className="columns-2 md:columns-3 lg:columns-4"
          style={{ columnGap: "10px" }}
        >
          {images.map((img, i) => (
            <GalleryItem
              key={img.publicId}
              url={img.url}
              aspectRatio={ASPECT_RATIOS[i % ASPECT_RATIOS.length]}
              index={i}
              onClick={() => setLightbox(img.url)}
            />
          ))}
        </div>
      )}

      {/* Bottom label */}
      <div className="mt-12 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#A0522D]/20" />
        <p className="text-[9px] tracking-[0.28em] uppercase text-[#A0522D]/60 font-mono whitespace-nowrap">
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
            className="relative max-w-3xl w-full mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white text-[10px] tracking-[0.2em] uppercase font-mono flex items-center gap-2 transition-colors"
            >
              {t("lightboxClose")}
            </button>

            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <Image
                src={lightbox}
                alt="Gallery piece"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>

            {/* Nav hint */}
            <p className="text-center text-white/30 text-[9px] tracking-[0.2em] uppercase font-mono mt-4">
              {t("lightboxHint")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function GalleryItem({
  url,
  aspectRatio,
  index,
  onClick,
}: {
  url: string;
  aspectRatio: string;
  index: number;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="break-inside-avoid group relative overflow-hidden cursor-pointer bg-[#E8E0D0]"
      style={{
        marginBottom: "10px",
        aspectRatio,
      }}
      onClick={onClick}
    >
      {/* Skeleton shimmer */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8E0D0] via-[#F0E8D8] to-[#E8E0D0] animate-pulse" />
      )}

      <Image
        src={url}
        alt={`Gallery piece ${index + 1}`}
        fill
        className={`object-cover transition-all duration-700 group-hover:scale-[1.04] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        onLoad={() => setLoaded(true)}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#1a0e05]/0 group-hover:bg-[#1a0e05]/30 transition-all duration-500" />

      {/* Corner stitch mark */}
      <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <div className="w-5 h-5 border-b-2 border-r-2 border-white/60" />
      </div>

      {/* Top-left thread dot */}
      <div className="absolute top-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-1.5 h-1.5 rounded-full bg-[#A0522D]/80" />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  const skeletonRatios = [
    "3/4",
    "1/1",
    "3/4",
    "4/3",
    "1/1",
    "2/3",
    "4/3",
    "1/1",
  ];
  return (
    <div
      className="columns-2 md:columns-3 lg:columns-4"
      style={{ columnGap: "10px" }}
    >
      {skeletonRatios.map((ratio, i) => (
        <div
          key={i}
          className="break-inside-avoid bg-[#E8E0D0] animate-pulse"
          style={{ marginBottom: "10px", aspectRatio: ratio }}
        />
      ))}
    </div>
  );
}
