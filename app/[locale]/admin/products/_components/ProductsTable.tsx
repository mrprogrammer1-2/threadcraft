import { DataTable } from "./Data-table";
import { getAllProducts } from "@/lib/queries/productsQueriry";

async function getData(search?: string): Promise<SingleProductClientType[]> {
  return await getAllProducts(search);
}

export default async function ProductsTable({ search }: { search?: string }) {
  const data = await getData(search);

  return (
    <div>
      <DataTable data={data} />
    </div>
  );
}
