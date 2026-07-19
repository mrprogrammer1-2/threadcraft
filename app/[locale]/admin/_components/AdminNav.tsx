import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const navItems = [
  { key: "dashboard", path: "/admin" },
  { key: "users", path: "/admin/users" },
  { key: "products", path: "/admin/products" },
  { key: "orders", path: "/admin/orders" },
  { key: "designs", path: "/admin/designs" },
  { key: "pricing", path: "/admin/pricing" },
] as const;

export default async function AdminNav() {
  const t = await getTranslations("AdminNavbar");
  const locale = await getLocale();
  const isRTL = locale === "ar";

  return (
    <header
      className="sticky top-0 z-50 w-full flex items-center border-b border-border bg-surface/95 backdrop-blur"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex w-full py-2.5 items-center px-6 gap-6">
        <Link
          href="/"
          className="text-[13px] tracking-[0.35em] uppercase font-black text-cream shrink-0"
        >
          {t("brand")}
        </Link>
        <div className="h-4 w-px bg-border" />
        <nav className="flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-[10px] tracking-[0.2em] uppercase text-dim hover:text-cream transition-colors"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>
        <div className="flex-1" />
        <LocaleSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 border border-border px-3 py-1.5 hover:border-sienna/50 transition-colors">
              <Avatar className="h-5 w-5">
                <AvatarImage src="/images/logo.png" alt={t("admin")} />
                <AvatarFallback className="text-[9px] bg-raised text-muted">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] tracking-widest uppercase text-dim">
                {t("admin")}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 bg-surface border-border"
            align="end"
          >
            <DropdownMenuLabel className="text-[9px] tracking-[0.2em] uppercase text-muted font-normal">
              admin@hoodify.com
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-dim hover:text-cream text-xs gap-2">
              <User className="h-3.5 w-3.5" /> {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-dim hover:text-cream text-xs gap-2">
              <Settings className="h-3.5 w-3.5" /> {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-[#8b4040] hover:text-cream hover:bg-[#8b4040]/20 text-xs gap-2">
              <LogOut className="h-3.5 w-3.5" /> {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
