import type { Metadata } from "next";
import { getSingleProductWithType } from "@/lib/queries/productsQueriry";
import StudioEditClient from "./StudioEditClient";
import TemplateStudioClient from "./TemplateStudioClient";

type StudioPageProps = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ color?: string; size?: string }>;
};

export async function generateMetadata({
  params,
}: StudioPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getSingleProductWithType(productId);

  if (!product) {
    return { title: "Studio" };
  }

  return {
    title: `Studio: ${product.name}`,
    description: `Design and customize your ${product.name} in the ThreadCraft studio — add text, upload designs, and choose thread colors.`,
  };
}

export default async function StudioEditPage(props: StudioPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const product = await getSingleProductWithType(params.productId);

  if (!product) return <div>Product not found</div>;

  const isTemplate = product.studioMode === "template";
  const isFree = product.studioMode === "free";

  if (!isTemplate && !isFree)
    return <div>This product is not customizable.</div>;

  return (
    <div className="h-dvh">
      {isTemplate ? (
        <TemplateStudioClient
          product={product}
          initialColor={searchParams.color ?? ""}
          initialSize={searchParams.size ?? ""}
        />
      ) : (
        <StudioEditClient
          product={product}
          initialColor={searchParams.color ?? ""}
          initialSize={searchParams.size ?? ""}
        />
      )}
    </div>
  );
}
