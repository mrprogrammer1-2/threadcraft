import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import type { InferSelectModel } from "drizzle-orm";
import type { usersTable } from "@/db/schema";
import type { useTranslations } from "next-intl";

type User = InferSelectModel<typeof usersTable>;

import ActionsCell from "./ActionsCell";

type T = ReturnType<typeof useTranslations<"AdminUsersTable">>;

export function getColumns(t: T): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label={t("selectAll")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label={t("selectRow")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      header: t("name"),
      accessorFn: (user) => {
        const first = user.firstName ?? "";
        const last = user.lastName ?? "";
        const full = `${first} ${last}`.trim();
        return full || t("noName");
      },
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: t("email"),
      enableSorting: true,
    },
    // add more user-specific columns here if needed (e.g. createdAt once added to schema)
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return <ActionsCell user={user} />;
      },
    },
  ];
}
