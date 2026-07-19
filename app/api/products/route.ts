import { NextResponse } from "next/server";
import { getAllProductsWithType } from "@/lib/queries/productsQueriry";

export async function GET() {
  try {
    const products = await getAllProductsWithType();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
