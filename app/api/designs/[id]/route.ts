import { NextResponse } from "next/server";
import db from "@/db";
import { designs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(designs).where(eq(designs.id, id));
  return NextResponse.json({ success: true });
}
