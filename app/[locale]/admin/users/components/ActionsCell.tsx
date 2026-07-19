"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import type { InferSelectModel } from "drizzle-orm";
import type { usersTable } from "@/db/schema";

type User = InferSelectModel<typeof usersTable>;

interface ActionsCellProps {
  user: User;
}

export default function ActionsCell({ user }: ActionsCellProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full p-0 transition duration-200 hover:bg-white/10 hover:text-cream focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.98]"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user.id)}
        >
          Copy payment ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/admin/users/${user.id}`)}
        >
          View user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
