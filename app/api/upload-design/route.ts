import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const body = await req.json();
  const { image } = body;

  if (!image || typeof image !== "string") {
    return NextResponse.json(
      { success: false, error: "Invalid image" },
      { status: 400 },
    );
  }

  try {
    const upload = await cloudinary.uploader.upload(image, {
      folder: "hoodify/custom-designs",
      resource_type: "image",
    });

    return NextResponse.json({ success: true, url: upload.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 },
    );
  }
}
