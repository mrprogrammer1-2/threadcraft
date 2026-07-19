import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getOrCreateDbUser } from "@/lib/actions/orderUtils";
import db from "@/db/index";
import { orders, orderItems, productVariants } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get DB user
    const dbUser = await getOrCreateDbUser();

    // Get user's cart (status = 'cart')
    const cartOrder = await db.query.orders.findFirst({
      where: and(eq(orders.userId, dbUser!.id), eq(orders.status, "cart")),
      with: {
        items: {
          with: {
            variant: true,
            product: {
              with: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!cartOrder) {
      return Response.json({ items: [] });
    }

    // Transform DB cart items to Redux format
    const cartItems = cartOrder.items.map((item) => ({
      id: item.product.id,
      variantId: item.variantId,
      name: item.product.name,
      color: item.variant?.color ?? "",
      size: item.variant?.size ?? "",
      price: item.unitPrice,
      quantity: item.quantity,
      imageUrl: item.product.images[0]?.url ?? "",
      customization: item.customization,
      addOn: item.addOn,
    }));

    return Response.json({
      items: cartItems,
      total: cartOrder.totalPrice,
    });
  } catch (error) {
    console.error("Failed to get cart:", error);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
