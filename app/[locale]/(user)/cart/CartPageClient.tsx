"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  cartTotalQuantity,
  allCartItems,
  clearCart,
} from "@/lib/features/cartSlice";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useDeleteCartItem } from "@/lib/hooks/useDeleteCartItem";
import { useChangeQuantity } from "@/lib/hooks/useChangeQuantity";

export default function CartPageClient() {
  const t = useTranslations("CartPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const items = useAppSelector(allCartItems);
  const quantity = useAppSelector(cartTotalQuantity);
  const dispatch = useAppDispatch();
  const [showClearModal, setShowClearModal] = useState(false);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleClearCart = () => {
    dispatch(clearCart());
    setShowClearModal(false);
  };

  return (
    <main
      className="min-h-screen bg-(--cream) pt-32 pb-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-family-playfair text-[42px] font-bold text-(--ink) mb-2">
            {t("title")}
          </h1>
          <p className="text-[14px] tracking-[0.15em] text-(--sienna) uppercase">
            {t("itemCount", { count: items.length })}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-(--mist) bg-white rounded-lg">
            <p className="text-[16px] text-(--ink) mb-8">{t("emptyMessage")}</p>
            <Link
              href="/shop"
              className="inline-block text-[12px] tracking-[0.18em] uppercase text-(--cream) bg-(--ink) px-6 py-3 rounded transition-colors duration-200 hover:bg-(--sienna)"
            >
              {t("continueShopping")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.variantId} {...item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit sticky top-32 border border-(--mist) bg-white rounded-lg p-6">
              <h2 className="font-family-playfair text-[24px] font-bold text-(--ink) mb-6">
                {t("orderSummary")}
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-(--mist)">
                <div className="flex justify-between text-[14px]">
                  <span className="text-(--ink)">{t("subtotal")}</span>
                  <span className="font-mono text-(--ink)">
                    {totalPrice.toLocaleString()} {t("currency")}
                  </span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-(--ink)">{t("items")}</span>
                  <span className="font-mono text-(--ink)">{quantity}</span>
                </div>
              </div>

              <div className="flex justify-between text-[18px] font-bold text-(--ink) mb-8">
                <span>{t("total")}</span>
                <span className="font-mono">
                  {totalPrice.toLocaleString()} {t("currency")}
                </span>
              </div>

              <button className="w-full text-[12px] tracking-[0.18em] uppercase text-(--cream) bg-(--ink) px-6 py-3 rounded transition-colors duration-200 hover:bg-(--sienna) mb-3">
                {t("checkout")}
              </button>

              <button
                onClick={() => setShowClearModal(true)}
                className="w-full text-[12px] tracking-[0.18em] uppercase text-(--sienna) border border-(--sienna) px-6 py-3 rounded transition-colors duration-200 hover:bg-(--sienna) hover:text-(--cream)"
              >
                {t("clearCart")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-(--cream) border border-(--mist) rounded-lg p-8 max-w-sm mx-4 shadow-lg">
            <h3 className="font-family-playfair text-[24px] font-bold text-(--ink) mb-3">
              {t("clearModalTitle")}
            </h3>
            <p className="text-[14px] text-(--ink) mb-8 leading-relaxed">
              {t("clearModalBody")}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 text-[12px] tracking-[0.18em] uppercase text-(--ink) border border-(--ink) px-4 py-3 rounded transition-colors duration-200 hover:bg-(--ink) hover:text-(--cream)"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 text-[12px] tracking-[0.18em] uppercase text-(--cream) bg-(--sienna) px-4 py-3 rounded transition-colors duration-200 hover:bg-(--thread)"
              >
                {t("clearCart")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function CartItem({
  id,
  name,
  price,
  quantity,
  imageUrl,
  size,
  color,
  variantId,
}: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string;
  color: string;
  variantId: string;
}) {
  const t = useTranslations("CartPage");
  const removeFromCart = useDeleteCartItem();
  const changeQuantity = useChangeQuantity();

  const handleDelete = () => {
    removeFromCart(variantId);
  };

  const handleIncrement = async () => {
    await changeQuantity(variantId, quantity + 1);
  };

  const handleDecrement = async () => {
    if (quantity > 1) {
      await changeQuantity(variantId, quantity - 1);
    } else {
      handleDelete();
    }
  };

  return (
    <div className="border border-(--mist) bg-white rounded-lg p-6 flex gap-6">
      {/* Image */}
      <div className="w-24 h-24 shrink-0 bg-[#ebe5dc] rounded-lg overflow-hidden border border-(--mist)">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-(--mist)">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-family-playfair text-[18px] font-bold text-(--ink) mb-2">
          {name}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#74685e] mb-4">
          {size ? (
            <span className="inline-flex items-center gap-2 border border-(--mist) rounded-full px-3 py-1 bg-[#fbf7f1]">
              <span className="text-[10px] tracking-[0.3em] uppercase text-(--sienna)">
                {t("size")}
              </span>
              <span className="font-semibold text-(--ink)">{size}</span>
            </span>
          ) : null}
          {color ? (
            <span className="inline-flex items-center gap-2 border border-(--mist) rounded-full px-3 py-1 bg-[#fbf7f1]">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] tracking-[0.3em] uppercase text-(--sienna)">
                {t("color")}
              </span>
              <span className="font-semibold text-(--ink)">{color}</span>
            </span>
          ) : null}
        </div>
        <p className="text-[14px] tracking-[0.15em] text-(--sienna) uppercase mb-4">
          {t("priceEach", { price: price.toLocaleString() })}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center border border-(--mist) rounded text-(--ink) hover:bg-(--mist) transition-colors duration-200 text-[14px] font-bold"
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-[14px] font-bold text-(--ink)">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center border border-(--mist) rounded text-(--ink) hover:bg-(--mist) transition-colors duration-200 text-[14px] font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Price and Actions */}
      <div className="flex flex-col items-end gap-4 min-w-fit">
        <div className="text-right">
          <p className="text-[12px] tracking-widest text-(--sienna) uppercase mb-1">
            {t("total")}
          </p>
          <p className="font-mono text-[18px] font-bold text-(--ink)">
            {(price * quantity).toLocaleString()} {t("currency")}
          </p>
        </div>

        <button
          onClick={() => handleDelete()}
          className="text-[11px] tracking-[0.15em] uppercase text-(--sienna) border-b border-(--sienna) pb-0.5 transition-colors duration-200 hover:text-(--thread) hover:border-(--thread)"
        >
          {t("remove")}
        </button>
      </div>
    </div>
  );
}
