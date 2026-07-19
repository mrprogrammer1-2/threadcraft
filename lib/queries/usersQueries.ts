import db from "@/db";
import { usersTable } from "@/db/schema";
import { and, ilike, or, eq } from "drizzle-orm";

export const getAllUsers = async (search?: string) => {
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(usersTable.firstName, `%${search}%`),
        ilike(usersTable.lastName, `%${search}%`),
        ilike(usersTable.email, `%${search}%`),
      ),
    );
  }

  const users = await db
    .select()
    .from(usersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  console.log("server", users);
  return users;
};

export const getUserById = async (id: string) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .then((res) => res[0]);

  return user;
};
