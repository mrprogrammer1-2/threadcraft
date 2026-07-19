import { getTranslations, getLocale } from "next-intl/server";
import { getSingleProductWithType } from "@/lib/queries/productsQueriry";
import SingleProductClient from "./SingleProductClient";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default async function SingleProduct({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const t = await getTranslations("AdminSingleProductPage");
  const locale = await getLocale();
  const isRTL = locale === "ar";

  const product = await getSingleProductWithType(productId);

  if (!product) {
    return (
      <div className="p-6 text-sm text-muted" dir={isRTL ? "rtl" : "ltr"}>
        {t("productNotFound")}
      </div>
    );
  }

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <SingleProductClient product={product} />
      </Suspense>
    </div>
  );
}
