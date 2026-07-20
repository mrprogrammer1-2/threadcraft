import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const revalidate = 3600;

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression("folder:hoodify/gallery")
      .sort_by("created_at", "desc")
      .with_field("tags")
      .max_results(50)
      .execute();

    const images = result.resources.map((img: any) => ({
      url: cloudinary.url(img.public_id, {
        fetch_format: "auto",
        quality: "auto",
        width: 800,
        secure: true,
      }),
      publicId: img.public_id,
      tags: img.tags ?? [],
    }));

    return NextResponse.json(images, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Cloudinary gallery fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 },
    );
  }
}
