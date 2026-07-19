"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { deleteOrders } from "@/lib/actions/ordersActions";
import { ConfirmDeleteModal } from "@/app/[locale]/admin/_components/ConfirmDeleteModal";

type Order = {
  id: string;
  userId: string;
  status:
    | "cart"
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  totalPrice: number;
  currency: string;
  createdAt: Date;
};

interface ActionsCellProps {
  order: Order;
}

export default function ActionsCell({ order }: ActionsCellProps) {
  const router = useRouter();
  const t = useTranslations("AdminOrdersColumns");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteOrders([order.id]);
      setShowConfirmModal(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full p-0 transition duration-200 hover:bg-white/10 hover:text-cream focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.98]"
        >
          <span className="sr-only">{t("openMenu")}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(order.id)}
        >
          {t("copyOrderId")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/admin/orders/${order.id}`)}
        >
          {t("viewOrder")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/users/${order.userId}`)}
        >
          {t("viewUser")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setShowConfirmModal(true)}
          className="text-red-600"
        >
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
      <ConfirmDeleteModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemCount={1}
      />
    </DropdownMenu>
  );
}
