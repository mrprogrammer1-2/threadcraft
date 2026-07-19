"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  User,
  Box,
  Settings,
  Search,
  User2,
  ChevronUp,
  Plus,
  Projector,
  DollarSign,
  PaintBucket,
  Layers,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

const sideBarItems = [
  { key: "dashboard", path: "/admin", icon: Home },
  { key: "users", path: "/admin/users", icon: User },
  { key: "products", path: "/admin/products", icon: Box },
  { key: "orders", path: "/admin/orders", icon: Projector },
  { key: "designs", path: "/admin/designs", icon: PaintBucket },
] as const;

export default function AdminSideBarClient({
  pendingCount,
}: {
  pendingCount: number;
}) {
  const t = useTranslations("AdminSidebar");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const pathName = usePathname();

  const settingsItems = [
    { key: "pricing" as const, path: "/admin/pricing", icon: DollarSign },
  ];

  return (
    <Sidebar
      collapsible="icon"
      side={isRTL ? "right" : "left"}
      className="bg-surface text-cream border-r border-border shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
    >
      <SidebarHeader className="border-b border-border/70 bg-surface/95 px-3 py-3">
        <SidebarMenu>
          <SidebarMenuButton asChild>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-[14px] tracking-[0.35em] uppercase font-black text-cream">
                {t("brand")}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-surface/95">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[8px] tracking-[0.3em] uppercase text-muted px-3 py-2">
            {t("applicationLabel")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sideBarItems.map((item) => {
                const isSelected =
                  (item.path !== "/admin" &&
                    pathName.includes(item.path) &&
                    item.path.length > 1) ||
                  pathName === item.path;
                const label = t(`nav.${item.key}`);
                return (
                  <SidebarMenuItem key={item.key} className="relative">
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "text-dim hover:text-cream hover:bg-raised/60 transition-colors rounded-none border-l-2 rtl:border-l-0 rtl:border-r-2",
                        isSelected
                          ? "border-sienna text-cream bg-raised/60"
                          : "border-transparent",
                      )}
                    >
                      <Link href={item.path} title={label}>
                        <item.icon className="h-4 w-4" />
                        <span className="text-[11px] tracking-wider">
                          {label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    {item.key === "orders" && pendingCount > 0 && (
                      <span className="absolute top-1 right-2 rtl:right-auto rtl:left-2 bg-sienna text-cream text-[9px] font-bold px-1.5 py-0.5 pointer-events-none">
                        {pendingCount > 99 ? "99+" : pendingCount}
                      </span>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-3 my-1 h-px bg-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[8px] tracking-[0.3em] uppercase text-muted px-3 py-2">
            {t("productsLabel")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "text-dim hover:text-cream hover:bg-raised/60 transition-colors rounded-none border-l-2 rtl:border-l-0 rtl:border-r-2",
                    pathName === "/admin/products/new"
                      ? "border-sienna text-cream bg-raised/60"
                      : "border-transparent",
                  )}
                >
                  <Link href="/admin/products/new" title={t("addProduct")}>
                    <Plus className="h-4 w-4" />
                    <span className="text-[11px] tracking-wider">
                      {t("addProduct")}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "text-dim hover:text-cream hover:bg-raised/60 transition-colors rounded-none border-l-2 rtl:border-l-0 rtl:border-r-2",
                    pathName === "/admin/products/new-type"
                      ? "border-sienna text-cream bg-raised/60"
                      : "border-transparent",
                  )}
                >
                  <Link href="/admin/products/new-type" title={t("newType")}>
                    <Layers className="h-4 w-4" />
                    <span className="text-[11px] tracking-wider">
                      {t("newType")}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-3 my-1 h-px bg-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[8px] tracking-[0.3em] uppercase text-muted px-3 py-2">
            {t("configurationLabel")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => {
                const isSelected = pathName === item.path;
                const label = t(item.key);
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "text-dim hover:text-cream hover:bg-raised/60 transition-colors rounded-none border-l-2 rtl:border-l-0 rtl:border-r-2",
                        isSelected
                          ? "border-sienna text-cream bg-raised/60"
                          : "border-transparent",
                      )}
                    >
                      <Link href={item.path} title={label}>
                        <item.icon className="h-4 w-4" />
                        <span className="text-[11px] tracking-wider">
                          {label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-dim hover:text-cream text-[11px] tracking-wider">
                  <User2 className="h-4 w-4" />
                  {t("admin")}
                  <ChevronUp className="ml-auto rtl:ml-0 rtl:mr-auto h-3.5 w-3.5" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-surface border-border"
              >
                <DropdownMenuItem className="text-dim hover:text-cream text-xs">
                  {t("account")}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-[#8b4040] hover:text-cream hover:bg-[#8b4040]/20 text-xs">
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
