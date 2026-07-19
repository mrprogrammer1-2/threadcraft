import { getSingleProductWithType } from "@/lib/queries/productsQueriry";
import StudioEditClient from "./StudioEditClient";
import TemplateStudioClient from "./TemplateStudioClient";

export default async function StudioEditPage(props: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ color?: string; size?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const product = await getSingleProductWithType(params.productId);

  if (!product) return <div>Product not found</div>;

  const isTemplate = product.studioMode === "template";
  const isFree = product.studioMode === "free";

  if (!isTemplate && !isFree) return <div>This product is not customizable.</div>;

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
