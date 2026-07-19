import React from "react";
import { Shirt } from "lucide-react";

interface Props {
  color: string;
  size: string;
  threadColor: string;
}

export default function TopBar({ color, size, threadColor }: Props) {
  return (
    <header className="h-12 shrink-0 z-[100] bg-surface border-b border-border flex items-center gap-4 sm:gap-6 px-4 sm:px-5">
      {/* Wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <Shirt className="h-3.5 w-3.5 text-sienna" strokeWidth={1.75} />
        <span className="text-[9px] tracking-[0.3em] uppercase text-sienna font-mono">
          Studio
        </span>
      </div>

      <div className="h-4 w-px bg-border shrink-0" />

      {/* Garment summary chips */}
      <div className="flex items-center gap-4 sm:gap-6 min-w-0 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/15 shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-[10px] tracking-[0.15em] uppercase text-muted font-mono">
            Color
          </span>
          <span className="text-[11px] text-cream font-mono capitalize truncate max-w-[8rem]">
            {color}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] tracking-[0.15em] uppercase text-muted font-mono">
            Size
          </span>
          <span className="text-[11px] text-cream font-mono uppercase">
            {size}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/15 shrink-0"
            style={{ backgroundColor: threadColor }}
          />
          <span className="text-[10px] tracking-[0.15em] uppercase text-muted font-mono">
            Thread
          </span>
        </div>
      </div>
    </header>
  );
}
