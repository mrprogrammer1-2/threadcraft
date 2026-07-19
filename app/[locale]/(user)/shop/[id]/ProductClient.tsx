"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useAddToCart } from "@/lib/hooks/useAddToCart";

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  color: string | null;
  place: "front" | "back" | "left-sleeve" | "right-sleeve" | null;
  position: number | null;
};

type Variant = {
  id: string;
  color: string;
  size: string | null;
  stringColor: string | null;
  stock: number | null;
  price: number | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  featured: boolean;
  studioMode: "none" | "free" | "template";
  salesCount: number;
  type: {
    id: string;
    name: string;
    hasSizes: boolean;
    hasThreadColor: boolean;
  };
  images: ProductImage[];
  variants: Variant[];
};

export default function ProductClient({ product }: { product: Product }) {
  console.log("ProductClient render", { product });
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? null);

  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!activeVariant || !inStock) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      variantId: activeVariant.id,
      color: activeVariant.color,
      size: activeVariant.size ?? "",
      price,
      quantity: 1,
      imageUrl: currentImage?.url ?? null,
    });
  };

  const sizesForColor = product.type.hasSizes
    ? [
        ...new Set(
          product.variants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size)
            .filter(Boolean),
        ),
      ]
    : [];
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizesForColor[0] ?? null,
  );

  const activeVariant = product.variants.find(
    (v) =>
      v.color === selectedColor &&
      (product.type.hasSizes ? v.size === selectedSize : true),
  );

  const price = activeVariant?.price ?? product.price;
  const inStock = (activeVariant?.stock ?? 0) > 0;

  // const canAddOrCustomize = selectedColor && selectedSize ? true:false

  const colorImages = selectedColor
    ? product.images.filter((img) => img.color === selectedColor)
    : [];
  const galleryImages = colorImages.length > 0 ? colorImages : product.images;
  const [activeImg, setActiveImg] = useState(0);

  // Reset active image when selected color changes
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setActiveImg(0);
    const newSizes = product.type.hasSizes
      ? [
          ...new Set(
            product.variants
              .filter((v) => v.color === color)
              .map((v) => v.size)
              .filter(Boolean),
          ),
        ]
      : [];
    setSelectedSize((newSizes[0] as string) ?? null);
  };

  useEffect(() => {
    setActiveImg(0);
  }, [selectedColor, product.images]);

  const currentImage = galleryImages[activeImg] ?? galleryImages[0];

  return (
    <section className="min-h-screen pt-16 sm:pt-20 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-12 bg-(--cream)">
      <div className="max-w-300 mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-(--mist) mb-6 sm:mb-10">
          <Link
            href="/shop"
            className="hover:text-(--sienna) transition-colors duration-200"
          >
            Shop
          </Link>
          <span>/</span>
          <span className="text-(--ink)">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* ── Left: Gallery ── */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {/* {galleryImages.length > 1 && (
              <div className="flex flex-col gap-3 w-16 shrink-0">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-square w-16 overflow-hidden border transition-colors duration-200 ${
                      i === activeImg ? "border-(--ink)" : "border-(--mist) hover:border-(--sienna)"
                    }`}
                  >
                    <Image src={img.url} alt={img.altText ?? product.name} fill className="object-contain p-1" sizes="64px" />
                  </button>
                ))}
              </div>
            )} */}

            {/* Main image */}
            <div className="flex-1 bg-(--pale) aspect-[3/4] relative overflow-hidden p-4 sm:p-6">
              {currentImage ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText ?? product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 120 120"
                    className="w-20 h-20 sm:w-24 sm:h-24 opacity-20"
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
              {currentImage?.place && (
                <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-(--ink) text-(--cream) text-[8px] sm:text-[9px] tracking-[0.15em] uppercase px-2 py-1">
                  {currentImage.place}
                </span>
              )}
              {product.featured && (
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-(--sienna) text-(--cream) text-[8px] sm:text-[9px] tracking-[0.15em] uppercase px-2 py-1">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="flex flex-col">
            <p className="text-[9px] sm:text-[10px] tracking-[0.3em] text-(--sienna) uppercase mb-3">
              {product.type.name}
            </p>
            <h1 className="[font-family:var(--font-family-playfair)] text-[clamp(26px,6vw,48px)] font-black leading-tight text-(--ink) mb-4">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              <span className="text-[18px] sm:text-[22px] tracking-[0.08em] font-mono text-(--ink)">
                {price.toLocaleString()} EGP
              </span>
              {product.salesCount > 0 && (
                <span className="text-[9px] sm:text-[10px] tracking-[0.15em] text-(--mist) uppercase">
                  {product.salesCount} sold
                </span>
              )}
            </div>

            <div className="stitch-border mb-6" />

            {product.description && (
              <p className="[font-family:var(--font-family-cormorant)] text-[16px] sm:text-[18px] leading-relaxed text-[#4a3f35] mb-6 sm:mb-8">
                {product.description}
              </p>
            )}

            {/* Color picker */}
            {colors.length > 0 && (
              <div className="mb-6">
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-(--ink) mb-3">
                  Color —{" "}
                  <span className="text-(--sienna)">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      title={color}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color
                          ? "border-(--ink) scale-110"
                          : "border-(--mist) hover:border-(--sienna)"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size picker */}
            {product.type.hasSizes && sizesForColor.length > 0 && (
              <div className="mb-6">
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-(--ink) mb-3">
                  Size — <span className="text-(--sienna)">{selectedSize}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {sizesForColor.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size as string)}
                      className={`text-[9px] sm:text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 sm:px-4 sm:py-2 border transition-colors duration-200 ${
                        selectedSize === size
                          ? "bg-(--ink) text-(--cream) border-(--ink)"
                          : "bg-transparent text-(--ink) border-(--mist) hover:border-(--ink)"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <p
              className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-6 sm:mb-8 ${inStock ? "text-(--sienna)" : "text-red-400"}`}
            >
              {activeVariant
                ? inStock
                  ? `In stock — ${activeVariant.stock} left`
                  : "Out of stock"
                : "Select options"}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase px-6 sm:px-8 py-3.5 sm:py-4 bg-(--ink) text-(--cream) transition-[background,opacity] duration-200 hover:bg-(--thread) disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              {product.studioMode !== "none" && (
                <Link
                  href={`/studio/${product.id}?color=${encodeURIComponent(selectedColor ?? "")}&size=${encodeURIComponent(selectedSize ?? "")}`}
                  className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase px-6 sm:px-8 py-3.5 sm:py-4 border border-(--ink) text-(--ink) hover:bg-(--ink) hover:text-(--cream) transition-colors duration-200 text-center"
                >
                  {product.studioMode === "template"
                    ? "Personalize"
                    : "Customize"}
                </Link>
              )}
            </div>

            {/* Meta */}
            <div className="mt-8 pt-6 border-t border-(--mist) flex flex-col gap-2">
              {product.studioMode !== "none" && (
                <p className="text-[9px] sm:text-[10px] tracking-[0.15em] text-(--mist) uppercase">
                  ✦{" "}
                  {product.studioMode === "template"
                    ? "Personalizable with your name"
                    : "Customizable with your design"}
                </p>
              )}
              <p className="text-[9px] sm:text-[10px] tracking-[0.15em] text-(--mist) uppercase">
                ✦ Hand-embroidered finish
              </p>
              <p className="text-[9px] sm:text-[10px] tracking-[0.15em] text-(--mist) uppercase">
                ✦ Ships in 5–7 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
