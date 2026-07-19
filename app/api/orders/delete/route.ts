import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/actions/orderUtils";
import { and, eq, sql } from "drizzle-orm";
import db from "@/db";
import { orderItems, orders } from "@/db/schema";

export async function DELETE(request: Request) {
  try {
    const dbUser = await getOrCreateDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, variantId, clearAll } = body; // clearAll = true to clear entire cart

    if (!itemId && !variantId && !clearAll) {
      return NextResponse.json(
        { error: "Missing itemId or clearAll flag" },
        { status: 400 },
      );
    }

    const [cartOrder] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.userId, dbUser.id), eq(orders.status, "cart")))
      .limit(1);

    if (!cartOrder) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (clearAll) {
      // Delete all items in cart
      await db.delete(orderItems).where(eq(orderItems.orderId, cartOrder.id));

      // Reset order total
      await db
        .update(orders)
        .set({ totalPrice: 0 })
        .where(eq(orders.id, cartOrder.id));
    } else {
      // Delete single item by itemId or variantId
      if (itemId) {
        await db
          .delete(orderItems)
          .where(
            and(
              eq(orderItems.id, itemId),
              eq(orderItems.orderId, cartOrder.id),
            ),
          );
      } else if (variantId) {
        await db
          .delete(orderItems)
          .where(
            and(
              eq(orderItems.variantId, variantId),
              eq(orderItems.orderId, cartOrder.id),
            ),
          );
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
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete cart error", error);
    return NextResponse.json(
      { error: "Unable to delete from cart" },
      { status: 500 },
    );
  }
}

// Support POST from client hooks that currently send POST
export async function POST(request: Request) {
  return DELETE(request as any);
}
