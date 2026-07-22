import type { Metadata } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  DM_Mono,
  Geist,
} from "next/font/google";

import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
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

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === "ar"
      ? "ThreadCraft — استوديو تطريز مخصّص"
      : "ThreadCraft — Custom Embroidery Studio";

  const description =
    locale === "ar"
      ? "استوديو تطريز مخصّص — ارفع تصميمك، اختر قطعتك، ونحن نطرّزها بدقة. تطريز يدوي بلمسة احترافية."
      : "Custom embroidery studio — upload your design, choose your garment, and we'll embroider it with precision. Hand-finished custom apparel.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      siteName: "ThreadCraft",
      type: "website",
    },
    alternates: {
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    other: {
      "og:locale:alternate": locale === "ar" ? "en_US" : "ar_EG",
    },
  };
}

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
