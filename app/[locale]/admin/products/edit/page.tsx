import type { Metadata } from "next";
import { getSingleProductWithType } from "@/lib/queries/productsQueriry";
import EditForm from "./EditForm";

type EditPageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: EditPageProps): Promise<Metadata> {
  const { productId } = await searchParams;

  if (!productId) {
    return { title: "Edit Product" };
  }

  const product = await getSingleProductWithType(productId);

  return {
    title: product ? `Edit: ${product.name}` : "Edit Product",
    description:
      "Edit product details, images, variants, and studio configuration.",
  };
}

export default async function EditPage({ searchParams }: EditPageProps) {
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
