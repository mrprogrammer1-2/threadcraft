import type { Metadata } from "next";
import { getOrderById } from "@/lib/queries/ordersQueiry";
import SingleOrderClient from "./SingleOrderClient";
import { Suspense } from "react";
import OrderDetailSkeleton from "@/components/skeletons/OrderDetailSkeleton";
import SingleOrderContent from "../components/SingleOrderContent";

type OrderDetailProps = {
  params: Promise<{ orderId: string }>;
};

export async function generateMetadata({
  params,
}: OrderDetailProps): Promise<Metadata> {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  return {
    title: order ? `Order #${orderId.slice(0, 8)}` : "Order Details",
    description: order
      ? `View order details for order #${orderId.slice(0, 8)} — status, items, and customer information.`
      : "View ThreadCraft order details.",
  };
}

export default async function page({ params }: OrderDetailProps) {
  const { orderId } = await params;

  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <SingleOrderContent orderId={orderId} />
    </Suspense>
  );
}
