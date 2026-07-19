"use client";

type EmbLayer = {
  id: string;
  type: "library" | "upload" | "text" | "draw";
  content: string;
  top: string;
  left: string;
  width: number;
};

export default function AdminDesignPreview({ layers }: { layers: EmbLayer[] }) {
  return (
    <div className="relative aspect-square bg-white border rounded-xl overflow-hidden">
      {layers.map((layer) => (
        <div
          key={layer.id}
          className="absolute"
          style={{
            top: layer.top,
            left: layer.left,
            width: layer.width,
            height: layer.width,
            transform: "translate(-50%, -50%)",
          }}
          dangerouslySetInnerHTML={{
            __html: layer.content,
          }}
        />
      ))}
    </div>
  );
}
