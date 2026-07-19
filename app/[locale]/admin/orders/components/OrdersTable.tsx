"use client";

import { useTranslations } from "next-intl";
import { getColumns } from "./Columns";
import { DataTable } from "./Data-table";

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
  totalItems: number;
  customerName: string;
  currency: string;
  createdAt: Date;
};

export default function OrdersTable({ data }: { data: Order[] }) {
  const t = useTranslations("AdminOrdersColumns");
  const columns = getColumns(t);

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
