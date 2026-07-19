import { getAllUsers } from "@/lib/queries/usersQueries";
import { getAllProductsWithType } from "@/lib/queries/productsQueriry";
import {
  getPendingOrdersCount,
  getCompletedOrdersCount,
} from "@/lib/queries/ordersQueiry";
import { Users, Package, ShoppingBag, CheckCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";

export default async function Dashboard() {
  const t = await getTranslations("AdminDashboard");
  const locale = await getLocale();
  const isRTL = locale === "ar";

  const allUsers = await getAllUsers();
  const allProducts = await getAllProductsWithType();
  const pendingOrders = await getPendingOrdersCount();
  const completedOrders = await getCompletedOrdersCount();

  const recentUsers = allUsers.slice(0, 5);
  const recentProducts = allProducts.slice(0, 5);

  const stats = [
    {
      label: t("stats.totalUsers"),
      value: allUsers.length,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: t("stats.totalProducts"),
      value: allProducts.length,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: t("stats.pendingOrders"),
      value: pendingOrders,
      icon: ShoppingBag,
      href: "/admin/orders",
      highlight: pendingOrders > 0,
    },
    {
      label: t("stats.completedOrders"),
      value: completedOrders,
      icon: CheckCheck,
      href: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-sienna mb-1">
          {t("eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold text-cream tracking-tight">
          {t("title")}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative border border-border bg-surface p-5 hover:border-sienna/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] tracking-[0.25em] uppercase text-muted">
                {stat.label}
              </span>
              <stat.icon
                className={`h-3.5 w-3.5 ${stat.highlight ? "text-sienna" : "text-muted"}`}
              />
            </div>
            <p
              className={`text-3xl font-bold font-mono ${stat.highlight ? "text-sienna" : "text-cream"}`}
            >
              {stat.value}
            </p>
            <div className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 h-[2px] w-0 group-hover:w-full bg-sienna transition-all duration-300" />
          </Link>
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="border border-border bg-surface">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
              {t("recentUsers")}
            </p>
            <Link
              href="/admin/users"
              className="text-[9px] tracking-[0.15em] uppercase text-muted hover:text-cream transition-colors"
            >
              {t("viewAll")}
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-raised/40 transition-colors"
                >
                  <span className="text-sm text-cream">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[11px] text-muted font-mono">
                    {user.email}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-5 py-6 text-center text-[11px] text-muted">
                {t("noUsers")}
              </p>
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="border border-border bg-surface">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <p className="text-[9px] tracking-[0.25em] uppercase text-sienna">
              {t("recentProducts")}
            </p>
            <Link
              href="/admin/products"
              className="text-[9px] tracking-[0.15em] uppercase text-muted hover:text-cream transition-colors"
            >
              {t("viewAll")}
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-raised/40 transition-colors"
                >
                  <span className="text-sm text-cream">{product.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] tracking-widest uppercase text-muted border border-border px-2 py-0.5">
                      {product.type.name}
                    </span>
                    <span className="text-[11px] text-gold font-mono">
                      {t("currency")} {product.price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-5 py-6 text-center text-[11px] text-muted">
                {t("noProducts")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
