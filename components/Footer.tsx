import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-[#1a1310] text-[#f3ede5] py-16 px-6 md:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="text-[22px] font-black uppercase tracking-[0.3em] text-[#fff] mb-4 inline-block"
          >
            {t("brandName")}
          </Link>
          <p className="text-sm leading-7 text-[#d9cfc4] max-w-[420px] mt-4">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h3 className="text-[11px] tracking-[0.35em] uppercase text-[#A0522D] mb-5 font-mono">
            {t("exploreTitle")}
          </h3>
          <ul className="space-y-3 text-sm text-[#d9cfc4]">
            <li>
              <Link href="/shop" className="hover:text-white">
                {t("shop")}
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-white">
                {t("gallery")}
              </Link>
            </li>
            <li>
              <Link href="/process" className="hover:text-white">
                {t("process")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                {t("about")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] tracking-[0.35em] uppercase text-[#A0522D] mb-5 font-mono">
            {t("contactTitle")}
          </h3>
          <p className="text-sm leading-7 text-[#d9cfc4]">
            {t("email")}
            <br />
            {t("shippingNote")}
            <br />
            {t("craftedNote")}
          </p>
        </div>
      </div>

      <div className="mt-16 border-t border-[#3d3127]/40 pt-8 text-sm text-[#a69488] text-center">
        © {new Date().getFullYear()} {t("copyright")}
      </div>
    </footer>
  );
}
