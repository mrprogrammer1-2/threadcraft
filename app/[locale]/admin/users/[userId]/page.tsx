import type { Metadata } from "next";
import SingleUserClient from "./SingleUserClient";
import { getUserById } from "@/lib/queries/usersQueries";
import {
  userRecentOrders,
  userTotalCancelledOrders,
  userTotalOrders,
  userTotalPendingOrders,
  userTotalSpent,
} from "@/lib/queries/ordersQueiry";

type UserDetailProps = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({
  params,
}: UserDetailProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUserById(userId);

  return {
    title: user
      ? `${user.firstName || "User"} ${user.lastName || ""}`.trim() ||
        "User Details"
      : "User Details",
    description: `View user profile, orders, and account information for ThreadCraft customer.`,
  };
}

export default async function SingleUserPage({ params }: UserDetailProps) {
  const { userId } = await params;
  const user = await getUserById(userId);

  const totalSpent = await userTotalSpent(userId);
  const totalOrders = await userTotalOrders(userId);
  // const orders = await getUserOrders(userId);
  const recentOrders = await userRecentOrders(userId);
  const totalPendingOrders = await userTotalPendingOrders(userId);
  const totalCancelledOrders = await userTotalCancelledOrders(userId);

  return (
    <div>
      <SingleUserClient
        user={user!}
        totalSpent={totalSpent}
        totalOrders={totalOrders}
        recentOrders={recentOrders}
        totalPendingOrders={totalPendingOrders}
        totalCancelledOrders={totalCancelledOrders}
      />
    </div>
  );
}
