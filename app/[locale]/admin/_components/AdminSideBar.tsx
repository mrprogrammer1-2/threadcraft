import { getPendingOrdersCount } from "@/lib/queries/ordersQueiry";
import AdminSideBarClient from "./AdminSideBarClient";

export default async function AdminSideBar() {
  const pendingCount = await getPendingOrdersCount();
  return <AdminSideBarClient pendingCount={pendingCount} />;
}
