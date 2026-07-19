import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-ink py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-[260px]" />
        </div>

        <div className="border border-border bg-surface p-6 flex items-center gap-5">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        <div className="border border-border bg-surface p-6 space-y-4">
          <Skeleton className="h-6 w-52" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-md" />
            ))}
          </div>
        </div>

        <div className="border border-border bg-surface p-6 space-y-4">
          <Skeleton className="h-6 w-44" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
