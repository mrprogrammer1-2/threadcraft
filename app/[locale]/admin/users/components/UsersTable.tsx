import { getAllUsers } from "@/lib/queries/usersQueries";
import UsersTableClient from "./UsersTableClient";

export default async function UsersTable({ search }: { search?: string }) {
  const data = await getAllUsers(search);

  return (
    <div>
      <UsersTableClient data={data} />
    </div>
  );
}
