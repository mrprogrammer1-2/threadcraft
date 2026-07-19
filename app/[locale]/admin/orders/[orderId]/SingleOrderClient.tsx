"use client";

import { useState } from "react";
import Image from "next/image";
import { updateOrderStatus } from "@/lib/actions/updateOrderStatus";
import OrderModal from "./OrderModal";
import AddOnModal from "./AddOnModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type TextDetail = {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fill: string;
};

type ViewCustomization = {
  imageUrl: string;
  texts: TextDetail[];
};

type Customization = Record<string, ViewCustomization>;

type AddOn = {
  id: string;
  name: string;
  price: number;
  text?: string;
};

type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  productName: string | null;
  variantColor: string | null;
  variantSize: string | null;
  customization: Customization | null;
  addOn: AddOn[] | null;
  imageUrl: string | null;
};

type Order = {
  id: string;
  userId: string;
  status: string;
  totalPrice: number;
  currency: string;
  createdAt: Date | string;
  customerName: string | null;
  customerEmail: string | null;
  items: OrderItem[];
} | null;

const statusConfig: Record<string, { classes: string; dot: string }> = {
  pending: {
    classes: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    dot: "bg-amber-400",
  },
  processing: {
    classes: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    dot: "bg-sky-400",
  },
  shipped: {
    classes: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    dot: "bg-violet-400",
  },
  delivered: {
    classes: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
  cancelled: {
    classes: "text-[#8b4040] border-[#8b4040]/30 bg-[#8b4040]/10",
    dot: "bg-[#8b4040]",
  },
};

function formatCurrency(
  amount: number,
  currency: string,
  egpLabel: string,
  locale: string,
) {
  if (currency === "EGP") return `${amount.toFixed(0)} ${egpLabel}`;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount,
  );
}

function formatDate(date: Date | string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4 py-2.5">
      <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
        {label}
      </span>
      <span
        className={`text-sm text-cream truncate ${mono ? "font-mono text-[11px] text-dim" : ""}`}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  );
}

