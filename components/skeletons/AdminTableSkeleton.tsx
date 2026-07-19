import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 bg-sienna/20" />
        <Skeleton className="h-7 w-40 bg-cream/10" />
      </div>
      <div className="overflow-x-auto rounded-none border border-[var(--border)] bg-[var(--surface)] p-4">
        {/* header row */}
        <div className="grid grid-cols-[1fr_120px_120px_120px] gap-4 items-center pb-3 border-b border-[var(--border)] mb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-3/4 bg-sienna/20" />
          ))}
        </div>
        {/* data rows */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_120px_120px_120px] gap-4 items-center py-3 border-b border-[var(--border)]/40 last:border-0"
          >
            <Skeleton className="h-4 w-full bg-cream/10" />
            <Skeleton className="h-4 w-full bg-cream/10" />
            <Skeleton className="h-4 w-2/3 bg-cream/10" />
            <Skeleton className="h-5 w-16 bg-sienna/15" />
          </div>
        ))}
      </div>
    </div>
  );
}
