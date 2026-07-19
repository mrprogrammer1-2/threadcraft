import { NextResponse } from "next/server";
import db from "@/db";
import { designs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(designs).orderBy(designs.createdAt);
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { key, label, svg, url } = body;

  if (!key || !label || (!svg && !url)) {
    return NextResponse.json(
      { error: "key, label, and either svg or url are required" },
      { status: 400 },
    );
  }

  const [design] = await db
    .insert(designs)
    .values({ key, label, svg, url })
    .returning();
  return NextResponse.json(design, { status: 201 });
}
