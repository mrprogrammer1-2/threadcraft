"use client";
import {
  TABS,
  THREADS,
  FONTS,
  type TabId,
  PLACES,
  type EmbLayer,
} from "@/lib/data";
import { useEffect, useRef, useState } from "react";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import { useRouter } from "next/navigation";
import Image from "next/image";

export type Design = {
  id: string;
  key: string;
  label: string;
  svg: string | null;
  url: string | null;
  createdAt: string;
};

interface Props {
  layers: EmbLayer[];
  selectedLayer: EmbLayer | null;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string; color: string | null }[];
    variants: {
      id: string;
      color: string;
      size: string | null;
      price: number | null;
    }[];
  };
  initialSize: string;
  garmentColor: string;
  onColorChange: (hex: string, key: string) => void;
  onThreadChange: (hex: string) => void;
  onAddLayer: (
    layer: Omit<EmbLayer, "id" | "top" | "left" | "width">,
  ) => string;
  onUpdateSelectedLayer: (content: string, raw?: EmbLayer["raw"]) => void;
  onUpdateLayer: (id: string, content: string) => void;
  onDeleteLayer: (id: string) => void;
  onSelectLayer: (id: string) => void;
  onPlaceSelectedLayer: (top: string, left: string) => void;
  onResizeSelectedLayer: (px: number) => void;
  onMoveLayer: (id: string, direction: "up" | "down") => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
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
    <text x="40" y="46" text-anchor="middle" font-family="${f.font},serif" font-style="${f.italic ? "italic" : "normal"}"
      font-size="${isMono ? 10 : 16}" letter-spacing="${isMono ? 2 : 0.5}"
      fill="none" stroke="${threadHex}" stroke-width="1.1">${safeVal}</text></svg>`;
}

export default function RightPanel({
  layers,
  selectedLayer,
  product,
  initialSize,
  garmentColor,
  onColorChange,
  onThreadChange,
  onAddLayer,
  onUpdateSelectedLayer,
  onUpdateLayer,
  onDeleteLayer,
  onSelectLayer,
  onPlaceSelectedLayer,
  onResizeSelectedLayer,
  onMoveLayer,
  onBringToFront,
  onSendToBack,
}: Props) {
  const [tab, setTab] = useState<TabId>("garment");
  const [threadColor, setThreadColor] = useState<string>("#A0522D");
  const [qty, setQty] = useState(1);
  const [addBusy, setAddBusy] = useState(false);
  const [designs, setDesigns] = useState<Design[]>([]);

  useEffect(() => {
    fetch("/api/designs")
      .then((r) => r.json())
      .then(setDesigns);
  }, []);

  const addToCart = useAddToCart();
  const router = useRouter();

  const handleQty = (delta: number) =>
    setQty((q) => Math.max(1, Math.min(20, q + delta)));

  const handleAddToCart = async () => {
    const variant =
      product.variants.find(
        (v) => v.color === garmentColor && v.size === initialSize,
      ) ??
      product.variants.find((v) => v.color === garmentColor) ??
      product.variants[0];

    if (!variant) return;
    setAddBusy(true);
    const image = product.images.find((img) => img.color === garmentColor);

    const customization =
      layers.length > 0
        ? {
            garmentColor,
            layers: layers.map((l) => ({
              type: l.type,
              top: l.top,
              left: l.left,
              width: l.width,
              raw: l.raw,
              url:
                l.type === "upload"
                  ? l.content.match(/src="([^"]+)"/)?.[1]
                  : undefined,
            })),
          }
        : null;

    await addToCart({
      productId: product.id,
      productName: product.name,
      variantId: variant.id,
      color: garmentColor,
      size: initialSize,
      price: (variant.price ?? product.price) * qty,
      quantity: qty,
      imageUrl: image?.url ?? null,
      customization,
    });
    setAddBusy(false);
    router.push("/cart");
  };

  const [uploadMsg, setUploadMsg] = useState<string>("");

  // ── Text state ──
  // textVal and selFont are always kept in sync with the selected text layer.
  // When a text layer is selected, we populate them from layer.raw so that
  // font changes immediately apply even before the user touches the textarea.
  const [textVal, setTextVal] = useState<string>("");
  const [selFont, setSelFont] = useState(0);
  const prevSelectedIdRef = useRef<string | null>(null);

  // Sync textVal + selFont whenever the selected layer changes
  useEffect(() => {
    if (selectedLayer?.type === "text") {
      // Only sync when the selected layer actually changed (not on every re-render)
      if (prevSelectedIdRef.current !== selectedLayer.id) {
        setTextVal(selectedLayer.raw?.text ?? "");
        setSelFont(selectedLayer.raw?.fontIndex ?? 0);
        prevSelectedIdRef.current = selectedLayer.id;
      }
    } else {
      // Non-text layer selected (or nothing) — clear the draft
      if (prevSelectedIdRef.current !== null) {
        setTextVal("");
        setSelFont(0);
        prevSelectedIdRef.current = null;
      }
    }
  }, [selectedLayer]);

  // Also switch to text tab automatically when a text layer is selected
  useEffect(() => {
    if (selectedLayer?.type === "text") {
      setTab("text");
    }
  }, [selectedLayer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  const getPos = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const c = canvasRef.current!;
    const src = "touches" in e ? e.touches[0] : e;
    return {
      x: (src.clientX - r.left) * (c.width / r.width),
      y: (src.clientY - r.top) * (c.height / r.height),
    };
  };

  const handleUpload = (file: File) => {
    const r = new FileReader();
    r.onload = async (e) => {
      const base64 = e.target!.result as string;
      const layerId = onAddLayer({
        type: "upload",
        content: `<img src="${base64}" style="width:100%;height:100%;object-fit:contain;filter:sepia(.2) saturate(.85)"/>`,
      });
      setUploadMsg("✓ " + file.name + " added as a new layer");
      const res = await fetch("/api/upload-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdateLayer(
          layerId,
          `<img src="${data.url}" style="width:100%;height:100%;object-fit:contain;filter:sepia(.2) saturate(.85)"/>`,
        );
      }
    };
    r.readAsDataURL(file);
  };

  // Live-update the layer as the user types
  const handleTextChange = (val: string) => {
    setTextVal(val);
    if (selectedLayer?.type === "text") {
      if (val.trim()) {
        onUpdateSelectedLayer(buildTextSvg(val, selFont, threadColor), {
          text: val,
          fontIndex: selFont,
          threadHex: threadColor,
        });
      }
    }
  };

  // Font change: works whether the user has typed or is editing an existing layer
  const handleFontChange = (idx: number) => {
    setSelFont(idx);
    // Use the current textVal OR fall back to the selected layer's text
    const currentText = textVal || selectedLayer?.raw?.text || "";
    const currentThread = selectedLayer?.raw?.threadHex ?? threadColor;

    if (selectedLayer?.type === "text" && currentText.trim()) {
      onUpdateSelectedLayer(buildTextSvg(currentText, idx, currentThread), {
        text: currentText,
        fontIndex: idx,
        threadHex: currentThread,
      });
    }
  };

  const handleAddTextLayer = () => {
    if (!textVal.trim()) return;
    onAddLayer({
      type: "text",
      content: buildTextSvg(textVal, selFont, threadColor),
      raw: { text: textVal, fontIndex: selFont, threadHex: threadColor },
    });
    setTextVal("");
  };

  // Library motif: always adds a NEW layer
  const handleAddMotif = (key: string) => {
    const design = designs.find((d) => d.key === key);
    if (!design) return;

    if (design.svg) {
      onAddLayer({
        type: "library",
        content: `<svg viewBox="0 0 80 80" style="width:100%;height:100%;color:${threadColor}">${design.svg}</svg>`,
        raw: { designKey: design.id, threadHex: threadColor },
      });
    } else if (design.url) {
      onAddLayer({
        type: "library",
        content: `<img src="${design.url}" style="width:100%;height:100%;object-fit:contain"/>`,
        raw: { designKey: design.id, threadHex: threadColor },
      });
    }
  };

  const isEditingTextLayer =
    selectedLayer?.type === "text" && !!selectedLayer.raw?.text;

  const sectionLabel = (text: string, colorValue?: string) => (
    <div className="flex items-center gap-2 text-[8px] tracking-[0.28em] uppercase text-sienna mb-2.5 ps-label">
      {text}
      {colorValue && (
        <span className="text-[7px] text-mist-400">{colorValue}</span>
      )}
    </div>
  );

  const section = (children: React.ReactNode) => (
    <div className="mb-5 last:mb-0">{children}</div>
  );

  return (
    <aside className="bg-surface border-l border-border flex flex-col overflow-hidden h-full">
      <div className="flex shrink-0 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as TabId)}
            className={`flex-1 h-12 flex flex-col items-center justify-center gap-0.5 border-b-2 transition-all font-mono
              ${tab === t.id ? "text-gold border-gold" : "text-muted border-transparent hover:text-dim"}`}
          >
            <span className="text-base leading-none">{t.icon}</span>
            <span className="text-[7px] tracking-[0.18em] uppercase">
              {t.label}
            </span>
          </button>
        ))}
      </div>
      <div className="stitch-line" />

      {layers.length > 0 && (
        <div className="shrink-0 border-b border-border px-4 py-3 bg-raised/30">
          <div className="text-[8px] tracking-[0.28em] uppercase text-sienna mb-2">
            Layers — {layers.length}
          </div>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
            {[...layers].reverse().map((l) => {
              const isSelected = l.id === selectedLayer?.id;
              const arrayIndex = layers.findIndex((x) => x.id === l.id);
              const isFront = arrayIndex === layers.length - 1;
              const isBack = arrayIndex === 0;

              return (
                <div
                  key={l.id}
                  onClick={() => onSelectLayer(l.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-[10px] cursor-pointer transition-all ${
                    isSelected
                      ? "border-gold bg-gold/10 text-cream"
                      : "border-border text-dim hover:border-mist"
                  }`}
                >
                  <span className="truncate flex-1">
                    {l.type === "text" ? `"${l.raw?.text ?? "Text"}"` : l.type}
                  </span>

                  {layers.length > 1 && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        title="Send backward"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveLayer(l.id, "down");
                        }}
                        disabled={isBack}
                        className="w-4 h-4 flex items-center justify-center text-[9px] text-muted hover:text-cream hover:bg-border disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                      <button
                        title="Bring forward"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveLayer(l.id, "up");
                        }}
                        disabled={isFront}
                        className="w-4 h-4 flex items-center justify-center text-[9px] text-muted hover:text-cream hover:bg-border disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(l.id);
                    }}
                    className="text-[#8b4040] hover:text-cream hover:bg-[#8b4040] w-4 h-4 flex items-center justify-center shrink-0"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {selectedLayer && layers.length > 1 && (
            <div className="flex gap-1.5 mt-2.5 pt-2.5 border-t border-border/60">
              <button
                onClick={() => onBringToFront(selectedLayer.id)}
                className="flex-1 py-1.5 border border-border text-[8px] tracking-widest uppercase text-dim hover:border-sienna hover:text-cream transition-all"
              >
                Bring to Front
              </button>
              <button
                onClick={() => onSendToBack(selectedLayer.id)}
                className="flex-1 py-1.5 border border-border text-[8px] tracking-widest uppercase text-dim hover:border-sienna hover:text-cream transition-all"
              >
                Send to Back
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto panel-scroll">
        {/* garment */}
        {tab === "garment" && (
          <div className="text-white p-4">
            {section(
              <>
                {sectionLabel("Garment color", garmentColor)}
                <div className="flex gap-2 flex-wrap">
                  {[...new Set(product.variants.map((v) => v.color))].map(
                    (hex) => (
                      <div
                        key={hex}
                        title={hex}
                        onClick={() => onColorChange(hex, hex)}
                        className={`w-7 h-7 rounded-full transition-all hover:scale-110 cursor-pointer ${
                          garmentColor === hex
                            ? "ring-2 ring-offset-2 ring-gold ring-offset-surface"
                            : ""
                        }`}
                        style={{ background: hex }}
                      />
                    ),
                  )}
                </div>
              </>,
            )}

            {section(
              <>
                {sectionLabel("Thread color")}
                <p className="text-[9px] text-muted mb-2 leading-relaxed">
                  Applies to the next design you add, or to the selected layer
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {THREADS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => {
                        setThreadColor(t.hex);
                        onThreadChange(t.hex);
                        if (
                          selectedLayer?.type === "text" &&
                          selectedLayer.raw?.text
                        ) {
                          onUpdateSelectedLayer(
                            buildTextSvg(
                              selectedLayer.raw.text,
                              selectedLayer.raw.fontIndex ?? 0,
                              t.hex,
                            ),
                            { ...selectedLayer.raw, threadHex: t.hex },
                          );
                        }
                        if (
                          selectedLayer?.type === "library" &&
                          selectedLayer.raw?.designKey
                        ) {
                          const design = designs.find(
                            (d) => d.id === selectedLayer.raw!.designKey,
                          );
                          if (design?.svg) {
                            onUpdateSelectedLayer(
                              `<svg viewBox="0 0 80 80" style="width:100%;height:100%;color:${t.hex}">${design.svg}</svg>`,
                              { ...selectedLayer.raw, threadHex: t.hex },
                            );
                          }
                        }
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-[8px] tracking-[0.12em] uppercase transition-all
                      ${threadColor === t.hex ? "border-sienna text-cream bg-sienna/20" : "border-border text-dim hover:border-sienna hover:text-cream"}`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          background: t.hex,
                          border: t.border ? `1px solid #ccc` : undefined,
                        }}
                      />
                      {t.label}
                    </button>
                  ))}
                </div>
              </>,
            )}
          </div>
        )}

        {/* library */}
        {tab === "library" && (
          <div className="p-4">
            {section(
              <>
                {sectionLabel("Choose a Motif")}
                <p className="text-[9px] text-muted mb-3 leading-relaxed">
                  Click a motif to add it as a new layer
                </p>
                {designs.length === 0 ? (
                  <p className="text-[9px] text-muted text-center py-6">
                    No designs available yet
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {designs.map((d) => (
                      <button
                        key={d.key}
                        onClick={() => handleAddMotif(d.key)}
                        className="aspect-square bg-raised flex flex-col items-center justify-center border border-transparent hover:border-sienna cursor-pointer relative overflow-hidden transition-all"
                      >
                        {d.svg ? (
                          <svg
                            viewBox="0 0 80 80"
                            className="w-[52%] h-[52%] pointer-events-none"
                            style={{ color: "#a0522d" }}
                            dangerouslySetInnerHTML={{ __html: d.svg }}
                          />
                        ) : d.url ? (
                          <div className="relative w-[52%] h-[52%]">
                            <Image
                              src={d.url}
                              alt={d.label}
                              fill
                              className="object-contain pointer-events-none"
                            />
                          </div>
                        ) : null}
                        <span
                          className="absolute bottom-0 left-0 right-0 text-[7px] tracking-widest uppercase text-mist text-center py-1"
                          style={{
                            background:
                              "linear-gradient(transparent,rgba(13,10,8,.6))",
                          }}
                        >
                          {d.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>,
            )}
          </div>
        )}

        {/* upload */}
        {tab === "upload" && (
          <div className="p-4">
            {section(
              <>
                {sectionLabel("Upload Artwork")}
                <div
                  className="border border-dashed border-border p-6 text-center hover:border-sienna hover:bg-sienna/10 transition-all cursor-pointer"
                  onClick={() => document.getElementById("fileInp")?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f?.type.startsWith("image/")) handleUpload(f);
                  }}
                >
                  <span className="block text-2xl mb-2.5 text-muted">✦</span>
                  <p className="font-garamond text-base font-light text-dim mb-1">
                    Drop your file here
                  </p>
                  <p className="uppercase text-[8px] tracking-[0.15em] text-muted">
                    PNG · SVG · JPG · Max 20MB
                  </p>
                </div>
                {uploadMsg && (
                  <p className="mt-2.5 text-[9px] tracking-widest text-sienna text-center">
                    {uploadMsg}
                  </p>
                )}
                <input
                  id="fileInp"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                  }}
                />
              </>,
            )}
            {section(
              <>
                {sectionLabel("Tip")}
                <p className="font-garamond text-[15px] font-light text-muted leading-relaxed">
                  Each upload creates a new layer. Use the layer list above to
                  reposition or remove individual designs.
                </p>
              </>,
            )}
          </div>
        )}

        {/* text */}
        {tab === "text" && (
          <div className="p-4">
            {/* Status pill */}
            <div className="mb-4">
              {isEditingTextLayer ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="text-[8px] tracking-[0.16em] uppercase text-gold">
                    Editing layer · &ldquo;{selectedLayer.raw?.text}&rdquo;
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-border/40 border border-border rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                  <span className="text-[8px] tracking-[0.16em] uppercase text-muted">
                    New layer
                  </span>
                </div>
              )}
            </div>

            {section(
              <>
                {sectionLabel("Your Text")}
                <textarea
                  rows={2}
                  placeholder="Type to embroider..."
                  value={textVal}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="w-full bg-ink border border-border p-2.5 text-cream text-sm font-garamond focus:border-sienna outline-none resize-none"
                />
              </>,
            )}

            {section(
              <>
                {sectionLabel("Font Style")}
                <div className="flex flex-col gap-1.5">
                  {FONTS.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => handleFontChange(i)}
                      className={`px-3 py-2.5 border text-left transition-all ${
                        selFont === i
                          ? "border-sienna bg-sienna/10"
                          : "border-border hover:border-sienna hover:bg-sienna/10"
                      }`}
                    >
                      <span
                        className="block text-[15px] text-cream mb-0.5"
                        style={f.style as React.CSSProperties}
                      >
                        {f.preview}
                      </span>
                      <span className="text-[8px] tracking-widest uppercase text-muted">
                        {f.meta}
                      </span>
                    </button>
                  ))}
                </div>
              </>,
            )}

            {section(
              <>
                {isEditingTextLayer ? (
                  // When editing an existing layer — show update + new layer options
                  <div className="flex flex-col gap-2">
                    <p className="text-[9px] text-muted text-center">
                      Changes apply live to the selected layer
                    </p>
                    <button
                      onClick={() => {
                        // Deselect and clear to start fresh
                        onSelectLayer("");
                        setTextVal("");
                        setSelFont(0);
                      }}
                      className="w-full py-2.5 border border-border text-[9px] tracking-[0.2em] uppercase text-dim hover:border-sienna hover:text-cream transition-colors"
                    >
                      + Start a new text layer
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddTextLayer}
                    disabled={!textVal.trim()}
                    className="w-full py-3 bg-thread text-cream text-[9px] tracking-[0.2em] uppercase hover:bg-sienna transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    + Add as New Text Layer
                  </button>
                )}
              </>,
            )}
          </div>
        )}

        {/* place */}
        {tab === "place" && (
          <div className="p-4">
            {!selectedLayer ? (
              <div className="text-[12px] text-muted font-garamond leading-relaxed py-4 text-center">
                Select a layer (click it on the garment, or in the layer list
                above) to adjust its position and size.
              </div>
            ) : (
              <>
                {section(
                  <>
                    {sectionLabel("Position")}
                    <div className="grid grid-cols-3 gap-1.5">
                      {Object.entries(PLACES).map(([key, p]) => (
                        <button
                          key={key}
                          onClick={() => onPlaceSelectedLayer(p.top, p.left)}
                          className="py-2 px-1 border border-border text-[7px] tracking-widest uppercase text-center text-dim hover:bg-thread hover:text-cream hover:border-thread transition-all"
                        >
                          {key
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </>,
                )}
                {section(
                  <>
                    {sectionLabel("Embroidery Size")}
                    <div className="flex items-center gap-2.5 mt-3">
                      <input
                        type="range"
                        min={60}
                        max={180}
                        value={selectedLayer.width}
                        className="flex-1 range-slider"
                        onChange={(e) => onResizeSelectedLayer(+e.target.value)}
                      />
                      <span className="text-[10px] text-muted min-w-8 text-right">
                        {selectedLayer.width}
                      </span>
                    </div>
                  </>,
                )}
                {section(
                  <p className="font-garamond text-sm font-light text-muted leading-relaxed">
                    Drag the design directly on the garment to fine-tune its
                    position.
                  </p>,
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom: Quantity + Add to Cart */}
      <div className="shrink-0 border-t border-border bg-surface">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <div className="text-[8px] tracking-[0.2em] uppercase text-muted mb-1.5">
              Quantity
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleQty(-1)}
                className="w-8 h-8 border border-border bg-transparent text-sm text-dim hover:bg-cream hover:text-ink hover:border-cream transition-all flex items-center justify-center"
              >
                −
              </button>
              <div className="w-10 h-8 border-y border-border flex items-center justify-center text-sm text-cream">
                {qty}
              </div>
              <button
                onClick={() => handleQty(+1)}
                className="w-8 h-8 border border-border bg-transparent text-sm text-dim hover:bg-cream hover:text-ink hover:border-cream transition-all flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="font-serif text-[22px] font-bold text-gold">
              EGP{" "}
              {(
                (product.variants.find((v) => v.color === garmentColor)
                  ?.price ?? product.price) * qty
              ).toLocaleString()}
            </div>
            <div className="text-[8px] tracking-[0.1em] text-muted mt-px">
              Includes embroidery
            </div>
          </div>
        </div>
        <button
          disabled={addBusy}
          onClick={handleAddToCart}
          className="w-full py-3.5 bg-thread text-cream text-[10px] tracking-[0.22em] uppercase flex items-center justify-center gap-2.5 hover:bg-sienna transition-colors disabled:opacity-80"
        >
          {addBusy && (
            <span className="w-2.5 h-2.5 border border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {addBusy ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </aside>
  );
}
