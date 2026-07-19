import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDetailSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-border bg-surface p-6">
          <Skeleton className="h-6 w-40" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4 rounded-3xl border border-border bg-surface p-6">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-3xl" />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6">
        <Skeleton className="h-6 w-52" />
        <div className="space-y-3 mt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
