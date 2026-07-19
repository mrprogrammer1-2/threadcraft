// ShopPage.tsx
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllProductsWithType } from "@/lib/queries/productsQueriry";
import ShopClient from "./ShopClient";

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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
  );
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const { type } = await searchParams;
  const isRTL = locale === "ar";

  const t = await getTranslations("ShopPage");
  const active = type || t("all");

  const products = await getAllProductsWithType();
  const types = [
    t("all"),
    ...Array.from(new Set(products.map((p) => p.type?.name).filter(Boolean))),
  ] as string[];

  const filtered =
    active === t("all")
      ? products
      : products.filter((p) => p.type?.name === active);

  return (
    <section
      className="min-h-screen pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 bg-(--cream)"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <p className="text-[9px] sm:text-[10px] tracking-[0.3em] text-(--sienna) uppercase mb-3 flex items-center gap-3 hero-tag">
            {t("eyebrow")}
          </p>
          <h1 className="[font-family:var(--font-family-playfair)] text-[clamp(30px,8vw,64px)] font-black leading-none text-(--ink)">
            {t("title")}
          </h1>
        </div>

        {/* Filters */}
        <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap">
          {types.map((tItem) => (
            <Link
              key={tItem}
              href={
                tItem === t("all")
                  ? "/shop"
                  : `/shop?type=${encodeURIComponent(tItem)}`
              }
              scroll={false}
              className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase px-4 py-2 sm:px-5 sm:py-2.5 border transition-colors duration-200 ${
                active === tItem
                  ? "bg-(--ink) text-(--cream) border-(--ink)"
                  : "bg-transparent text-(--ink) border-(--mist) hover:border-(--ink)"
              }`}
            >
              {tItem}
            </Link>
          ))}
        </div>

        <div className="stitch-border mb-8 sm:mb-10" />

        {/* Grid — the only part that actually needs Suspense */}
        <Suspense key={active} fallback={<ProductsGridSkeleton />}>
          <ShopClient products={filtered} noProductsLabel={t("noProducts")} />
        </Suspense>
      </div>
    </section>
  );
}
