import { getSingleProductWithType } from "@/lib/queries/productsQueriry";
import EditForm from "./EditForm";

export default async function EditPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { productId } = await searchParams;

  if (!productId) return <p>Product id is missing</p>; // ← added return

  const product = await getSingleProductWithType(productId);

  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <EditForm product={product} />
    </div>
  );
}
