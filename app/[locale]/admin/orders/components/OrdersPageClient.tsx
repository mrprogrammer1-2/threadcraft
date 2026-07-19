"use client";
import OrdersTable from "./OrdersTable";

type Order = {
  id: string;
  userId: string;
  customerName: string;
  status:
    | "cart"
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  totalPrice: number;
  totalItems: number;
  currency: string;
  createdAt: Date;
};

export default function OrdersPageClient({ orders }: { orders: Order[] }) {
  return <OrdersTable data={orders} />;
}
