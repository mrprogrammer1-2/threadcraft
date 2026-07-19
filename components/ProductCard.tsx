// ProductCard.tsx
"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import type { Product } from "@/lib/features/productsSlice";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  product: Product;
  variant?: "shop" | "featured";
}

function ProductImageArea({ product }: { product: Product }) {
  const t = useTranslations("ProductCard");
  const firstImage = product.images[0];

  return (
    <div className="relative bg-[#ebe5dc] aspect-[0.78] overflow-hidden border border-[#e4ddd3]">
      {/* Tags */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex gap-2">
        {product.featured && (
          <span className="bg-[#a45d32] text-[#f7f1e8] text-[8px] sm:text-[9px] tracking-[0.22em] uppercase px-3 py-1.5 sm:px-4 sm:py-2 leading-none">
            {t("bestseller")}
          </span>
        )}
        {/* 
        {product.isCustomizable && (
          <span className="bg-[#c8a15a] text-[#f7f1e8] text-[9px] tracking-[0.22em] uppercase px-4 py-2 leading-none">
            {t("addYourDesign")}
          </span>
        )} */}
      </div>

      {/* Product Image */}
      <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-8 md:p-12">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.altText ?? product.name}
            fill
            className="object-contain group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 50vw,
                   25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              viewBox="0 0 120 120"
              className="w-20 h-20 sm:w-28 sm:h-28 opacity-30"
            >
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#A0522D"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              <g transform="translate(60,60)">
                {[0, 45, 90, 135].map((r) => (
                  <ellipse
                    key={r}
                    rx="8"
                    ry="20"
                    fill="none"
                    stroke="#A0522D"
                    strokeWidth="1.5"
                    transform={`rotate(${r})`}
                  />
                ))}
                <circle r="6" fill="#A0522D" opacity="0.8" />
              </g>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductCard({
  product,
  variant = "featured",
}: ProductCardProps) {
  const t = useTranslations("ProductCard");
  const addToCart = useAddToCart();

  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizes = Array.from(
    new Set(
      product.variants.map((v) => v.size).filter((size) => size !== null),
    ),
  );
  const defaultVariant = product.variants[0];
  const variantPrice = defaultVariant?.price ?? product.price;
  const canAddDirectly =
    product.variants.length === 1 && defaultVariant != null;

  const handleAddToCart = () => {
    if (!canAddDirectly || !defaultVariant) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      variantId: defaultVariant.id,
      color: defaultVariant.color,
      size: defaultVariant.size ?? "",
      price: variantPrice,
      quantity: 1,
      imageUrl: product.images[0]?.url ?? "",
    });
  };

  if (variant === "shop") {
    return (
      <div className="group flex flex-col">
        <Link href={`/shop/${product.id}`}>
          <ProductImageArea product={product} />
        </Link>

        {/* Info */}
        <div className="flex flex-col flex-1">
          <p className="text-[9px] tracking-[0.25em] text-(--sienna) uppercase mb-1">
            {product.type?.name}
          </p>
          <h3 className="font-family-playfair text-[16px] sm:text-[18px] font-bold text-(--ink) mb-2 leading-tight">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-[12px] text-[#4a3f35] leading-relaxed mb-3 line-clamp-2 font-family-cormorant">
              {product.description}
            </p>
          )}
          {/* Colors & Sizes */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {colors.map((color) => (
                  <span
                    key={color}
                    className="w-4 h-4 rounded-full border border-[#d7cec3] shrink-0"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Sizes */}
              {sizes.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className="text-[10px] px-2 py-0.5 border border-[#d7cec3] rounded text-[#74685e]"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-(--mist)">
            <span className="text-[13px] sm:text-[14px] tracking-widest font-mono text-(--ink)">
              {variantPrice.toLocaleString()} EGP
            </span>
            <div className="flex items-center gap-2">
              {canAddDirectly ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-(--cream) bg-(--ink) px-2.5 py-2 sm:px-3 rounded transition-colors duration-200 hover:bg-(--sienna)"
                >
                  {t("addToCart")}
                </button>
              ) : (
                <Link
                  href={`/shop/${product.id}`}
                  className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-(--cream) bg-(--ink) px-2.5 py-2 sm:px-3 rounded transition-colors duration-200 hover:bg-(--sienna)"
                >
                  {t("chooseOptions")}
                </Link>
              )}
              <Link
                href={`/shop/${product.id}`}
                className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-(--ink) border-b border-(--ink) pb-0.5 hover:text-(--sienna) hover:border-(--sienna) transition-colors duration-200"
              >
                {t("view")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Featured variant
  return (
    <div className="group bg-[#f3eee6] flex flex-col border border-[#e4ddd3] h-full">
      <Link href={`/shop/${product.id}`}>
        <ProductImageArea product={product} />
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 px-5 py-5 sm:px-6 sm:py-6 bg-[#f6f1e8]">
        <h3 className="font-family-playfair text-[18px] sm:text-[20px] md:text-[22px] font-bold text-[#1d1713] leading-tight mb-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="font-family-cormorant text-[14px] sm:text-[15px] text-[#74685e] leading-relaxed mb-4 sm:mb-5 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Colors */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-5 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {Array.from(new Set(product.variants.map((v) => v.color))).map(
                (color) => (
                  <span
                    key={color}
                    className="w-4 h-4 rounded-full border border-[#d7cec3] shrink-0"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ),
              )}
            </div>

            {/* Sizes */}
            {Array.from(
              new Set(
                product.variants.map((v) => v.size).filter((s) => s !== null),
              ),
            ).length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from(
                  new Set(
                    product.variants
                      .map((v) => v.size)
                      .filter((s) => s !== null),
                  ),
                ).map((size) => (
                  <span
                    key={size}
                    className="text-[11px] px-2 py-1 border border-[#d7cec3] rounded text-[#74685e]"
                  >
                    {size}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[22px] sm:text-[28px] leading-none text-[#16110d] font-medium tracking-[-0.03em]">
              ${product.price}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[#a45d32]">
              {product.type?.name}
            </span>
            {canAddDirectly ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-(--cream) bg-(--ink) px-2.5 py-2 sm:px-3 rounded transition-colors duration-200 hover:bg-(--sienna)"
              >
                {t("addToCart")}
              </button>
            ) : (
              <Link
                href={`/shop/${product.id}`}
                className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-(--cream) bg-(--ink) px-2.5 py-2 sm:px-3 rounded transition-colors duration-200 hover:bg-(--sienna)"
              >
                {t("chooseOptions")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
