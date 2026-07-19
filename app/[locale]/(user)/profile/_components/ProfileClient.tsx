"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { updateUserProfile } from "@/lib/actions/userActions";
import { Spinner } from "@/components/ui/spinner";
import { RenderObject } from "./RenderObject";
import { X, User } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string | null;
  quantity: number;
  unitPrice: number;
  variantColor: string | null;
  variantSize: string | null;
  imageUrl?: string;
  customization?: Record<string, unknown> | null;
  addOn?: Record<string, unknown> | null;
}

interface OrderDetails {
  id: string;
  status: string;
  currency: string;
  createdAt: string | Date;
  totalPrice: number;
  items: OrderItem[];
}

interface Order {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string | Date;
  details?: OrderDetails | null;
}

interface ProfileClientProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    avatar: string | null;
  };
  orders?: Order[];
}

const statusColors: Record<string, string> = {
  pending: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  processing: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  shipped: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  delivered: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  cancelled: "text-[#8b4040] border-[#8b4040]/30 bg-[#8b4040]/10",
};

export default function ProfileClient({
  user,
  orders = [],
}: ProfileClientProps) {
  const t = useTranslations("ProfilePage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
  });

  const statusLabel = (status: string) =>
    t.has(`statuses.${status}`) ? t(`statuses.${status}` as never) : status;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const response = await fetch("/api/upload-design", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        const data = await response.json();
        if (data.success) setAvatar(data.url);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateUserProfile(user.id, { ...formData, avatar });
    if (result.success) {
      setIsEditing(false);
      window.location.reload();
    }
    setIsLoading(false);
  };

  const handleSelectOrder = async (order: Order) => {
    setOrderError(null);

    if (order.details) {
      setSelectedOrder(order.details);
      return;
    }

    setLoadingOrderId(order.id);

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to load order details");
      }

      const data = await response.json();
      if (!data?.order) {
        throw new Error(data?.error || "Order details unavailable");
      }

      setSelectedOrder({
        ...data.order,
        createdAt:
          typeof data.order.createdAt === "string"
            ? data.order.createdAt
            : data.order.createdAt.toString(),
      });
    } catch (error) {
      setOrderError(t("loadOrderError"));
      console.error("Profile order fetch error:", error);
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-ink py-16 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page title */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-sienna mb-1">
            {t("eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold text-cream tracking-tight">
            {t("title")}
          </h1>
        </div>

        {/* Profile Header */}
        <div className="border border-border bg-surface p-6 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 border border-border overflow-hidden">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={t("title")}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-raised flex items-center justify-center">
                  <User className="w-6 h-6 text-muted" />
                </div>
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 bg-sienna text-cream w-6 h-6 flex items-center justify-center text-xs hover:bg-sienna/80 transition-colors"
              >
                {isUploadingAvatar ? <Spinner /> : "📷"}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg text-cream font-semibold tracking-tight">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-[11px] text-muted font-mono truncate">
              {user.email}
            </p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-[10px] tracking-[0.2em] uppercase px-4 py-2 border border-border text-dim hover:text-cream hover:border-sienna/50 transition-colors shrink-0"
            >
              {t("editProfile")}
            </button>
          )}
        </div>

        {/* Account Information */}
        <div className="border border-border bg-surface">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
              {t("accountInformation")}
            </p>
          </div>
          <div className="p-5">
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: t("firstName"), value: user.firstName },
                  { label: t("lastName"), value: user.lastName },
                  { label: t("email"), value: user.email },
                  { label: t("phone"), value: user.phone },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-muted mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-cream font-mono">
                      {value || t("notProvided")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] tracking-[0.2em] uppercase text-muted">
                      {t("firstName")}
                    </Label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-raised border-border text-cream rounded-none focus-visible:ring-0 focus-visible:border-sienna/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] tracking-[0.2em] uppercase text-muted">
                      {t("lastName")}
                    </Label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="bg-raised border-border text-cream rounded-none focus-visible:ring-0 focus-visible:border-sienna/60"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] tracking-[0.2em] uppercase text-muted">
                    {t("email")}
                  </Label>
                  <Input
                    value={user.email || ""}
                    disabled
                    className="bg-raised/40 border-border text-muted rounded-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] tracking-[0.2em] uppercase text-muted">
                    {t("phone")}
                  </Label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-raised border-border text-cream rounded-none focus-visible:ring-0 focus-visible:border-sienna/60"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2 bg-sienna text-cream text-[10px] tracking-[0.2em] uppercase hover:bg-sienna/80 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? <Spinner /> : t("saveChanges")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 border border-border text-dim text-[10px] tracking-[0.2em] uppercase hover:text-cream hover:border-sienna/50 transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="border border-border bg-surface">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
              {t("recentOrders")}
            </p>
          </div>
          <div className="divide-y divide-border">
            {orders.length === 0 ? (
              <p className="px-5 py-8 text-center text-[11px] text-muted">
                {t("noOrders")}
              </p>
            ) : (
              orders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => handleSelectOrder(order)}
                  disabled={loadingOrderId === order.id}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-raised/40 transition-colors text-left disabled:opacity-70"
                >
                  <div>
                    <p className="text-[11px] font-mono text-dim">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString(locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border font-medium ${statusColors[order.status] ?? "text-muted border-border"}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                    {loadingOrderId === order.id ? (
                      <span className="text-[11px] text-muted font-mono">
                        {t("loading")}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gold font-mono">
                        {order.totalPrice} {t("currency")}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
            {orderError && (
              <p className="px-5 py-3 text-[11px] text-rose-400">
                {orderError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border border-border panel-scroll">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border sticky top-0 bg-surface z-10">
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
                  {t("orderModal.title")}
                </p>
                <p className="text-sm text-cream font-mono mt-0.5">
                  #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-muted hover:text-cream transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Order meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: t("orderModal.status"),
                    value: statusLabel(selectedOrder.status),
                  },
                  {
                    label: t("orderModal.date"),
                    value: new Date(selectedOrder.createdAt).toLocaleDateString(
                      locale,
                    ),
                  },
                  {
                    label: t("orderModal.currency"),
                    value: selectedOrder.currency,
                  },
                  {
                    label: t("orderModal.total"),
                    value: `${selectedOrder.totalPrice} ${t("currency")}`,
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-muted mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-cream font-mono capitalize">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className="space-y-3">
                <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
                  {t("orderModal.items")}
                </p>
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border p-4 space-y-3"
                  >
                    <div className="flex gap-4">
                      {item.imageUrl && (
                        <div className="relative w-16 h-16 border border-border shrink-0 overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={
                              item.productName || t("orderModal.unknownProduct")
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-cream">
                            {item.productName || t("orderModal.unknownProduct")}
                          </p>
                          <p className="text-sm text-gold font-mono">
                            {item.unitPrice * item.quantity} {t("currency")}
                          </p>
                        </div>
                        <p className="text-[10px] text-muted mt-1">
                          {t("orderModal.qty")}: {item.quantity} ·{" "}
                          {item.unitPrice} {t("currency")}{" "}
                          {t("orderModal.each")}
                        </p>
                        {(item.variantColor || item.variantSize) && (
                          <span className="inline-block mt-1 text-[9px] tracking-wider border border-border px-2 py-0.5 text-dim">
                            {item.variantColor}
                            {item.variantColor && item.variantSize && " · "}
                            {item.variantSize}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.customization &&
                      Object.keys(item.customization).length > 0 && (
                        <div className="pt-3 border-t border-border">
                          <p className="text-[9px] tracking-[0.2em] uppercase text-muted mb-2">
                            {t("orderModal.customization")}
                          </p>
                          <div className="text-[11px] text-dim bg-raised/40 p-3">
                            <RenderObject data={item.customization} />
                          </div>
                        </div>
                      )}

                    {item.addOn && Object.keys(item.addOn).length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-muted mb-2">
                          {t("orderModal.addOns")}
                        </p>
                        <div className="text-[11px] text-dim bg-raised/40 p-3">
                          <RenderObject data={item.addOn} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 border border-border text-[10px] tracking-[0.3em] uppercase text-dim hover:text-cream hover:border-sienna/50 transition-colors"
              >
                {t("orderModal.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
