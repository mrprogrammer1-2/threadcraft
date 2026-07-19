"use server";

import db from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
) {
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}
