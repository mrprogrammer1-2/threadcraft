import db from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user == null || !user.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const dbUser = await db
      .selectDistinct()
      .from(usersTable)
      .where(eq(usersTable.kindeId, user.id));

    if (!dbUser.length) {
      await db.insert(usersTable).values({
        id: uuidv4(),
        kindeId: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
        avatar: user.picture ?? null,
      });
    } else if (user.picture && !dbUser[0].avatar) {
      await db
        .update(usersTable)
        .set({ avatar: user.picture })
        .where(eq(usersTable.kindeId, user.id));
    }

    const siteUrl =
      process.env.KINDE_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";
    return NextResponse.redirect(new URL(siteUrl));
  } catch (error) {
    console.error("Auth success error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
