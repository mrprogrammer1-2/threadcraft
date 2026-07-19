import type { Metadata } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  DM_Mono,
  Geist,
} from "next/font/google";

import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/storeProvider";
import { CartHydrator } from "@/components/cartHydrator";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";
import CursorManager from "@/components/CursorManager";
import { ToastContainer } from "react-toastify";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThreadCraft",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        "min-h-full",
        playfair.variable,
        cormorant.variable,
        dmMono.variable,
        geist.variable,
        "font-sans",
        "antialiased",
      )}
    >
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <CursorManager />
          <CartHydrator />
          <ScrollProgressIndicator />

          {children}

          <ToastContainer position="bottom-right" theme="dark" />
        </Providers>
      </NextIntlClientProvider>
    </div>
  );
}
