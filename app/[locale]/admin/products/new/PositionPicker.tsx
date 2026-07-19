"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

interface PositionPickerProps {
  imageUrl?: string;
  top: string; // e.g. "62%"
  left: string; // e.g. "50%"
  width: number; // px
  onPositionChange: (top: string, left: string) => void;
  label?: string;
  markerColor?: string;
  markerText?: string;
}

export function PositionPicker({
  imageUrl,
  top,
  left,
  width,
  onPositionChange,
  label,
  markerColor = "#A0522D",
  markerText,
}: PositionPickerProps) {
  const t = useTranslations("PositionPicker");
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  // natural aspect ratio of the actual uploaded image (width / height)
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const resolvedMarkerText = markerText || t("dragMe");

  const topNum = parseFloat(top) || 50;
  const leftNum = parseFloat(left) || 50;

  // Measure the real image dimensions so the box always matches
  // the same aspect ratio the Studio page will render it at.
  useEffect(() => {
    if (!imageUrl) {
      setAspectRatio(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const updateFromClientCoords = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let x = ((clientX - rect.left) / rect.width) * 100;
      let y = ((clientY - rect.top) / rect.height) * 100;
      x = Math.min(100, Math.max(0, x));
      y = Math.min(100, Math.max(0, y));
      onPositionChange(`${y.toFixed(1)}%`, `${x.toFixed(1)}%`);
    },
    [onPositionChange],
  );

  useEffect(() => {
    if (!dragging) return;
    function onMove(e: MouseEvent) {
      updateFromClientCoords(e.clientX, e.clientY);
    }
    function onUp() {
      setDragging(false);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, updateFromClientCoords]);

  return (
    <div>
      {label && (
        <p className="text-[10px] text-[#6a5e54] mb-2">
          {t("instructionLabel", { label })}
        </p>
      )}
      <div
        ref={containerRef}
        onClick={(e) => {
          if (!dragging) updateFromClientCoords(e.clientX, e.clientY);
        }}
        className="relative w-full max-w-[500px] border border-[#2a2420] bg-[#120e0a] overflow-hidden cursor-crosshair select-none"
        style={{
          // Match the image's real aspect ratio instead of a hardcoded 3/4,
          // so the box shape is always identical to how Studio will show it.
          aspectRatio: aspectRatio ? `${aspectRatio}` : "3 / 4",
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: "contain", // never crop — same as Studio should use
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-4 text-[11px] text-[#3a3028]">
            {t("uploadPrompt")}
          </div>
        )}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
          }}
          className="absolute flex items-center justify-center border-2 border-dashed text-[9px] uppercase tracking-wider px-2 py-1 cursor-move whitespace-nowrap"
          style={{
            top: `${topNum}%`,
            left: `${leftNum}%`,
            width: `${width}px`,
            transform: "translate(-50%, -50%)",
            borderColor: markerColor,
            color: markerColor,
            background: "rgba(0,0,0,0.45)",
          }}
        >
          {resolvedMarkerText}
        </div>
      </div>
      <p className="text-[10px] text-[#4a3f35] mt-2 tracking-[0.06em]">
        {t("positionInfo", {
          top: topNum.toFixed(1),
          left: leftNum.toFixed(1),
        })}
      </p>
    </div>
  );
}
