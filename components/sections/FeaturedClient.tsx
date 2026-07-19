"use client";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
} from "@/lib/features/productsSlice";
import SectionSubTitle from "../SectionSubTitle";
import SectionTitle from "../SectionTitle";
import Loader from "../ui/Loader";
import ProductCard from "../ProductCard";
import { useTranslations } from "next-intl";

export default function Featured() {
  const t = useTranslations("FeaturedPieces");
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const productsStatus = useAppSelector(selectProductsStatus);

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsStatus]);

  const featuredProducts = products.filter((product) => product.featured);

  if (productsStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (productsStatus === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("errorLoading")}
      </div>
    );
  }

  return (
    <section className="bg-[#f5f0e8] px-6 md:px-10 lg:px-16 py-24">
      {/* Heading */}
      <div className="mb-14">
        <SectionSubTitle text={t("eyebrow")} w={12} />
        <SectionTitle text1={t("headingLine1")} text2={t("headingEm")} />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 auto-rows-fr border border-[#e4ddd3]">
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            className={`
              h-full
              ${index !== featuredProducts.length - 1 ? "xl:border-r" : ""}
              border-b xl:border-b-0
              border-[#e4ddd3]
            `}
          >
            <ProductCard product={product} variant="featured" />
          </div>
        ))}
      </div>
    </section>
  );
}
