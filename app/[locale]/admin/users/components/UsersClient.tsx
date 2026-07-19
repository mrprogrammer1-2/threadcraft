import React from "react";

type UserType = {
  id: string;
  kindeId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function UsersClient({ users }: { users: UserType[] }) {
  return (
    <ul className="divide-y divide-primary-foreground/10">
      {users.map((user: UserType) => (
        <li key={user.id} className="py-4 flex items-center gap-4">
          <div className=" rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground">
            <h1 className="text-sm font-medium text-white ">
              {user.firstName} {user.lastName}
            </h1>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm truncate">{user.email}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
