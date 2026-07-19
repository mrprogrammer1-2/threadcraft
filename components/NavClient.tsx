"use client";

import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import Image from "next/image";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import CartIcon from "@/components/CartIcon";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";

type User = {
  id: string;
  kindeId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  avatar: string | null;
  phone: string | null;
  active: boolean;
  createdAt: Date;
};

export default function NavBar({ user }: { user: User | null }) {
  const t = useTranslations("NavBar");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, getPermission, isLoading } = useKindeBrowserClient();
  const isAdmin = !isLoading && getPermission("admin")?.isGranted;

  const navLinks = [
    { key: "gallery", href: "/gallery" },
    { key: "process", href: "/process" },
    { key: "about", href: "/about" },
    { key: "shop", href: "/shop" },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      setUserAvatar(user?.avatar ?? null);
    }
  }, [isAuthenticated, user]);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // close on escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-[100] bg-(--cream) backdrop-blur-md border-b border-(--mist)"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 lg:py-6">
          {/* Logo */}
          <Link
            className="text-md sm:text-xl lg:text-[22px] font-black tracking-[0.1em] lg:tracking-[0.12em] text-[var(--ink)] [font-family:var(--font-family-playfair)] shrink-0 [&_span]:text-(--sienna) [&_span]:italic [&_span]:font-[500px]"
            href="/"
            onClick={closeMobile}
          >
            THREAD<span>craft</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:block">
            <ul className="flex gap-10 list-none">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-[11px] tracking-[0.2em] text-(--ink) hover:text-(--sienna) uppercase transition-colors duration-200"
                  >
                    {t(link.key as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Utilities Group */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <LocaleSwitcher />
            <CartIcon />

            {/* Auth controls / Profile Avatar */}
            {isLoading ? (
              <Button disabled className="hidden lg:inline-flex">
                {t("loading")}
              </Button>
            ) : !isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-[11px] tracking-[0.2em] uppercase text-(--ink) hover:text-(--sienna) hover:bg-transparent px-0"
                >
                  <LoginLink>{t("login")}</LoginLink>
                </Button>
                <Button className="text-[11px] tracking-[0.2em] uppercase bg-(--ink) text-(--cream) hover:bg-(--sienna) rounded-none px-5 py-2">
                  <RegisterLink>{t("register")}</RegisterLink>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover border border-(--mist)"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted border flex items-center justify-center text-xs">
                        {user?.firstName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="cursor-auto [&_*]:cursor-auto"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{t("profile")}</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">{t("adminDashboard")}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <LogoutLink postLogoutRedirectURL="/">
                      {t("logout")}
                    </LogoutLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Menu"}
              className="lg:hidden flex items-center justify-center w-9 h-9 text-(--ink) hover:text-(--sienna) transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full inset-x-0 bg-(--cream) border-b border-(--mist) shadow-lg px-5 sm:px-8 py-4">
            <ul className="flex flex-col list-none divide-y divide-(--mist)">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    className="block py-3 text-[12px] tracking-[0.2em] text-(--ink) hover:text-(--sienna) uppercase transition-colors duration-200"
                  >
                    {t(link.key as any)}
                  </Link>
                </li>
              ))}
            </ul>

            {!isLoading && !isAuthenticated && (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-(--mist)">
                <Button
                  variant="ghost"
                  onClick={closeMobile}
                  className="w-full justify-center text-[11px] tracking-[0.2em] uppercase text-(--ink) hover:text-(--sienna) hover:bg-transparent border border-(--mist)"
                >
                  <LoginLink>{t("login")}</LoginLink>
                </Button>
                <Button
                  onClick={closeMobile}
                  className="w-full justify-center text-[11px] tracking-[0.2em] uppercase bg-(--ink) text-(--cream) hover:bg-(--sienna) rounded-none px-5 py-2"
                >
                  <RegisterLink>{t("register")}</RegisterLink>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[90] bg-black/20"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
    </>
  );
}
