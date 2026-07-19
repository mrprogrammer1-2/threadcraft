import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/actions/orderUtils";
import { and, eq, sql } from "drizzle-orm";
import db from "@/db";
import { orderItems, orders } from "@/db/schema";

export async function PATCH(request: Request) {
  try {
    const dbUser = await getOrCreateDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, variantId, quantity } = body;

    if ((!itemId && !variantId) || quantity === undefined) {
      return NextResponse.json(
        { error: "Missing itemId/variantId or quantity" },
        { status: 400 },
      );
    }

    // Find the cart
    const [cartOrder] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.userId, dbUser.id), eq(orders.status, "cart")))
      .limit(1);

    if (!cartOrder) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find the item
    let itemQuery;
    if (itemId) {
      itemQuery = await db
        .select()
        .from(orderItems)
        .where(
          and(eq(orderItems.id, itemId), eq(orderItems.orderId, cartOrder.id)),
        )
        .limit(1);
    } else {
      itemQuery = await db
        .select()
        .from(orderItems)
        .where(
          and(
            eq(orderItems.variantId, variantId),
            eq(orderItems.orderId, cartOrder.id),
          ),
        )
        .limit(1);
    }

    const [item] = itemQuery;
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Delete if quantity <= 0, otherwise update
    if (quantity <= 0) {
      await db.delete(orderItems).where(eq(orderItems.id, item.id));
    } else {
      await db
        .update(orderItems)
        .set({ quantity })
        .where(eq(orderItems.id, item.id));
    }

    // Recalculate total
    const totalResult = await db
      .select({
        total: sql`COALESCE(SUM(${orderItems.unitPrice} * ${orderItems.quantity}), 0)`,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, cartOrder.id));

    const totalPrice = Number(totalResult[0]?.total ?? 0);
    await db
      .update(orders)
      .set({ totalPrice })
      .where(eq(orders.id, cartOrder.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update cart error", error);
    return NextResponse.json(
      { error: "Unable to update cart" },
      { status: 500 },
    );
  }
}
