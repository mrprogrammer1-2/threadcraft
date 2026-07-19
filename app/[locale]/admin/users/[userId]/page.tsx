import SingleUserClient from "./SingleUserClient";
import { getUserById } from "@/lib/queries/usersQueries";
import {
  // getUserOrders,
  userRecentOrders,
  userTotalCancelledOrders,
  userTotalOrders,
  userTotalPendingOrders,
  userTotalSpent,
} from "@/lib/queries/ordersQueiry";

export default async function SingleUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
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
