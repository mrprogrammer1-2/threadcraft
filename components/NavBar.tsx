import { getDbUser } from "@/lib/actions/userActions";
import NavClient from "./NavClient";

export default async function NavBar() {
  const user = await getDbUser();

  return <NavClient user={user} />;
}
