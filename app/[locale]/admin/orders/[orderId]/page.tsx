import { getOrderById } from "@/lib/queries/ordersQueiry";
import SingleOrderClient from "./SingleOrderClient";
import { Suspense } from "react";
import OrderDetailSkeleton from "@/components/skeletons/OrderDetailSkeleton";
import SingleOrderContent from "../components/SingleOrderContent";

export default async function page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <SingleOrderContent orderId={orderId} />
    </Suspense>
  );
}
