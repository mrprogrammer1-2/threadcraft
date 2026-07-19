"use server";

import { getDbUser } from "./userActions";

export async function checkUserActive(): Promise<boolean> {
  const user = await getDbUser();
  return user?.active ?? false;
}
