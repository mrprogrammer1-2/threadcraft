import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { randomUUID } from "crypto";
import db from "@/db";
import { eq, and, sql } from "drizzle-orm";
import {
  usersTable,
  orders,
  orderItems,
  products,
  productImages,
  productVariants,
} from "@/db/schema";

export async function getOrCreateDbUser() {
  const session = getKindeServerSession();
  const { getUser } = session;
  const user = await getUser();

  if (!user?.id) {
    return null;
  }

  let [dbUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.kindeId, user.id))
    .limit(1);

  if (!dbUser) {
    [dbUser] = await db
      .insert(usersTable)
      .values({
        id: randomUUID(),
        kindeId: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
        avatar: user.picture ?? null,
      })
      .returning();
  } else if (!dbUser.avatar && user.picture) {
    const [updatedUser] = await db
      .update(usersTable)
      .set({ avatar: user.picture })
      .where(eq(usersTable.kindeId, user.id))
      .returning();

    dbUser = updatedUser;
  }

  return dbUser;
}

export async function getUserCart() {
  const dbUser = await getOrCreateDbUser();

  if (!dbUser) {
    return [];
  }

  const [cart] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, dbUser.id), eq(orders.status, "cart")))
    .limit(1);

  if (!cart) return [];
  const items = await db
    .select({
      orderItemId: orderItems.id,
      productId: orderItems.productId,
      variantId: orderItems.variantId,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      customization: orderItems.customization,
      productName: products.name,
      image: sql<string>`
        COALESCE(
          (SELECT url FROM ${productImages}
          WHERE ${productImages.productId} = ${products.id}
          AND ${productImages.color} = ${orderItems.variantId}
          ORDER BY ${productImages.position} LIMIT 1),
          SELECT url FROM ${productImages}
          WHERE ${productImages.productId} = ${products.id}
          ORDER BY ${productImages.position} LIMIT 1)
        `.as("image"),
      color: productVariants.color,
      size: productVariants.size,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
    .where(eq(orderItems.orderId, cart.id));

  return items;
}
