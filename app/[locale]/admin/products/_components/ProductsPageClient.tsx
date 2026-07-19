"use client";
import Image from "next/image";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";

type Props = {
  products: SingleProductClientType[];
};

type ImgType = {
  id: string;
  color: string | null;
  place: string | null;
  url: string;
  position: number | null;
};

export default function ProductsTable({ products }: Props) {
  const router = useRouter();

  // helper to render prices in Egyptian pounds (ج.م)
  const formatEgp = (value: number) =>
    new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 2,
    }).format(value);

  const columnHeadersArray: Array<keyof SingleProductClientType> = [
    "images",
    "name",
    "price",
  ];

  const columnHelper = createColumnHelper<SingleProductClientType>();

  const columns = columnHeadersArray.map((columnName) => {
    return columnHelper.accessor(columnName, {
      id: columnName,
      header: columnName[0].toUpperCase() + columnName.slice(1),
      cell: (info) => {
        // show an image thumbnail for the images column, format price, otherwise default to the value
        if (columnName === "images") {
          const imgs = info.getValue() as ImgType[];
          const src =
            imgs.find((img) => img.place === "front")?.url || imgs[0]?.url;
          return (
            <Image
              src={src || ""}
              alt="product image"
              width={40}
              height={40}
              className="object-cover rounded"
            />
          );
        }
        if (columnName === "price") {
          const price = info.getValue() as number;
          return formatEgp(price);
        }
        return info.getValue();
      },
    });
  });

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-6 overflow-hidden border border-border">
      <Table className="border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="bg-raised/40 text-[9px] tracking-[0.2em] uppercase text-muted font-normal">
                  <div>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
              onClick={() => router.push(`/admin/products/${row.original.id}`)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // return (
  //   <div className="w-full min-h-dvh">
  //     <ul className="w-full h-full flex flex-col gap-4">
  //       {products.map((p) => (
  //         <li key={p.id} className="flex flex-row justify-between border-b-2">
  //           {/* product.images.find((img) => img.place === "front")
  //                         ?.url || product.images[0]?.url */}
  //           <Image
  //             src={
  //               p.images.find((img: ImgType) => img.place === "front")?.url ||
  //               p.images[0]?.url
  //             }
  //             alt={p.name}
  //             width={100}
  //             height={100}
  //           />
  //           <div className="flex-1 ml-4">
  //             <h2 className="text-lg font-semibold">{p.name}</h2>
  //             <p className="text-sm text-muted-foreground">{p.description}</p>
  //           </div>
  //           <span className="text-md font-medium">${p.price}</span>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
}
