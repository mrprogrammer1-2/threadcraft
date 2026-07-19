"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { InferSelectModel } from "drizzle-orm";
import type { usersTable } from "@/db/schema";
import { getColumns } from "./Columns";
import { DataTable } from "./Data-table";

type User = InferSelectModel<typeof usersTable>;

export default function UsersTableClient({ data }: { data: User[] }) {
  const t = useTranslations("AdminUsersTable");
  const columns = useMemo(() => getColumns(t), [t]);

  return <DataTable columns={columns} data={data} />;
}
