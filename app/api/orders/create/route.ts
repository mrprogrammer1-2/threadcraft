import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { randomUUID } from "crypto";
import db from "@/db";
import { and, eq, sql } from "drizzle-orm";
import { orderItems, orders, usersTable } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const session = getKindeServerSession();
    const { getUser } = session;
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const items = Array.isArray(body?.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No order items provided" },
        { status: 400 },
      );
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
        })
        .returning();
    }

    let [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.userId, dbUser.id), eq(orders.status, "cart")))
      .limit(1);

    if (!order) {
      [order] = await db
        .insert(orders)
        .values({
          id: randomUUID(),
          userId: dbUser.id,
          status: "cart",
          currency: "EGP",
          totalPrice: 0,
        })
        .returning();
    }

    for (const item of items) {
      const quantity = Math.max(1, item.quantity ?? 1);
      const hasCustomization = Boolean(
        item.customization && Object.keys(item.customization).length,
      );
      const hasAddOn = Boolean(item.addOn && Object.keys(item.addOn).length);

      if (hasCustomization || hasAddOn) {
        await db.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity,
          unitPrice: item.unitPrice,
          customization: item.customization ?? null,
          addOn: item.addOn ?? null,
        });
        continue;
      }

      const [existingItem] = await db
        .select()
        .from(orderItems)
        .where(
          and(
            eq(orderItems.orderId, order.id),
            eq(orderItems.variantId, item.variantId ?? null),
          ),
        )
        .limit(1);

      if (existingItem) {
        await db
          .update(orderItems)
          .set({ quantity: sql`${orderItems.quantity} + ${quantity}` })
          .where(eq(orderItems.id, existingItem.id));
      } else {
        await db.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity,
          unitPrice: item.unitPrice,
          customization: null,
          addOn: null,
        });
      }
    }

    const totalResult = await db
      .select({
        total: sql`COALESCE(SUM(${orderItems.unitPrice} * ${orderItems.quantity}), 0)`,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const totalPrice = Number(totalResult[0]?.total ?? 0);

    await db.update(orders).set({ totalPrice }).where(eq(orders.id, order.id));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalPrice,
    });
  } catch (error) {
    console.error("Order API error", error);
    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 },
    );
  }
}
