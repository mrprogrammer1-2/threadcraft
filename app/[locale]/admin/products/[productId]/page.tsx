import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getSingleProductWithType } from "@/lib/queries/productsQueriry";
import SingleProductClient from "./SingleProductClient";
import { Suspense } from "react";
import Loader from "@/components/Loader";

type ProductDetailProps = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getSingleProductWithType(productId);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description:
      product.description ||
      `View details for ${product.name} — ThreadCraft product.`,
  };
}

export default async function SingleProduct({ params }: ProductDetailProps) {
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
