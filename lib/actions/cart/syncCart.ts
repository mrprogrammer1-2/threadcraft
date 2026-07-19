"use server";

import db from "@/db";
import { getOrCreateDbUser } from "../orderUtils";
import { orders, orderItems } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

type GuestCartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
};

export async function syncCart(items: GuestCartItem[]) {
  if (!items.length) return;

  const user = await getOrCreateDbUser();
  if (!user) throw new Error("User not found");

  // Get or create the cart order
  let [cart] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, user.id), eq(orders.status, "cart")))
    .limit(1);

  if (!cart) {
    [cart] = await db
      .insert(orders)
      .values({ userId: user.id, status: "cart" })
      .returning();
  }

  await db
    .insert(orderItems)
    .values(
      items.map((item) => ({
        orderId: cart.id,
        productId: item.productId,
        variantId: item.variantId ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    )
    .onConflictDoUpdate({
      target: [orderItems.orderId, orderItems.productId, orderItems.variantId],
      set: {
        quantity: sql`${orderItems.quantity} + excluded.quantity`,
        unitPrice: sql`excluded.unit_price`,
      },
    });
}
