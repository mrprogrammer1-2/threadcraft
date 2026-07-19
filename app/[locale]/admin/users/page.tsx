import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import UsersTable from "./components/UsersTable";
import SearchBar from "../_components/SearchBar";
import UserTableSkeleton from "@/components/skeletons/UserTableSkeleton";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { userId, search } = await searchParams;
  const t = await getTranslations("AdminUsersPage");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  // const users = await getAllUsers();

  return (
    <div className="w-full h-full space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-sienna mb-1">
          {t("eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold text-cream tracking-tight">
          {t("title")}
        </h1>
      </div>
      <SearchBar action="/admin/users" userId={userId} defaultSearch={search} />
      <Suspense fallback={<UserTableSkeleton />}>
        <UsersTable search={search} />
      </Suspense>
    </div>
  );
}
