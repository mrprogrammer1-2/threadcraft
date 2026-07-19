import { getTranslations, getLocale } from "next-intl/server";
import { getAllOrders, getUserOrders } from "@/lib/queries/ordersQueiry";
import { getUserById } from "@/lib/queries/usersQueries";
import OrdersPageClient from "./OrdersPageClient";

export default async function OrdersContent({
  userId,
  search,
}: {
  userId?: string;
  search?: string;
}) {
  const t = await getTranslations("AdminOrdersPage");
  const locale = await getLocale();
  const isRTL = locale === "ar";

  let user;
  let orders;

  if (userId) {
    orders = await getUserOrders(userId, search);
    user = await getUserById(userId);
  } else {
    orders = await getAllOrders(search);
  }

  return (
    <>
      {userId && user && (
        <h1
          className="mt-4 text-[10px] tracking-[0.3em] uppercase text-sienna"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("showingOrdersFor")}
          <span className="mx-2 px-2 py-0.5 border border-sienna/40 text-cream font-mono text-xs">
            {user.firstName} {user.lastName}
          </span>
        </h1>
      )}
      <OrdersPageClient orders={orders} />
    </>
  );
}
