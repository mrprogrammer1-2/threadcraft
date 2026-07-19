import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailSkeleton() {
  return (
    <div className="min-h-[60vh] flex flex-col gap-5 p-6">
      <Skeleton className="h-8 w-72" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-20 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
      </div>
      <Skeleton className="h-5 w-40" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <Skeleton className="h-14 w-full rounded-3xl" />
            <Skeleton className="h-14 w-full rounded-3xl" />
          </div>
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-3xl" />
    </div>
  );
}
