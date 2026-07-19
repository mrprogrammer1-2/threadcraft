import { getDbUser } from "@/lib/actions/userActions";
import ProfileClient from "@/app/[locale]/(user)/profile/_components/ProfileClient";
import { redirect } from "next/navigation";
import { getOrders } from "@/lib/queries/ordersQueiry";
import { Suspense } from "react";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

export default async function ProfilePage() {
  const user = await getDbUser();

  if (!user) redirect("/");

  const orders = await getOrders(user.id);

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileClient user={user} orders={orders} />
    </Suspense>
  );
}
