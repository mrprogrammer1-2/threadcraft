"use server";
import { unstable_cache } from "next/cache";

import db from "@/db";
import {
  productImages,
  productTypes,
  productVariants,
  products,
} from "@/db/schema";
import { eq, ilike, or, sql, and } from "drizzle-orm";

export async function getAllProducts(search?: string) {
  const conditions: any[] = [];

  if (search) {
    conditions.push(
      or(
        ilike(products.name, `%${search}%`),
        sql`${products.typeId}::text ILIKE ${`%${search}%`}`,
      ),
    );
  }

  const fetchProducts = unstable_cache(
    async () => {
      const rows = await db
        .select({
          productId: products.id,
          name: products.name,
          price: products.price,
          createdAt: products.createdAt,
          imageId: productImages.id,
          imageUrl: productImages.url,
          imagePlace: productImages.place,
          imageColor: productImages.color,
          imagePosition: productImages.position,
          variantId: productVariants.id,
          variantColor: productVariants.color,
          variantSize: productVariants.size,
          variantStock: productVariants.stock,
          variantPrice: productVariants.price,
        })
        .from(products)
        .leftJoin(productImages, eq(products.id, productImages.productId))
        .leftJoin(productVariants, eq(products.id, productVariants.productId))
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const productsMap = new Map();

      for (const row of rows) {
        if (!productsMap.has(row.productId)) {
          productsMap.set(row.productId, {
            id: row.productId,
            name: row.name,
            price: row.price,
            createdAt:
              row.createdAt instanceof Date
                ? row.createdAt.toISOString()
                : row.createdAt,
            images: [],
            variants: [],
          });
        }

        const product = productsMap.get(row.productId);

        if (
          row.imageId &&
          !product.images.some((img: any) => img.id === row.imageId)
        ) {
          product.images.push({
            id: row.imageId,
            url: row.imageUrl,
            place: row.imagePlace,
            color: row.imageColor,
            position: row.imagePosition,
          });
        }

        if (
          row.variantId &&
          !product.variants.some((v: any) => v.id === row.variantId)
        ) {
          product.variants.push({
            id: row.variantId,
            color: row.variantColor,
            size: row.variantSize,
            stock: row.variantStock,
            price: row.variantPrice,
          });
        }
      }

      return Array.from(productsMap.values());
    },
    [`all-products-${search ?? "all"}`],
    { revalidate: 60 * 60 * 24 },
  );

  return fetchProducts();
}

export const getAllProductsWithType = unstable_cache(
  async () => {
    return db.query.products.findMany({
      where: eq(products.isActive, true),

      with: {
        type: true,

        images: {
          orderBy: (images, { asc }) => [asc(images.position)],
        },

        variants: true,
      },
    });
  },
  ["all-products-with-type"],
  {
    revalidate: 60 * 5,
  },
);

export async function getSingleProductWithType(id: string) {
  const cachedFn = unstable_cache(
    async () => {
      return db.query.products.findFirst({
        where: eq(products.id, id),

        with: {
          type: true,

          images: {
            orderBy: (images, { asc }) => [asc(images.position)],
          },

          variants: true,
        },
      });
    },
    [`product-${id}`],
    {
      revalidate: 60 * 5,
    },
  );

  return cachedFn();
}

export async function getProductTypes() {
  return db.select().from(productTypes);
}

export async function getSingleType(id: string) {
  const cachedFn = unstable_cache(
    async () => {
      const type = await db
        .select()
        .from(productTypes)
        .where(eq(productTypes.id, id))
        .limit(1);

      return type[0];
    },
    [`type-${id}`],
    {
      revalidate: 60 * 60 * 24,
    },
  );

  return cachedFn();
}

// ==================================================================================

// "use server";
// import { unstable_cache } from "next/cache";

// import db from "@/db";
// import { productImages, productTypes, products } from "@/db/schema";
// import { eq } from "drizzle-orm";

