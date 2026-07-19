import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import ActionsCell from "./ActionsCell";

const formatEgp = (value: number, locale: string) =>
  new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
  }).format(value);

export const getColumns = (
  t: (key: string) => string,
  locale: string,
): ColumnDef<SingleProductClientType>[] => [
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
    accessorKey: "images",
    header: t("image"),
    cell: (info) => {
      const imgs = info.getValue() as SingleProductClientType["images"];
      const src =
        imgs?.find((img) => img.place === "front")?.url || imgs?.[0]?.url || "";
      return (
        <Image
          src={src}
          alt={t("productAlt")}
          width={40}
          height={40}
          className="object-cover rounded"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: t("name"),
    enableSorting: true,
  },
  {
    accessorKey: "price",
    header: t("price"),
    enableSorting: true,
    cell: (info) => formatEgp(info.getValue() as number, locale),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          {t("createdAt")}
          <span className="ml-2">
            {isSorted === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </span>
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = new Date(rowA.getValue<string>(columnId)).getTime();
      const b = new Date(rowB.getValue<string>(columnId)).getTime();
      return a === b ? 0 : a > b ? 1 : -1;
    },
    cell: (info) => {
      const val = info.getValue() as string | undefined;
      if (!val) return "-";
      const date = new Date(val);
      return isNaN(date.getTime())
        ? t("invalidDate")
        : date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return <ActionsCell product={product} />;
    },
  },
];
