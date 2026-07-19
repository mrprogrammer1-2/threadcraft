export default function Loader({ label = "loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="var(--mist)"
          strokeWidth="1.5"
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="var(--sienna)"
          strokeWidth="1.5"
          strokeDasharray="30 70"
          strokeLinecap="round"
          className="origin-center animate-spin"
          style={{ animationDuration: "1.2s" }}
        />
      </svg>
      <span className="text-[10px] tracking-[0.3em] uppercase text-(--sienna) font-[family-name:var(--font-family-dm-mono)]">
        {label}
      </span>
    </div>
  );
}