// "use server";
// import { unstable_cache } from "next/cache";

// import db from "@/db";
// import { productImages, productTypes, productVariants, products } from "@/db/schema";
// import { and, eq, ilike, or, sql } from "drizzle-orm";

// export async function getAllProducts(search?: string) {
//   const conditions = [];

//   if (search) {
//     conditions.push(
//       or(
//         ilike(products.name, `%${search}%`),
//         sql`${products.typeId}::text ILIKE ${`%${search}%`}`,
//       ),
//     );
//   }

//   const fetchProducts = unstable_cache(
//     async () => {
//       const rows = await db
//         .select({
//           productId: products.id,
//           name: products.name,
//           price: products.price,
//           createdAt: products.createdAt,
//           imageId: productImages.id,
//           imageUrl: productImages.url,
//           imagePlace: productImages.place,
//           imageColor: productImages.color,
//           imagePosition: productImages.position,
//           variantId: productVariants.id,
//           variantColor: productVariants.color,
//           variantSize: productVariants.size,
//           variantStock: productVariants.stock,
//           variantPrice: productVariants.price,
//         })
//         .from(products)
//         .leftJoin(productImages, eq(products.id, productImages.productId))
//         .leftJoin(productVariants, eq(products.id, productVariants.productId))
//         .where(conditions.length > 0 ? and(...conditions) : undefined);

//       const productsMap = new Map();

//       for (const row of rows) {
//         if (!productsMap.has(row.productId)) {
//           productsMap.set(row.productId, {
//             id: row.productId,
//             name: row.name,
//             price: row.price,
//             createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
//             images: [],
//             variants: [],
//           });
//         }

//         const product = productsMap.get(row.productId);

//         if (row.imageId && !product.images.some((img: any) => img.id === row.imageId)) {
//           product.images.push({
//             id: row.imageId,
//             url: row.imageUrl,
//             place: row.imagePlace,
//             color: row.imageColor,
//             position: row.imagePosition,
//           });
//         }

//         if (row.variantId && !product.variants.some((v: any) => v.id === row.variantId)) {
//           product.variants.push({
//             id: row.variantId,
//             color: row.variantColor,
//             size: row.variantSize,
//             stock: row.variantStock,
//             price: row.variantPrice,
//           });
//         }
//       }

//       return Array.from(productsMap.values());
//     },
//     [`all-products-${search ?? "all"}`],
//     { revalidate: 60 * 60 * 24 },
//   );

//   return fetchProducts();
// }

// export const getAllProductsWithType = unstable_cache(
//   async () => {
//     return db.query.products.findMany({
//       where: eq(products.isActive, true),

//       with: {
//         type: true,

//         images: {
//           orderBy: (images, { asc }) => [asc(images.position)],
//         },

//         variants: true,
//       },
//     });
//   },
//   ["all-products-with-type"],
//   {
//     revalidate: 60 * 5,
//   },
// );

// export async function getSingleProductWithType(id: string) {
//   const cachedFn = unstable_cache(
//     async () => {
//       return db.query.products.findFirst({
//         where: eq(products.id, id),

//         with: {
//           type: true,

//           images: {
//             orderBy: (images, { asc }) => [asc(images.position)],
//           },

//           variants: true,
//         },
//       });
//     },
//     [`product-${id}`],
//     {
//       revalidate: 60 * 5,
//     },
//   );

//   return cachedFn();
// }

// export async function getProductTypes() {
//   return db.select().from(productTypes);
// }

// export async function getSingleType(id: string) {
//   const cachedFn = unstable_cache(
//     async () => {
//       const type = await db
//         .select()
//         .from(productTypes)
//         .where(eq(productTypes.id, id))
//         .limit(1);

//       return type[0];
//     },
//     [`type-${id}`],
//     {
//       revalidate: 60 * 60 * 24,
//     },
//   );

//   return cachedFn();
// }
