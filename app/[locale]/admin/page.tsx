import type { Metadata } from "next";
import Dashboard from "./_components/DashBoard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "ThreadCraft admin dashboard — manage users, products, orders, and studio designs.",
};

export default function page() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
