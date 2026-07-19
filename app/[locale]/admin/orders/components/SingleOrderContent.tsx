import { getOrderById } from "@/lib/queries/ordersQueiry";
import SingleOrderClient from "../[orderId]/SingleOrderClient";

export default async function SingleOrderContent({
  orderId,
}: {
  orderId: string;
}) {
  const order = await getOrderById(orderId);
  console.log("single order", order);
  return <SingleOrderClient order={order} />;
}
