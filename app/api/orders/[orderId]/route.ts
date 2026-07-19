import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getOrCreateDbUser } from "@/lib/actions/orderUtils";
import { NextResponse } from "next/server";
import db from "@/db/index";
import {
  orders,
  orderItems,
  products,
  productImages,
  productVariants,
  usersTable,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const { params } = await context;
    const orderId = (await params).orderId;

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getOrCreateDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [order] = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        status: orders.status,
        currency: orders.currency,
        createdAt: orders.createdAt,
        customerName: sql<string>`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
        customerEmail: usersTable.email,
      })
      .from(orders)
      .leftJoin(usersTable, eq(orders.userId, usersTable.id))
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== dbUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        variantId: orderItems.variantId,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        productName: products.name,
        customization: orderItems.customization,
        variantColor: productVariants.color,
        variantSize: productVariants.size,
        addOn: orderItems.addOn,
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

    return NextResponse.json({ order: { ...order, items, totalPrice } });
  } catch (error) {
    console.error("Failed to load order details:", error);
    return NextResponse.json(
      { error: "Failed to load order details" },
      { status: 500 },
    );
  }
}
