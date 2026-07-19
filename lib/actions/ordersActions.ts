"use server";

import db from "@/db";
import { eq, inArray, sql } from "drizzle-orm";
import { orderItems, orders } from "@/db/schema";

type OrderItemPayload = {
  productId: string;
  variantId?: string | null;
  quantity?: number;
  unitPrice: number;
  customization?: Record<string, unknown> | null;
  addOn?: Record<string, unknown> | null;
};

type CreateOrderPayload = {
  userId: string;
  currency?: string;
  items: OrderItemPayload[];
};

export const createOrder = async ({
  userId,
  currency = "EGP",
  items,
}: CreateOrderPayload) => {
  if (!userId) {
    throw new Error("Missing userId");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  const [order] = await db
    .insert(orders)
    .values({
      userId,
      currency,
      status: "pending",
    })
    .returning();

  const orderItemsToInsert = items.map((item) => ({
    orderId: order.id,
    productId: item.productId,
    variantId: item.variantId ?? null,
    quantity: Math.max(1, item.quantity ?? 1),
    unitPrice: item.unitPrice,
    customization: item.customization ?? null,
    addOn: item.addOn ?? null,
  }));

  await db.insert(orderItems).values(orderItemsToInsert);

  const totalResult = await db
    .select({
      total: sql`COALESCE(SUM(${orderItems.unitPrice} * ${orderItems.quantity}), 0)`,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const totalPrice = Number(totalResult[0]?.total ?? 0);

  await db.update(orders).set({ totalPrice }).where(eq(orders.id, order.id));

  return {
    success: true,
    orderId: order.id,
    totalPrice,
  };
};

export const deleteOrders = async (orderIds: string[]) => {
  if (orderIds.length === 0) return;

  await db.delete(orderItems).where(inArray(orderItems.orderId, orderIds));
  await db.delete(orders).where(inArray(orders.id, orderIds));
};
