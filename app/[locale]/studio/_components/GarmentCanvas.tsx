"use client";

import { useEffect, useRef, useState } from "react";
import { VIEWS, type View, type EmbLayer } from "@/lib/data";
import Image from "next/image";

interface productImagetype {
  id: string;
  color: string | null;
  place: "front" | "back" | "left-sleeve" | "right-sleeve" | null;
  productId: string;
  url: string;
  altText: string | null;
  position: number | null;
}

interface Props {
  garmentColor: string;
  layers: EmbLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onLayerMove: (id: string, top: string, left: string) => void;
  productImages: productImagetype[];
}

export default function GarmentCanvas({
  garmentColor,
  layers,
  selectedLayerId,
  onSelectLayer,
  onLayerMove,
  productImages,
}: Props) {
  const [view, setView] = useState<View>("front");
  const [currentImage, setCurrentImage] = useState<string>(
    productImages.find((img) => img.color === garmentColor)?.url || "",
  );
  // const [color, setColor] = useState<string>(garmentColor)

  useEffect(() => {
    const currentImagecolor = productImages.find(
      (img) => img.color === garmentColor,
    );

    const setImage = (imageUrl: string) => {
      setCurrentImage(imageUrl);
    };
    // setCurrentImage(currentImagecolor?.url);
    setImage(currentImagecolor!.url);
  }, [garmentColor]);

  const stageRef = useRef<HTMLDivElement>(null);

  // One shared drag ref is fine since only one layer can be dragged at a time
  const drag = useRef({ on: false, id: "", sx: 0, sy: 0, sl: 0, st: 0 });

  const startDrag = (e: React.MouseEvent, layer: EmbLayer) => {
    const stage = stageRef.current!;
    e.stopPropagation();

    // Selecting a layer also happens on mousedown, before the drag starts.
    // This way clicking (without moving) still selects it.
    onSelectLayer(layer.id);

    drag.current = {
      on: true,
      id: layer.id,
      sx: e.clientX,
      sy: e.clientY,
      sl: (parseFloat(layer.left) / 100) * stage.offsetWidth,
      st: (parseFloat(layer.top) / 100) * stage.offsetHeight,
    };

    const onMove = (ev: MouseEvent) => {
      if (!drag.current.on) return;
      const dx = ev.clientX - drag.current.sx;
      const dy = ev.clientY - drag.current.sy;
      const nl = ((drag.current.sl + dx) / stage.offsetWidth) * 100;
      const nt = ((drag.current.st + dy) / stage.offsetHeight) * 100;
      onLayerMove(
        drag.current.id,
        Math.max(5, Math.min(95, nt)) + "%",
        Math.max(5, Math.min(95, nl)) + "%",
      );
    };

    const onUp = () => {
      drag.current.on = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <main
      className="relative overflow-hidden bg-[#0d0a08] flex flex-col items-center justify-center h-full w-full"
      onMouseDown={() => onSelectLayer("")}
    >
      <div
        className="absolute w-125 h-125 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${garmentColor}18 0%, transparent 70%)`,
        }}
      />

      <div className="text-[8px] tracking-[0.3em] uppercase text-muted flex items-center gap-2.5 absolute top-3 lg:top-5 canvas-label">
        Live Preview
        {layers.length > 0 && (
          <span className="text-sienna">
            · {layers.length} layer{layers.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="relative flex items-center justify-center canvas-frame">
        {[
          { key: "tl", cls: "top-[-28px] left-[-28px]", style: {} },
          {
            key: "tr",
            cls: "top-[-28px] right-[-28px]",
            style: {
              borderLeft: "none" as const,
              borderRight: "1px solid rgba(160,82,45,.4)",
            },
          },
          {
            key: "bl",
            cls: "bottom-[-28px] left-[-28px]",
            style: {
              borderTop: "none" as const,
              borderBottom: "1px solid rgba(160,82,45,.4)",
            },
          },
          {
            key: "br",
            cls: "bottom-[-28px] right-[-28px]",
            style: {
              borderLeft: "none" as const,
              borderRight: "1px solid rgba(160,82,45,.4)",
              borderTop: "none",
              borderBottom: "1px solid rgba(160,82,45,.4)",
            },
          },
        ].map((c) => (
          <span key={c.key} className={`absolute w-2 h-2 ${c.cls}`}>
            <span
              className="absolute inset-0 border border-sienna/40"
              style={c.style}
            />
          </span>
        ))}

        {/*
          Fixed 320x384 on desktop (lg+), same as before. Below lg, it
          scales down to fit whatever height the split-view canvas region
          actually has — width/height are driven by CSS (aspect-ratio +
          max-h/max-w) instead of a hardcoded pixel size, so this shrinks
          on phones instead of overflowing off-screen. The drag math above
          already reads stage.offsetWidth/offsetHeight live, so it keeps
          working correctly at any rendered size.
        */}
        <div
          ref={stageRef}
          className="relative w-[78vw] max-w-[280px] aspect-[5/6] max-h-[calc(40vh-96px)] lg:w-80 lg:max-w-none lg:h-96 lg:max-h-none lg:aspect-auto"
          style={{
            filter: "drop-shadow(0 24px 64px rgba(0,0,0,.6))",
          }}
        >
          {currentImage ? (
            <Image
              src={currentImage}
              className=" object-cover"
              fill
              alt="product image"
            />
          ) : (
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 320 384"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="gf">
                  <feDropShadow
                    dx="0"
                    dy="10"
                    stdDeviation="18"
                    floodColor="rgba(0,0,0,.5)"
                  />
                </filter>
                <linearGradient id="fabricSheen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,.06)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,.04)" />
                </linearGradient>
              </defs>
              <g filter="url(#gf)">
                <path
                  id="garmentBody"
                  d="M90 36 L15 96 L42 134 L72 114 L72 340 L248 340 L248 114 L278 134 L305 96 L230 36 L196 15 Q160 4 124 15 Z"
                  fill={garmentColor}
                  stroke="rgba(0,0,0,.1)"
                  strokeWidth="1.5"
                />
                <path
                  d="M90 36 L15 96 L42 134 L72 114 L72 340 L248 340 L248 114 L278 134 L305 96 L230 36 L196 15 Q160 4 124 15 Z"
                  fill="url(#fabricSheen)"
                />
                <path
                  d="M124 15 Q160 42 196 15"
                  fill="none"
                  stroke="rgba(0,0,0,.08)"
                  strokeWidth="1.2"
                />
                <path
                  d="M130 17 Q160 36 190 17"
                  fill="rgba(255,255,255,.1)"
                  stroke="rgba(0,0,0,.05)"
                  strokeWidth=".8"
                />
                <line
                  x1="72"
                  y1="114"
                  x2="72"
                  y2="340"
                  stroke="rgba(0,0,0,.05)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
                <line
                  x1="248"
                  y1="114"
                  x2="248"
                  y2="340"
                  stroke="rgba(0,0,0,.05)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
              </g>
            </svg>
          )}
          {/* if there is no layers */}
          {layers.length === 0 && (
            <div
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                width: "34%",
                height: "29%",
                top: "34%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              <div className="absolute inset-0 border border-dashed border-gold/30" />
              <div className="text-[7px] lg:text-[8px] tracking-[0.15em] uppercase text-gold/30 text-center leading-relaxed">
                Your
                <br />
                Design
                <br />
                Here
              </div>
            </div>
          )}

          {layers.map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            return (
              <div
                key={layer.id}
                className="absolute flex items-center justify-center cursor-move group"
                style={{
                  width: layer.width,
                  height: layer.width,
                  top: layer.top,
                  left: layer.left,
                  transform: "translate(-50%,-50%)",
                  zIndex: isSelected ? 10 : 1,
                }}
                onMouseDown={(e) => startDrag(e, layer)}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div
                    className={`absolute inset-0 pointer-events-none transition-all duration-150 ${
                      isSelected
                        ? "border-2 border-gold"
                        : "border border-dashed border-gold/0 group-hover:border-gold/40"
                    }`}
                  />
                  <div
                    className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.12em] uppercase whitespace-nowrap pointer-events-none transition-opacity ${
                      isSelected
                        ? "opacity-100 text-gold"
                        : "opacity-0 group-hover:opacity-100 text-gold/70"
                    }`}
                  >
                    {isSelected ? "selected · drag to move" : layer.type}
                  </div>
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: layer.content }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-2 lg:bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5 bg-surface border border-[#2e2620] p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-2.5 lg:px-4 py-1 lg:py-1.5 text-[7px] lg:text-[8px] tracking-[0.15em] uppercase border-none transition-all ${
              view === v
                ? "bg-raised text-cream"
                : "bg-transparent text-muted hover:bg-raised hover:text-cream"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </main>
  );
}
