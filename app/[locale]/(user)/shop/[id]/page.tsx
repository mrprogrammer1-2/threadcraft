import { notFound } from "next/navigation";
import { getSingleProductWithType } from "@/lib/queries/productsQueriry";
import ProductClient from "./ProductClient";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getSingleProductWithType(id);

  if (!product) notFound();

  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Loader />
        </div>
      }
    >
      <ProductClient product={product} />
    </Suspense>
  );
}
