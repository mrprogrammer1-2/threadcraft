"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./DataTablePagination";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Trash } from "lucide-react";
import { deleteProducts } from "@/lib/actions/productsActions";
import { ConfirmDeleteModal } from "../../_components/ConfirmDeleteModal";
import { getColumns } from "./Columns";

type DataRow = {
  id: string;
  createdAt: Date;
  name: string;
  price: number;
  images: any;
  variants: any;
  type: any;
  featured: boolean;
  studioMode: "none" | "free" | "template";
  templateConfig: any;
  isActive: boolean | null;
  description: string | null;
};

interface DataTableProps {
  data: DataRow[];
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const t = useTranslations("AdminDataTable");
  const tColumns = useTranslations("AdminProductsColumns");
  const locale = useLocale();

  const columns = useMemo(
    () => getColumns(tColumns, locale),
    [tColumns, locale],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const handleDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const productIds = selectedRows.map(
      (r) => (r.original as { id: string }).id,
    );

    if (productIds.length === 0) return;

    setIsDeleting(true);
    try {
      await deleteProducts(productIds);
      setRowSelection({});
      setShowConfirmModal(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting products:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="mt-5 relative">
      {selectedCount > 0 && (
        <div className="mb-2 flex justify-end absolute -top-11 right-0">
          <Button
            className="bg-[#8b4040] text-cream hover:bg-[#a05050] cursor-pointer rounded-none border-0"
            onClick={() => setShowConfirmModal(true)}
            disabled={isDeleting}
          >
            {isDeleting ? t("deleting") : t("delete")}
            <Trash />
          </Button>
        </div>
      )}
      <ConfirmDeleteModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemCount={selectedCount}
      />
      <div className="overflow-hidden border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/products/${(row.original as any).id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
