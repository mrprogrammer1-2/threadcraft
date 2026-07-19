"use client";

import {
  ColumnDef,
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
import { useState } from "react";
import { Trash } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { deleteOrders } from "@/lib/actions/ordersActions";
import { ConfirmDeleteModal } from "@/app/[locale]/admin/_components/ConfirmDeleteModal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("AdminDataTable");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

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
    const orderIds = selectedRows.map(
      (row) => (row.original as any).id as string,
    );

    if (orderIds.length === 0) return;

    setIsDeleting(true);
    try {
      await deleteOrders(orderIds);
      setRowSelection({});
      setShowConfirmModal(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting orders:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="mt-5 relative" dir={isRTL ? "rtl" : "ltr"}>
      {selectedCount > 0 && (
        <div className="mb-2 flex justify-end absolute -top-11 right-0 rtl:right-auto rtl:left-0">
          <Button
            className="bg-[#8b4040] text-cream hover:bg-[#a05050] cursor-pointer flex flex-row gap-2 items-center rounded-none border-0"
            onClick={() => setShowConfirmModal(true)}
            disabled={isDeleting}
          >
            <span>{isDeleting ? t("deleting") : t("deleteSelected")}</span>
            <span>({selectedCount})</span>
            <Trash className="h-4 w-4" />
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
                    <TableHead
                      key={header.id}
                      className={isRTL ? "text-right" : "text-left"}
                    >
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
                    router.push(`/admin/orders/${(row.original as any).id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={isRTL ? "text-right" : "text-left"}
                    >
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
