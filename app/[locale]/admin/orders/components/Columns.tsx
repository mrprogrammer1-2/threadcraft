"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import type { useTranslations } from "next-intl";
import ActionsCell from "./ActionsCell";

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
  customerName: string;
  currency: string;
  createdAt: Date;
};

type T = ReturnType<typeof useTranslations<"AdminOrdersColumns">>;

const formatEgp = (value: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
  }).format(value);

export function getColumns(t: T): ColumnDef<Order>[] {
  const statusColors: Record<string, string> = {
    cart: "text-muted border-border bg-raised/40",
    pending: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    processing: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    shipped: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    delivered: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    cancelled: "text-[#8b4040] border-[#8b4040]/30 bg-[#8b4040]/10",
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label={t("selectAll")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label={t("selectRow")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("orderId"),
      cell: (info) => {
        const id = info.getValue() as string;
        return <span className="font-mono text-xs">{id.slice(0, 8)}...</span>;
      },
    },
    {
      accessorKey: "userId",
      header: t("userId"),
      cell: (info) => {
        const userId = info.getValue() as string;
        return (
          <span className="font-mono text-xs">{userId.slice(0, 8)}...</span>
        );
      },
    },
    {
      accessorKey: "customerName",
      header: t("customerName"),
      enableSorting: true,
      cell: (info) => {
        const customerName = info.getValue() as string;
        return <span className="capitalize">{customerName}</span>;
      },
    },
    {
      accessorKey: "status",
      header: t("status"),
      enableSorting: true,
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <span
            className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border font-medium ${
              statusColors[status] ?? statusColors.cart
            }`}
          >
            {t(`statuses.${status}` as any)}
          </span>
        );
      },
    },
    {
      accessorKey: "totalItems",
      header: t("items"),
      enableSorting: true,
    },
    {
      accessorKey: "totalPrice",
      header: t("total"),
      enableSorting: true,
      cell: (info) => formatEgp(info.getValue() as number),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
          >
            {t("createdAt")}
            <span className="ml-2">
              {isSorted === "asc" ? (
                <ChevronUp className="h-4 w-4" />
              ) : isSorted === "desc" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4" />
              )}
            </span>
          </Button>
        );
      },
      enableSorting: true,
      sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.getValue<string>(columnId)).getTime();
        const b = new Date(rowB.getValue<string>(columnId)).getTime();
        return a === b ? 0 : a > b ? 1 : -1;
      },
      cell: (info) => {
        const val = info.getValue() as string | undefined;
        if (!val) return t("noDate");
        const date = new Date(val);
        return isNaN(date.getTime())
          ? t("invalidDate")
          : date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("actions")}</span>,
      cell: ({ row }) => {
        const order = row.original;
        return <ActionsCell order={order} />;
      },
    },
  ];
}
