"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

// import OrderCanvas from "./OrderCanvas";

type ProductImage = {
  url: string;
  place: string;
};

type OrderItem = {
  customization: Record<string, any>;
  product: {
    images: ProductImage[];
  };
};

export default function OrderCustomizationPreview({
  item,
}: {
  item: OrderItem;
}) {
  const t = useTranslations("AdminOrderCustomizationPreview");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const labelMap: Record<string, string> = {
    front: t("front"),
    back: t("back"),
    rightSleeve: t("rightSleeve"),
    leftSleeve: t("leftSleeve"),
  };

  const customizations = Object.entries(item.customization || {}).filter(
    ([, value]) => value !== null,
  );

  if (!customizations.length) {
    return (
      <p className="text-sm text-muted" dir={isRTL ? "rtl" : "ltr"}>
        {t("noCustomization")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6" dir={isRTL ? "rtl" : "ltr"}>
      {customizations.map(([place]) => {
        const productImage = item.product.images.find(
          (img) => img.place === place,
        )?.url;

        return (
          <div key={place} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-cream">
              {labelMap[place] || place}
            </h3>
            {productImage && (
              <div className="relative aspect-square border border-border bg-raised/40 overflow-hidden">
                <Image
                  src={productImage}
                  alt={labelMap[place] || place}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
