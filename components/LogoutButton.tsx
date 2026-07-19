"use client";
import { useAppDispatch } from "@/lib/hooks";
import { clearCart } from "@/lib/features/cartSlice";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export function LogoutButton({ className }: { className?: string }) {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearCart());
    localStorage.removeItem("cart-synced");
  };

  return (
    <LogoutLink onClick={handleLogout} className={className}>
      Log Out
    </LogoutLink>
  );
}
