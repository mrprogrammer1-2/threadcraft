"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateUserActiveStatus } from "@/lib/actions/userActions";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type User = {
  id: string;
  kindeId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  avatar: string | null;
  phone: string | null;
  active: boolean;
  createdAt: Date;
};

type Props = {
  user: User;
  totalSpent: number;
  totalOrders: number;
  totalPendingOrders: number;
  totalCancelledOrders: number;
  recentOrders: {
    id: string;
    status:
      | "cart"
      | "pending"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled";
    totalPrice: number;
    createdAt: Date;
  }[];
};

const statusColors: Record<string, string> = {
  pending: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  processing: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  shipped: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  delivered: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  cancelled: "text-[#8b4040] border-[#8b4040]/30 bg-[#8b4040]/10",
  cart: "text-muted border-border bg-raised/40",
};

const SingleUserClient = ({
  user,
  totalSpent,
  totalOrders,
  recentOrders,
  totalPendingOrders,
  totalCancelledOrders,
}: Props) => {
  const router = useRouter();
  const t = useTranslations("AdminSingleUserPage");
  const tStatus = useTranslations("AdminOrdersColumns");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [isUpdating, setIsUpdating] = useState(false);
  const [userActive, setUserActive] = useState(user.active);

  const handleToggleActive = async () => {
    setIsUpdating(true);
    try {
      await updateUserActiveStatus(user.id, !userActive);
      setUserActive(!userActive);
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const stats = [
    { label: t("statsTotalOrders"), value: totalOrders },
    { label: t("statsPending"), value: totalPendingOrders },
    { label: t("statsCancelled"), value: totalCancelledOrders },
    {
      label: t("statsTotalSpent"),
      value: `${totalSpent.toLocaleString()} ${t("currency")}`,
    },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="border border-border bg-surface p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-12 border border-border">
            <AvatarImage
              src={user.avatar || undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-raised text-muted text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold text-cream tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-[11px] text-muted font-mono" dir="ltr">
              {user.email}
            </p>
          </div>
          <span
            className={`mx-2 text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 border font-medium ${
              userActive
                ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                : "text-[#8b4040] border-[#8b4040]/30 bg-[#8b4040]/10"
            }`}
          >
            {userActive ? t("active") : t("inactive")}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToggleActive}
            disabled={isUpdating}
            className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors disabled:opacity-50 ${
              userActive
                ? "border-[#8b4040]/50 text-[#8b4040] hover:bg-[#8b4040]/10"
                : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            }`}
          >
            {isUpdating
              ? t("updating")
              : userActive
                ? t("deactivate")
                : t("activate")}
          </button>
          <button
            onClick={() => router.push(`/admin/orders?userId=${user.id}`)}
            className="text-[10px] tracking-[0.2em] uppercase px-4 py-2 border border-border text-dim hover:text-cream hover:border-sienna/50 transition-colors"
          >
            {t("viewOrders")}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="border border-border bg-surface p-5">
            <p className="text-[9px] tracking-[0.25em] uppercase text-muted mb-2">
              {s.label}
            </p>
            <p className="text-2xl font-bold font-mono text-cream" dir="ltr">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* User Info */}
      <div className="border border-border bg-surface">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
            {t("userInfoTitle")}
          </p>
        </div>
        <div className="divide-y divide-border">
          {[
            {
              label: t("fullName"),
              value: `${user.firstName} ${user.lastName}`,
            },
            { label: t("phone"), value: user.phone ?? t("notAvailable") },
            {
              label: t("joined"),
              value: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString(locale)
                : t("notAvailable"),
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between items-center px-5 py-3"
            >
              <span className="text-[11px] tracking-wider text-muted uppercase">
                {row.label}
              </span>
              <span className="text-sm text-cream font-mono">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border border-border bg-surface">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
            {t("recentOrdersTitle")}
          </p>
          <button
            onClick={() => router.push(`/admin/orders?userId=${user.id}`)}
            className="flex items-center gap-1 text-[9px] tracking-[0.15em] uppercase text-muted hover:text-cream transition-colors"
          >
            <span>{t("viewAll")}</span>
            {isRTL ? (
              <ArrowLeft className="h-3 w-3" />
            ) : (
              <ArrowRight className="h-3 w-3" />
            )}
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-5 py-6 text-center text-[11px] text-muted">
            {t("noOrders")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead
                  className={`text-[9px] tracking-[0.2em] uppercase text-muted font-normal bg-raised/40 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("orderId")}
                </TableHead>
                <TableHead
                  className={`text-[9px] tracking-[0.2em] uppercase text-muted font-normal bg-raised/40 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("date")}
                </TableHead>
                <TableHead
                  className={`text-[9px] tracking-[0.2em] uppercase text-muted font-normal bg-raised/40 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("status")}
                </TableHead>
                <TableHead
                  className={`text-[9px] tracking-[0.2em] uppercase text-muted font-normal bg-raised/40 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("total")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-border hover:bg-raised/40 transition-colors"
                >
                  <TableCell
                    className="font-mono text-[11px] text-dim"
                    dir="ltr"
                  >
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-[11px] text-muted">
                    {new Date(order.createdAt).toLocaleDateString(locale)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border font-medium ${
                        statusColors[order.status] ?? statusColors.cart
                      }`}
                    >
                      {tStatus(`statuses.${order.status}` as any)}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-[11px] text-gold font-mono"
                    dir="ltr"
                  >
                    {Number(order.totalPrice)?.toFixed(0)} {t("currency")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default SingleUserClient;
