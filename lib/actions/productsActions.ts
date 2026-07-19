"use server";

import db from "@/db";
import {
  productImages,
  products,
  productVariants,
  productTypes,
  orderItems,
  orders,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export const createProduct = async (data: FormData) => {
  const name = data.get("name") as string;
  const description = data.get("description") as string;
  const price = Number(data.get("price"));
  const typeId = data.get("typeId") as string;
  const featured = data.get("featured") === "on";
  const studioMode =
    (data.get("studioMode") as "none" | "free" | "template") ?? "none";
  const templateConfigRaw = data.get("templateConfig") as string | null;
  const templateConfig =
    studioMode === "template" && templateConfigRaw
      ? JSON.parse(templateConfigRaw)
      : null;

  if (!name || !price || !typeId) {
    throw new Error("Missing required fields");
  }

  const images = JSON.parse((data.get("images") as string) || "[]");
  const variants = JSON.parse((data.get("variants") as string) || "[]");

  const [product] = await db
    .insert(products)
    .values({
      name,
      description,
      price,
      typeId,
      featured,
      studioMode,
      templateConfig,
    })
    .returning();

  // Insert Images
  if (images.length > 0) {
    await db.insert(productImages).values(
      images.map((image: any, index: number) => ({
        productId: product.id,
        url: image.url,
        place: image.place ?? null,
        color: image.color ?? null,
        position: image.position ?? index,
      })),
    );
  }

  // Insert Variants
  if (variants.length > 0) {
    await db.insert(productVariants).values(
      variants.map((variant: any) => ({
        productId: product.id,
        color: variant.color,
        size: variant.size || null,
        stock: variant.stock ?? 0,
        price: variant.price ?? null,
      })),
    );
  }

  return { success: true };
};

export const createProductType = async (data: FormData) => {
  const name = data.get("name") as string;
  const hasSizes = data.get("hasSizes") === "on";
  const sizesInput = (data.get("sizes") as string) || "";
  const hasThreadColor = data.get("hasThreadColor") === "on";
  const imagePlacements = (data.getAll("imagePlacements") as string[]).filter(
    Boolean,
  );

  if (!name) throw new Error("Missing required fields");

  const sizes = hasSizes
    ? sizesInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const [productType] = await db
    .insert(productTypes)
    .values({ name, hasSizes, sizes, hasThreadColor, imagePlacements })
    .returning();

  return { success: true, id: productType.id };
};

export const deleteProducts = async (productIds: string[]) => {
  if (productIds.length === 0) return;

  await db.delete(orderItems).where(inArray(orderItems.productId, productIds));
  await db
    .delete(productVariants)
    .where(inArray(productVariants.productId, productIds));
  await db
    .delete(productImages)
    .where(inArray(productImages.productId, productIds));
  await db.delete(products).where(inArray(products.id, productIds));
};

export const deleteOrders = async (orderIds: string[]) => {
  if (orderIds.length === 0) return;
  await db.delete(orderItems).where(inArray(orderItems.orderId, orderIds));
  await db.delete(orders).where(inArray(orders.id, orderIds));
};

export async function editProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const typeId = formData.get("typeId") as string;
  const featured = formData.get("featured") === "on";
  const studioMode =
    (formData.get("studioMode") as "none" | "free" | "template") ?? "none";
  const templateConfigRaw = formData.get("templateConfig") as string | null;
  const templateConfig =
    studioMode === "template" && templateConfigRaw
      ? JSON.parse(templateConfigRaw)
      : null;

  const images = JSON.parse((formData.get("images") as string) || "[]") as {
    url: string;
    place?: "front" | "back" | "left-sleeve" | "right-sleeve";
    color?: string;
    position?: number;
  }[];

  const variants = JSON.parse((formData.get("variants") as string) || "[]") as {
    color: string;
    size?: string;
    stock: number;
    price?: number;
  }[];

  await db
    .update(products)
    .set({ name, price, typeId, featured, studioMode, templateConfig })
    .where(eq(products.id, id));

  await db.delete(productImages).where(eq(productImages.productId, id));
  await db.delete(productVariants).where(eq(productVariants.productId, id));

  if (images.length) {
    await db.insert(productImages).values(
      images.map((image, index) => ({
        productId: id,
        url: image.url,
        place: image.place ?? null,
        color: image.color ?? null,
        position: image.position ?? index,
      })),
    );
  }

  if (variants.length) {
    await db.insert(productVariants).values(
      variants.map((variant) => ({
        productId: id,
        color: variant.color,
        size: variant.size || null,
        stock: variant.stock,
        price: variant.price ?? null,
      })),
    );
  }
}
