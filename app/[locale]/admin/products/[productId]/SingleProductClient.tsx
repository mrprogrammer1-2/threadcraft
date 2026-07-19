"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Pencil, ImageOff } from "lucide-react";

export default function SingleProductClient({
  product,
}: {
  product: SingleProductClientType;
}) {
  const t = useTranslations("AdminSingleProductPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div
      className="container mx-auto p-6 space-y-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="border border-border bg-surface p-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-cream tracking-tight">
          {product.name}
        </h1>
        <Link href={`/admin/products/edit?productId=${product.id}`}>
          <Button
            variant="outline"
            className="rounded-none border-sienna/50 text-sienna hover:bg-sienna/10 hover:text-sienna text-[10px] tracking-[0.2em] uppercase gap-2"
          >
            <Pencil className="h-3 w-3" />
            {t("editProduct")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Product Details */}
        <div className="border border-border bg-surface">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
              {t("productDetailsTitle")}
            </p>
          </div>
          <div className="divide-y divide-border">
            <div className="px-5 py-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
                {t("name")}
              </p>
              <p className="text-sm text-cream font-medium">{product.name}</p>
            </div>
            <div className="px-5 py-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
                {t("description")}
              </p>
              <p className="text-sm text-cream/80">
                {product.description || t("notAvailable")}
              </p>
            </div>
            <div className="px-5 py-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
                {t("price")}
              </p>
              <p className="text-sm text-gold font-mono" dir="ltr">
                {t("currency")} {product.price}
              </p>
            </div>
            <div className="px-5 py-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
                {t("type")}
              </p>
              <span className="inline-block text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border border-border text-dim bg-raised/40 font-medium">
                {product.type.name}
              </span>
            </div>
            <div className="px-5 py-3 flex gap-6">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
                  {t("featured")}
                </p>
                <span
                  className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border font-medium ${
                    product.featured
                      ? "text-gold border-gold/30 bg-gold/10"
                      : "text-muted border-border bg-raised/40"
                  }`}
                >
                  {product.featured ? t("yes") : t("no")}
                </span>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
                  {t("studioMode")}
                </p>
                <span
                  className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border font-medium ${
                    product.studioMode !== "none"
                      ? "text-sky-400 border-sky-500/30 bg-sky-500/10"
                      : "text-muted border-border bg-raised/40"
                  }`}
                >
                  {product.studioMode}
                </span>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
                  {t("active")}
                </p>
                <span
                  className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border font-medium ${
                    product.isActive
                      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                      : "text-[#8b4040] border-[#8b4040]/30 bg-[#8b4040]/10"
                  }`}
                >
                  {product.isActive ? t("active") : t("inactive")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="border border-border bg-surface">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
              {t("productImagesTitle")}
            </p>
          </div>
          <div className="p-5">
            {product.images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted gap-2">
                <ImageOff className="h-5 w-5" />
                <p className="text-[11px]">{t("noImages")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <div className="relative aspect-square border border-border bg-raised/40 overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.altText || product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-[10px] space-y-0.5 text-muted">
                      {image.color && (
                        <p className="flex items-center gap-1.5">
                          <span
                            className="inline-block h-2 w-2 border border-border shrink-0"
                            style={{ backgroundColor: image.color }}
                          />
                          <span>
                            {t("color")}: {image.color}
                          </span>
                        </p>
                      )}
                      {image.place && (
                        <p>
                          {t("place")}: {image.place}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="border border-border bg-surface">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
            {t("variantsTitle")}
          </p>
        </div>
        {product.variants.length === 0 ? (
          <p className="px-5 py-6 text-center text-[11px] text-muted">
            {t("noVariants")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className={`h-10 px-5 text-[9px] tracking-[0.2em] uppercase text-muted font-normal bg-raised/40 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("variantColor")}
                  </th>
                  <th
                    className={`h-10 px-5 text-[9px] tracking-[0.2em] uppercase text-muted font-normal bg-raised/40 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("variantSize")}
                  </th>
                  <th
                    className={`h-10 px-5 text-[9px] tracking-[0.2em] uppercase text-muted font-normal bg-raised/40 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("stock")}
                  </th>
                  <th
                    className={`h-10 px-5 text-[9px] tracking-[0.2em] uppercase text-muted font-normal bg-raised/40 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("variantPrice")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="border-b border-border hover:bg-raised/40 transition-colors"
                  >
                    <td className="p-4 text-[11px] text-cream">
                      {variant.color}
                    </td>
                    <td className="p-4 text-[11px] text-cream">
                      {variant.size || t("notAvailable")}
                    </td>
                    <td
                      className="p-4 text-[11px] text-cream font-mono"
                      dir="ltr"
                    >
                      {variant.stock}
                    </td>
                    <td
                      className="p-4 text-[11px] text-gold font-mono"
                      dir="ltr"
                    >
                      {variant.price
                        ? `${t("currency")} ${variant.price}`
                        : t("defaultPrice")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
