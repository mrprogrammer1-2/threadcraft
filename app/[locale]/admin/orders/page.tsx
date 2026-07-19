import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import OrdersContent from "./components/OrdersContent";
import SearchBar from "@/app/[locale]/admin/_components/SearchBar";
import AdminTableSkeleton from "@/components/skeletons/AdminTableSkeleton";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { userId, search } = await searchParams;
  const t = await getTranslations("AdminOrdersPage");
  const locale = await getLocale();
  const isRTL = locale === "ar";

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-sienna mb-1">
          {t("eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold text-cream tracking-tight">
          {t("title")}
        </h1>
      </div>
      <SearchBar
        action="/admin/orders"
        userId={userId}
        defaultSearch={search}
      />
      <Suspense fallback={<AdminTableSkeleton />}>
        <OrdersContent userId={userId} search={search} />
      </Suspense>
    </div>
  );
}
