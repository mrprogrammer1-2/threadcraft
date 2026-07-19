import { Skeleton } from "@/components/ui/skeleton";

export default function UserTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface p-4">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_120px_120px_120px] gap-4 items-center py-3"
            >
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
