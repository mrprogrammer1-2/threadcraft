// ShopClient.tsx
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/features/productsSlice";

export default function ShopClient({
  products,
  noProductsLabel,
}: {
  products: Product[];
  noProductsLabel: string;
}) {
  if (products.length === 0) {
    return (
      <p className="text-[12px] tracking-[0.15em] text-(--mist) uppercase">
        {noProductsLabel}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="shop" />
      ))}
    </div>
  );
}