export default function SingleOrderClient({ order }: { order: Order }) {
  const t = useTranslations("AdminSingleOrderPage");
  const tStatus = useTranslations("AdminOrdersColumns");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[] | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "pending",
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (
    newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  ) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleItemExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) newExpanded.delete(itemId);
    else newExpanded.add(itemId);
    setExpandedItems(newExpanded);
  };

  const calculatePriceBreakdown = (item: OrderItem) => {
    let customizationPrice = 0;
    let addOnPrice = 0;
    if (item.customization)
      customizationPrice = Object.keys(item.customization).length * 100;
    if (item.addOn && Array.isArray(item.addOn))
      addOnPrice = item.addOn.reduce((sum, addon) => sum + addon.price, 0);
    return {
      basePrice: item.unitPrice - customizationPrice - addOnPrice,
      customizationPrice,
      addOnPrice,
      total: item.unitPrice,
    };
  };

  if (!order) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-3"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <span className="text-5xl">📦</span>
        <p className="text-[11px] tracking-[0.3em] uppercase text-muted">
          {t("orderNotFound")}
        </p>
      </div>
    );
  }

  const status = statusConfig[currentStatus?.toLowerCase()] ?? {
    classes: "text-muted border-border bg-raised/40",
    dot: "bg-muted",
  };
  const statusLabel = statusConfig[currentStatus?.toLowerCase()]
    ? tStatus(`statuses.${currentStatus.toLowerCase()}` as any)
    : currentStatus;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const currencyLabel = t("currency");

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-5" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-sienna mb-1">
              {t("orderReceipt")}
            </p>
            <h1
              className="text-3xl font-bold tracking-tight text-cream font-mono"
              dir="ltr"
            >
              #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-[11px] text-muted mt-1.5 font-mono" dir="ltr">
              {formatDate(order.createdAt, locale)}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`inline-flex items-center gap-2 px-4 py-2 border text-[10px] tracking-[0.2em] uppercase font-medium transition-colors disabled:opacity-50 ${status.classes}`}
                disabled={isUpdating}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {statusLabel}
                <ChevronDown className="w-3 h-3 ml-1 rtl:ml-0 rtl:mr-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isRTL ? "start" : "end"}
              className="bg-surface border-border"
            >
              {(
                [
                  "pending",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ] as const
              ).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={currentStatus === s || isUpdating}
                  className="text-dim hover:text-cream text-xs"
                >
                  {tStatus(`statuses.${s}` as any)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-border bg-surface p-5">
            <p className="text-[9px] tracking-[0.25em] uppercase text-sienna mb-3">
              {t("customer")}
            </p>
            <div className="divide-y divide-border">
              <InfoRow
                label={t("name")}
                value={order.customerName || t("notAvailable")}
              />
              <InfoRow
                label={t("email")}
                value={order.customerEmail || t("notAvailable")}
              />
              <InfoRow
                label={t("userId")}
                value={order.userId.slice(0, 14)}
                mono
              />
            </div>
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-[9px] tracking-[0.25em] uppercase text-sienna mb-3">
              {t("payment")}
            </p>
            <div className="divide-y divide-border">
              <InfoRow
                label={t("subtotal")}
                value={formatCurrency(
                  subtotal,
                  order.currency,
                  currencyLabel,
                  locale,
                )}
              />
              <InfoRow label={t("currencyLabel")} value={order.currency} mono />
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
                {t("total")}
              </span>
              <span className="text-xl font-bold text-gold font-mono" dir="ltr">
                {formatCurrency(
                  order.totalPrice,
                  order.currency,
                  currencyLabel,
                  locale,
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border border-border bg-surface">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
              {t("items", { count: order.items.length })}
            </p>
          </div>

          <div className="divide-y divide-border">
            {order.items.map((item) => {
              const isExpanded = expandedItems.has(item.id);
              const breakdown = calculatePriceBreakdown(item);

              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleItemExpanded(item.id)}
                    className={`w-full p-4 hover:bg-raised/40 transition-colors ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <div className="flex items-start gap-4">
                      {item.imageUrl && (
                        <div className="relative w-12 h-12 overflow-hidden border border-border flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt="product"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-cream">
                          {item.productName || t("unknownProduct")}
                        </p>
                        <p
                          className="font-mono text-[10px] text-muted mt-0.5"
                          dir="ltr"
                        >
                          {item.productId.slice(0, 8)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={isRTL ? "text-left" : "text-right"}>
                          <p className="text-[10px] text-muted">
                            {t("qty", { count: item.quantity })}
                          </p>
                          <p className="text-sm text-gold font-mono" dir="ltr">
                            {formatCurrency(
                              item.unitPrice * item.quantity,
                              order.currency,
                              currencyLabel,
                              locale,
                            )}
                          </p>
                        </div>
                        {isRTL ? (
                          <ChevronLeft
                            className={`w-4 h-4 text-muted transition-transform ${isExpanded ? "-rotate-90" : ""}`}
                          />
                        ) : (
                          <ChevronRight
                            className={`w-4 h-4 text-muted transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          />
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border p-4 bg-raised/20 space-y-4">
                      {/* Variant */}
                      {(item.variantColor || item.variantSize) && (
                        <div>
                          <p className="text-[9px] tracking-[0.2em] uppercase text-muted mb-2">
                            {t("variant")}
                          </p>
                          <span className="text-[10px] tracking-wider border border-border px-2 py-0.5 text-dim">
                            {item.variantColor}
                            {item.variantColor && item.variantSize && " · "}
                            {item.variantSize}
                          </span>
                        </div>
                      )}

                      {/* Price Breakdown */}
                      <div className="border border-border p-3 space-y-1.5">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-muted mb-2">
                          {t("priceBreakdown")}
                        </p>
                        <div
                          className="space-y-1.5 text-[11px] font-mono"
                          dir="ltr"
                        >
                          <div className="flex justify-between text-dim">
                            <span>{t("basePrice")}</span>
                            <span>
                              {formatCurrency(
                                breakdown.basePrice,
                                order.currency,
                                currencyLabel,
                                locale,
                              )}
                            </span>
                          </div>
                          {breakdown.customizationPrice > 0 && (
                            <div className="flex justify-between text-dim">
                              <span>{t("customizationLine")}</span>
                              <span>
                                +
                                {formatCurrency(
                                  breakdown.customizationPrice,
                                  order.currency,
                                  currencyLabel,
                                  locale,
                                )}
                              </span>
                            </div>
                          )}
                          {breakdown.addOnPrice > 0 && (
                            <div className="flex justify-between text-dim">
                              <span>{t("addOnsLine")}</span>
                              <span>
                                +
                                {formatCurrency(
                                  breakdown.addOnPrice,
                                  order.currency,
                                  currencyLabel,
                                  locale,
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-cream border-t border-border pt-1.5 font-semibold">
                            <span>{t("unitPrice")}</span>
                            <span>
                              {formatCurrency(
                                item.unitPrice,
                                order.currency,
                                currencyLabel,
                                locale,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {item.customization && (
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border border-sienna/40 text-sienna hover:bg-sienna/10 transition-colors"
                          >
                            {t("viewDesign")}
                          </button>
                        )}
                        {item.addOn && item.addOn.length > 0 && (
                          <button
                            onClick={() => setSelectedAddOns(item.addOn)}
                            className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border border-border text-dim hover:text-cream hover:border-sienna/40 transition-colors"
                          >
                            {t("viewAddOns")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedItem && (
        <OrderModal
          onClose={() => setSelectedItem(null)}
          selectedItem={selectedItem}
        />
      )}
      {selectedAddOns && (
        <AddOnModal
          addOns={selectedAddOns}
          onClose={() => setSelectedAddOns(null)}
        />
      )}
    </>
  );
}
