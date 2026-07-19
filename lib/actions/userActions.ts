"use server";

import db from "@/db";
import { usersTable } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";

export const updateUserActiveStatus = async (
  userId: string,
  active: boolean,
) => {
  await db.update(usersTable).set({ active }).where(eq(usersTable.id, userId));
};

export const updateUserProfile = async (
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  },
) => {
  try {
    const updateData: any = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    const result = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, userId))
      .returning();

    return { success: true, user: result[0] };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
};

export const getDbUser = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) return null;

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.kindeId, kindeUser.id))
      .then((res) => res[0] ?? null);

    if (user && !user.avatar && kindeUser.picture) {
      const [updatedUser] = await db
        .update(usersTable)
        .set({ avatar: kindeUser.picture })
        .where(eq(usersTable.kindeId, kindeUser.id))
        .returning();

      return updatedUser;
    }

    return user;
  } catch (error) {
    console.error("getDbUser auth error:", error);
    return null;
  }
};
