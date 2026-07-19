"use server";

import db from "@/db";
import {
  orderItems,
  orders,
  productImages,
  products,
  productVariants,
  usersTable,
} from "@/db/schema";
import { eq, count, sql, not, ilike, or, desc, and } from "drizzle-orm";

export const getAllOrders = async (search?: string) => {
  const conditions = [not(eq(orders.status, "cart"))];

  if (search) {
    conditions.push(
      or(
        ilike(usersTable.firstName, `%${search}%`),
        ilike(usersTable.lastName, `%${search}%`),
        sql`${orders.status}::text ILIKE ${`%${search}%`}`,
      )!,
    );
  }

  return await db
    .select({
      id: orders.id,
      userId: orders.userId,
      customerName: sql<string>`
        CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})
      `.as("customerName"),
      status: orders.status,
      totalPrice: sql<number>`
        COALESCE(SUM(${orderItems.unitPrice} * ${orderItems.quantity}), 0)
      `.as("totalPrice"),
      totalItems: sql<number>`
        COALESCE(SUM(${orderItems.quantity}), 0)
      `.as("totalItems"),
      currency: orders.currency,
      createdAt: orders.createdAt,
      // customization: orderItems.customization,
    })
    .from(orders)
    .leftJoin(usersTable, eq(orders.userId, usersTable.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(and(...conditions))
    .groupBy(
      orders.id,
      orders.userId,
      usersTable.firstName,
      usersTable.lastName,
      orders.status,
      orders.currency,
      orders.createdAt,
    )
    .orderBy(
      sql`CASE WHEN ${orders.status} = 'pending' THEN 0 ELSE 1 END`,
      desc(orders.createdAt),
    );
};

export const getUserOrders = async (userId: string, search?: string) => {
  const conditions = [
    eq(orders.userId, userId),
    not(eq(orders.status, "cart")),
  ];

  if (search) {
    conditions.push(
      or(
        ilike(usersTable.firstName, `%${search}%`),
        ilike(usersTable.lastName, `%${search}%`),
        sql`${orders.status}::text ILIKE ${`%${search}%`}`,
      )!,
    );
  }

  return await db
    .select({
      id: orders.id,
      userId: orders.userId,
      customerName: sql<string>`
        CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})
      `.as("customerName"),
      status: orders.status,
      totalPrice: sql<number>`
        COALESCE(SUM(${orderItems.unitPrice} * ${orderItems.quantity}), 0)
      `.as("totalPrice"),
      totalItems: sql<number>`
        COALESCE(SUM(${orderItems.quantity}), 0)
      `.as("totalItems"),
      currency: orders.currency,
      createdAt: orders.createdAt,
      customization: orderItems.customization,
    })
    .from(orders)
    .leftJoin(usersTable, eq(orders.userId, usersTable.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(and(...conditions))
    .groupBy(
      orders.id,
      orders.userId,
      usersTable.firstName,
      usersTable.lastName,
      orders.status,
      orders.currency,
      orders.createdAt,
    );
};

export const getOrderById = async (orderId: string) => {
  const order = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      status: orders.status,
      currency: orders.currency,
      createdAt: orders.createdAt,
      customerName: sql<string>`
        CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})
      `.as("customerName"),
      customerEmail: usersTable.email,
      customization: orderItems.customization,
    })
    .from(orders)
    .leftJoin(usersTable, eq(orders.userId, usersTable.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(eq(orders.id, orderId));

  if (!order[0]) return null;

  const items = await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      variantId: orderItems.variantId,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      productName: products.name,
      customization: orderItems.customization as any,
      variantColor: productVariants.color,
      variantSize: productVariants.size,
      addOn: orderItems.addOn as any,
      imageUrl: sql<string>`
        COALESCE(
          (SELECT url FROM ${productImages} 
           WHERE ${productImages.productId} = ${products.id} 
           AND ${productImages.color} = ${productVariants.color} 
           ORDER BY ${productImages.position} LIMIT 1),
          (SELECT url FROM ${productImages} 
           WHERE ${productImages.productId} = ${products.id} 
           ORDER BY ${productImages.position} LIMIT 1)
        )
      `.as("imageUrl"),
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
    .where(eq(orderItems.orderId, orderId));

  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return { ...order[0], items, totalPrice };
};

export const userTotalSpent = async (userId: string) => {
  const total = await db
    .select({
      total: sql<number>`
        COALESCE(SUM(${orderItems.unitPrice} * ${orderItems.quantity}), 0)
      `.as("total"),
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(and(eq(orders.userId, userId), eq(orders.status, "delivered")))
    .groupBy(orders.userId);

  return total[0]?.total || 0;
};

export const userTotalOrders = async (userId: string) => {
  const totalOrders = await db
    .select({
      total: sql<number>`COUNT(DISTINCT ${orders.id})`.as("total"),
    })
    .from(orders)
    .where(and(eq(orders.userId, userId), not(eq(orders.status, "cart"))));

  return totalOrders[0].total;
};

export const userTotalPendingOrders = async (userId: string) => {
  const totalOrders = await db
    .select({
      total: sql<number>`COUNT(DISTINCT ${orders.id})`.as("total"),
    })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, "pending")));

  return totalOrders[0].total;
};

export const userTotalCancelledOrders = async (userId: string) => {
  const totalOrders = await db
    .select({
      total: sql<number>`COUNT(DISTINCT ${orders.id})`.as("total"),
    })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, "cancelled")));

  return totalOrders[0].total;
};

export const userRecentOrders = async (userId: string) => {
  const recentOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      createdAt: orders.createdAt,
      totalPrice: sql<number>`
        COALESCE(SUM(${orderItems.unitPrice} * ${orderItems.quantity}), 0)
      `.as("totalPrice"),
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(and(eq(orders.userId, userId), eq(orders.status, "delivered")))
    .groupBy(orders.id, orders.status, orders.createdAt)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  return recentOrders;
};

export const getOrders = async (userId: string) => {
  return await db
    .select({
      id: orders.id,
      status: orders.status,
      currency: orders.currency,
      createdAt: orders.createdAt,
      totalPrice: sql<number>`
        COALESCE(SUM(${orderItems.unitPrice} * ${orderItems.quantity}), 0)
      `.as("totalPrice"),
      totalItems: sql<number>`
        COALESCE(SUM(${orderItems.quantity}), 0)
      `.as("totalItems"),
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(and(eq(orders.userId, userId), not(eq(orders.status, "cart"))))
    .groupBy(orders.id, orders.status, orders.currency, orders.createdAt)
    .orderBy(desc(orders.createdAt))
    .limit(10);
};

export async function getPendingOrdersCount() {
  const [result] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, "pending"));

  return result.count;
}

export async function getCompletedOrdersCount() {
  const [result] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, "delivered"));

  return result.count;
}
