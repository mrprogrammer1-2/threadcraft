"use client";
import { useCallback, useState } from "react";
import RightPanel from "@/app/[locale]/studio/_components/RightPanel";
import TopBar from "@/app/[locale]/studio/_components/TopBar";
import GarmentCanvas from "@/app/[locale]/studio/_components/GarmentCanvas";
import { type EmbLayer, createLayerId } from "@/lib/data";

interface Props {
  product: {
    id: string;
    name: string;
    createdAt: Date;
    description: string | null;
    price: number;
    typeId: string;
    featured: boolean;
    studioMode: "none" | "free" | "template";
    salesCount: number;
    isActive: boolean | null;
    type: {
      id: string;
      name: string;
      hasSizes: boolean;
      sizes: string[];
      hasThreadColor: boolean;
      imagePlacements: string[];
    };
    variants: {
      id: string;
      color: string;
      size: string | null;
      price: number | null;
      productId: string;
      stringColor: string | null;
      stock: number | null;
    }[];
    images: {
      id: string;
      color: string | null;
      place: "front" | "back" | "left-sleeve" | "right-sleeve" | null;
      productId: string;
      url: string;
      altText: string | null;
      position: number | null;
    }[];
  };
  initialColor: string;
  initialSize: string;
}

export default function StudioClient({
  product,
  initialColor,
  initialSize,
}: Props) {
  const [garmentColor, setGarmentColor] = useState(initialColor || "#F5F0E8");
  const [garmentKey, setGarmentKey] = useState(initialColor || "cream");
  const [threadColor, setThreadColor] = useState("#A0522D");
  const [garmentSize, setGarmentSize] = useState(initialSize || "M");

  const productImages = product.images.filter((img) => img.place === "front");

  // ── Layers: replaces the old single `emb` object ──
  const [layers, setLayers] = useState<EmbLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) ?? null;

  // Adds a brand new layer, placed at the default center position,
  // and immediately selects it so the user can reposition right away.
  const handleAddLayer = useCallback(
    (partial: Omit<EmbLayer, "id" | "top" | "left" | "width">): string => {
      const newLayer: EmbLayer = {
        id: createLayerId(),
        top: "34%",
        left: "50%",
        width: 110,
        ...partial,
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
      return newLayer.id;
    },
    [],
  );

  const handleUpdateLayer = useCallback((id: string, content: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, content } : l)));
  }, []);

  // Updates the content (and optionally raw data) of whichever layer is
  // currently selected — used for live-editing text/thread color changes.
  const handleUpdateSelectedLayer = useCallback(
    (content: string, raw?: EmbLayer["raw"]) => {
      setLayers((prev) =>
        prev.map((l) =>
          l.id === selectedLayerId ? { ...l, content, raw: raw ?? l.raw } : l,
        ),
      );
    },
    [selectedLayerId],
  );

  const handleDeleteLayer = useCallback(
    (id: string) => {
      setLayers((prev) => prev.filter((l) => l.id !== id));
      if (selectedLayerId === id) setSelectedLayerId(null);
    },
    [selectedLayerId],
  );

  const handleSelectLayer = useCallback((id: string) => {
    setSelectedLayerId(id || null);
  }, []);

  // Moves a layer one position up or down in the array. Since the array
  // order IS the render order, this is all "reordering" actually means —
  // later items in the array render on top of earlier ones.
  const handleMoveLayer = useCallback(
    (id: string, direction: "up" | "down") => {
      setLayers((prev) => {
        const index = prev.findIndex((l) => l.id === id);
        if (index === -1) return prev;

        const targetIndex = direction === "up" ? index + 1 : index - 1;
        if (targetIndex < 0 || targetIndex >= prev.length) return prev; // already at the edge

        const next = [...prev];
        [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
        return next;
      });
    },
    [],
  );

  // Convenience shortcuts — jump straight to front/back instead of stepping
  const handleBringToFront = useCallback((id: string) => {
    setLayers((prev) => {
      const layer = prev.find((l) => l.id === id);
      if (!layer) return prev;
      return [...prev.filter((l) => l.id !== id), layer]; // push to end = top
    });
  }, []);

  const handleSendToBack = useCallback((id: string) => {
    setLayers((prev) => {
      const layer = prev.find((l) => l.id === id);
      if (!layer) return prev;
      return [layer, ...prev.filter((l) => l.id !== id)]; // unshift to start = bottom
    });
  }, []);

  const handleLayerMove = useCallback(
    (id: string, top: string, left: string) => {
      setLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, top, left } : l)),
      );
    },
    [],
  );

  const handlePlaceSelectedLayer = useCallback(
    (top: string, left: string) => {
      if (!selectedLayerId) return;
      setLayers((prev) =>
        prev.map((l) => (l.id === selectedLayerId ? { ...l, top, left } : l)),
      );
    },
    [selectedLayerId],
  );

  const handleResizeSelectedLayer = useCallback(
    (px: number) => {
      if (!selectedLayerId) return;
      setLayers((prev) =>
        prev.map((l) => (l.id === selectedLayerId ? { ...l, width: px } : l)),
      );
    },
    [selectedLayerId],
  );

  return (
    <div className="flex flex-col h-screen">
      <TopBar color={garmentKey} size={garmentSize} threadColor={threadColor} />

      {/*
        Mobile (< lg): stacked, canvas pinned to a fixed share of the
        viewport so it's ALWAYS visible while the panel below it scrolls —
        no drawer, no cover-and-hide. Desktop (lg+): side by side, canvas
        takes remaining width, panel is a fixed 320px column.
      */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="relative h-[40vh] min-h-[260px] shrink-0 lg:h-auto lg:flex-1 lg:min-h-0">
          <GarmentCanvas
            garmentColor={garmentColor}
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={handleSelectLayer}
            onLayerMove={handleLayerMove}
            productImages={productImages}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto lg:flex-none lg:w-[320px] lg:shrink-0">
          <RightPanel
            layers={layers}
            selectedLayer={selectedLayer}
            product={product}
            initialSize={garmentSize}
            garmentColor={garmentColor}
            onColorChange={(hex, key) => {
              setGarmentColor(hex);
              setGarmentKey(key);
            }}
            onThreadChange={setThreadColor}
            onAddLayer={handleAddLayer}
            onUpdateSelectedLayer={handleUpdateSelectedLayer}
            onUpdateLayer={handleUpdateLayer}
            onDeleteLayer={handleDeleteLayer}
            onSelectLayer={handleSelectLayer}
            onPlaceSelectedLayer={handlePlaceSelectedLayer}
            onResizeSelectedLayer={handleResizeSelectedLayer}
            onMoveLayer={handleMoveLayer}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
          />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   WHEN YOU'RE READY TO SAVE TO THE DATABASE:

   The `layers` array IS your customization data. Serialize it
   straight into orderItems.customization (jsonb):

   const customizationPayload = {
     garmentColor: garmentKey,
     garmentSize,
     layers: layers.map(l => ({
       type: l.type,
       top: l.top,
       left: l.left,
       width: l.width,
       raw: l.raw,        // enough to rebuild the layer later
       // don't store `content` (the rendered SVG/HTML) — rebuild it
       // from `raw` + `type` when re-opening the editor, this keeps
       // the JSON small and avoids storing duplicated render output
     })),
   };
════════════════════════════════════════════════════════════ */
