import { cn } from "@/lib/utils";

export default function SectionSubTitle({
  text,
  w,
  h,
}: {
  text: string;
  w?: number;
  h?: number;
}) {
  return (
    <div className="mb-6 sm:mb-7 lg:mb-8 tracking-[0.3em] flex items-center gap-3">
      <div className="text-[10px] text-[var(--sienna)] uppercase">{text}</div>
      <div
        className={cn("block w-16 h-px bg-[var(--sienna)] opacity-60")}
        style={{
          width: w ? `${w}px` : undefined,
          height: h ? `${h}px` : undefined,
        }}
      />
    </div>
  );
}
