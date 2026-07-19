import { Skeleton } from "@/components/ui/skeleton";

export default function ShopSkeleton() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-12 bg-(--cream)">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <div className="h-5 w-40 rounded-md bg-muted animate-pulse mb-3" />
          <div className="h-16 w-[clamp(240px,50vw,580px)] rounded-md bg-muted animate-pulse" />
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-[120px] rounded-full" />
          ))}
        </div>

        <div className="stitch-border mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-72 w-full rounded-[1.25rem]" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/5 rounded-md" />
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
