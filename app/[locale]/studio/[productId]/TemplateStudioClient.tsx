"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import { useRouter } from "next/navigation";
import { FONTS } from "@/lib/data";
import { createLayerId } from "@/lib/data";
import type { TemplateConfig } from "@/db/schema";

type Design = {
  id: string;
  key: string;
  label: string;
  svg: string | null;
  url: string | null;
};

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    templateConfig: TemplateConfig | null;
    images: { url: string; color: string | null; place: string | null }[];
    variants: {
      id: string;
      color: string;
      size: string | null;
      price: number | null;
    }[];
    type: {
      hasSizes: boolean;
      sizes: string[];
    };
  };
  initialColor: string;
  initialSize: string;
}

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
    <text x="40" y="46" text-anchor="middle" font-family="${f.font},serif"
      font-style="${f.italic ? "italic" : "normal"}"
      font-size="${isMono ? 10 : 16}" letter-spacing="${isMono ? 2 : 0.5}"
      fill="none" stroke="${threadHex}" stroke-width="1.1">${safeVal}</text></svg>`;
}

export default function TemplateStudioClient({
  product,
  initialColor,
  initialSize,
}: Props) {
  const config = product.templateConfig;
  const [garmentColor, setGarmentColor] = useState(
    initialColor || product.variants[0]?.color || "",
  );
  const [nameText, setNameText] = useState("");
  const [qty, setQty] = useState(1);
  const [addBusy, setAddBusy] = useState(false);
  const [baseDesign, setBaseDesign] = useState<Design | null>(null);
  // Measured aspect ratio of the actual garment photo, so the box shape
  // here always matches PositionPicker in the admin form.
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const addToCart = useAddToCart();
  const router = useRouter();

  const productImages = product.images.filter((img) => img.place === "front");
  const currentImage =
    productImages.find((img) => img.color === garmentColor) ?? productImages[0];

  useEffect(() => {
    if (!currentImage?.url) {
      setAspectRatio(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = currentImage.url;
  }, [currentImage?.url]);

  useEffect(() => {
    if (!config?.baseDesign?.designId) return;
    fetch("/api/designs")
      .then((r) => r.json())
      .then((designs: Design[]) => {
        const found = designs.find((d) => d.id === config.baseDesign!.designId);
        if (found) setBaseDesign(found);
      })
      .catch(() => {});
  }, [config?.baseDesign?.designId]);

  const handleAddToCart = async () => {
    const variant =
      product.variants.find(
        (v) => v.color === garmentColor && v.size === initialSize,
      ) ??
      product.variants.find((v) => v.color === garmentColor) ??
      product.variants[0];

    if (!variant) return;
    setAddBusy(true);

    const layers = [];

    if (config?.baseDesign && baseDesign) {
      layers.push({
        id: createLayerId(),
        type: "library" as const,
        top: config.baseDesign.top,
        left: config.baseDesign.left,
        width: config.baseDesign.width,
        raw: {
          designKey: config.baseDesign.designId,
          threadHex: config.baseDesign.threadHex,
        },
      });
    }

    if (nameText.trim() && config?.nameplate) {
      layers.push({
        id: createLayerId(),
        type: "text" as const,
        top: config.nameplate.top,
        left: config.nameplate.left,
        width: config.nameplate.width,
        raw: {
          text: nameText.trim(),
          fontIndex: config.nameplate.fontIndex,
          threadHex: config.nameplate.threadHex,
        },
      });
    }

    const customization =
      layers.length > 0 ? { garmentColor, isTemplate: true, layers } : null;

    await addToCart({
      productId: product.id,
      productName: product.name,
      variantId: variant.id,
      color: garmentColor,
      size: initialSize,
      price: (variant.price ?? product.price) * qty,
      quantity: qty,
      imageUrl: currentImage?.url ?? null,
      customization,
    });

    setAddBusy(false);
    router.push("/cart");
  };

  const currentPrice =
    (product.variants.find((v) => v.color === garmentColor)?.price ??
      product.price) * qty;

  const uniqueColors = [...new Set(product.variants.map((v) => v.color))];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0e0a08]">
      {/* ── Garment Canvas ──
          Mobile: pinned to the top ~40% of the screen so the preview is
          always visible while the panel below it (color/name/etc.)
          scrolls — matches the same split-view pattern as the free-mode
          studio. Desktop: unchanged, takes the remaining width. */}
      <div className="relative flex items-center justify-center bg-[#0a0806] overflow-hidden h-[40vh] min-h-[260px] shrink-0 lg:h-auto lg:flex-1 lg:min-h-0">
        {currentImage && (
          <div
            className="relative w-[78vw] max-w-[300px] max-h-[calc(40vh-72px)] mx-auto lg:mx-0 lg:w-[min(80vh,480px)] lg:max-w-none lg:max-h-none"
            style={{
              aspectRatio: aspectRatio ? `${aspectRatio}` : "480 / 576",
            }}
          >
            {/* Garment image */}
            <Image
              src={currentImage.url}
              alt={product.name}
              fill
              className="object-contain"
            />

            {/* Base design (fixed, not draggable) */}
            {config?.baseDesign && baseDesign && (
              <div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  width: config.baseDesign.width,
                  height: config.baseDesign.width,
                  top: config.baseDesign.top,
                  left: config.baseDesign.left,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {baseDesign.svg ? (
                  <div
                    style={{
                      color: config.baseDesign.threadHex,
                      width: "100%",
                      height: "100%",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `<svg viewBox="0 0 80 80" style="width:100%;height:100%">${baseDesign.svg}</svg>`,
                    }}
                  />
                ) : baseDesign.url ? (
                  <Image
                    src={baseDesign.url}
                    fill
                    alt=""
                    className="object-contain"
                  />
                ) : null}
              </div>
            )}

            {/* Name preview (locked position) */}
            {config?.nameplate && (
              <div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  width: config.nameplate.width,
                  height: config.nameplate.width,
                  top: config.nameplate.top,
                  left: config.nameplate.left,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {nameText.trim() ? (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: buildTextSvg(
                        nameText,
                        config.nameplate.fontIndex,
                        config.nameplate.threadHex,
                      ),
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-[40%] border border-dashed flex items-center justify-center"
                    style={{ borderColor: `${config.nameplate.threadHex}60` }}
                  >
                    <span
                      className="text-[10px] tracking-[0.14em] uppercase font-mono opacity-40"
                      style={{ color: config.nameplate.threadHex }}
                    >
                      {config.nameplate.placeholder}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Live preview label */}
        <div className="absolute top-3 lg:top-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="h-px w-8 bg-[#3a3028]" />
          <span className="text-[8px] tracking-[0.28em] uppercase text-[#4a3f35] font-mono">
            Live Preview
          </span>
          <div className="h-px w-8 bg-[#3a3028]" />
        </div>

        {/* Template badge */}
        <div className="absolute top-3 right-3 lg:top-6 lg:right-6 flex items-center gap-1.5 bg-[#1a1410] border border-[#2a2420] px-2.5 py-1 lg:px-3 lg:py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--sienna)]" />
          <span className="text-[7px] lg:text-[8px] tracking-[0.18em] uppercase text-[#6a5e54] font-mono whitespace-nowrap">
            Template Design
          </span>
        </div>
      </div>

      {/* ── Panel ── */}
      <aside className="bg-[#12100e] border-t lg:border-t-0 lg:border-l border-[#2a2420] flex flex-col overflow-hidden flex-1 min-h-0 lg:flex-none lg:w-[340px] lg:shrink-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2a2420]">
          <p className="text-[8px] tracking-[0.28em] uppercase text-[#4a3f35] font-mono mb-1">
            {product.name}
          </p>
          <p className="font-[family-name:var(--font-cormorant)] text-[15px] font-light text-[#6a5e54]">
            Personalize with your name
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Garment color */}
          <div>
            <p className="text-[8px] tracking-[0.28em] uppercase text-[var(--sienna)] font-mono mb-3">
              Garment Color
            </p>
            <div className="flex gap-2 flex-wrap">
              {uniqueColors.map((hex) => (
                <button
                  key={hex}
                  title={hex}
                  onClick={() => setGarmentColor(hex)}
                  className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${
                    garmentColor === hex
                      ? "ring-2 ring-offset-2 ring-[var(--gold)] ring-offset-[#12100e]"
                      : ""
                  }`}
                  style={{ background: hex }}
                />
              ))}
            </div>
          </div>

          {/* Name input */}
          <div>
            <p className="text-[8px] tracking-[0.28em] uppercase text-[var(--sienna)] font-mono mb-1">
              Your Name
            </p>
            <p className="font-[family-name:var(--font-cormorant)] text-[14px] font-light text-[#6a5e54] mb-3">
              This will be embroidered at the marked position
            </p>
            <input
              type="text"
              value={nameText}
              onChange={(e) => setNameText(e.target.value)}
              placeholder={config?.nameplate?.placeholder ?? "Your name"}
              maxLength={24}
              className="w-full bg-[#0e0a08] border border-[#2a2420] px-4 py-3 font-[family-name:var(--font-dm-mono)] text-[13px] text-[var(--cream)] outline-none transition-colors focus:border-[var(--sienna)] placeholder:text-[#3a3028]"
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[10px] text-[#4a3f35] font-mono">
                {nameText.length}/24 characters
              </p>
              {nameText.trim() && (
                <button
                  onClick={() => setNameText("")}
                  className="text-[9px] text-[#4a3f35] hover:text-[var(--sienna)] font-mono transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Thread color info (read only — locked from template) */}
          {config?.nameplate && (
            <div>
              <p className="text-[8px] tracking-[0.28em] uppercase text-[var(--sienna)] font-mono mb-3">
                Thread Color
              </p>
              <div className="flex items-center gap-3 px-4 py-3 border border-[#2a2420] bg-[#0e0a08]">
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-white/10"
                  style={{ background: config.nameplate.threadHex }}
                />
                <div>
                  <p className="text-[11px] text-[var(--cream)] font-mono">
                    {config.nameplate.threadHex}
                  </p>
                  <p className="text-[9px] text-[#4a3f35] font-mono mt-0.5">
                    Fixed for this design
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Font preview */}
          {config?.nameplate && nameText.trim() && (
            <div>
              <p className="text-[8px] tracking-[0.28em] uppercase text-[var(--sienna)] font-mono mb-3">
                Preview
              </p>
              <div className="border border-[#2a2420] p-4 bg-[#0e0a08] flex items-center justify-center min-h-[60px]">
                <div
                  className="w-40 h-10"
                  dangerouslySetInnerHTML={{
                    __html: buildTextSvg(
                      nameText,
                      config.nameplate.fontIndex,
                      config.nameplate.threadHex,
                    ),
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Qty + Add to Cart */}
        <div className="shrink-0 border-t border-[#2a2420] bg-[#0e0a08]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2420]">
            <div>
              <div className="text-[8px] tracking-[0.2em] uppercase text-[#4a3f35] font-mono mb-1.5">
                Quantity
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 border border-[#2a2420] text-sm text-[#6a5e54] hover:bg-[var(--cream)] hover:text-[#0e0a08] hover:border-[var(--cream)] transition-all flex items-center justify-center"
                >
                  −
                </button>
                <div className="w-10 h-8 border-y border-[#2a2420] flex items-center justify-center text-sm text-[var(--cream)] font-mono">
                  {qty}
                </div>
                <button
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="w-8 h-8 border border-[#2a2420] text-sm text-[#6a5e54] hover:bg-[var(--cream)] hover:text-[#0e0a08] hover:border-[var(--cream)] transition-all flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="font-serif text-[22px] font-bold text-[var(--gold)]">
                EGP {currentPrice.toLocaleString()}
              </div>
              <div className="text-[8px] tracking-[0.1em] text-[#4a3f35] font-mono mt-px">
                Includes embroidery
              </div>
            </div>
          </div>

          <button
            disabled={addBusy || !nameText.trim()}
            onClick={handleAddToCart}
            className="w-full py-4 bg-[var(--thread)] text-[var(--cream)] text-[10px] tracking-[0.22em] uppercase font-mono flex items-center justify-center gap-2.5 hover:bg-[var(--sienna)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addBusy && (
              <span className="w-2.5 h-2.5 border border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {addBusy
              ? "Adding..."
              : !nameText.trim()
                ? "Enter your name to continue"
                : "Add to Cart"}
          </button>
        </div>
      </aside>
    </div>
  );
}
