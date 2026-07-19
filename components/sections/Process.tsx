import ProcessStep from "../ProcessStep";
import { getTranslations } from "next-intl/server";

export default async function Process() {
  const t = await getTranslations("HowItWorks");

  const steps = [
    {
      num: "01",
      icon: "🎽",
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      num: "02",
      icon: "🎨",
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      num: "03",
      icon: "🧵",
      title: t("step3Title"),
      description: t("step3Desc"),
    },
    {
      num: "04",
      icon: "📦",
      title: t("step4Title"),
      description: t("step4Desc"),
    },
  ];

  return (
    <section className="p-10 sm:p-16 lg:p-[120px_80px] bg-(--ink) text-(--cream)">
      <h4 className="text-[10px] tracking-[0.35em] uppercase mb-10 sm:mb-12 lg:mb-[60px] text-(--gold) flex items-center gap-4">
        {t("eyebrow")}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#333] border-t border-[#333]">
        {steps.map((step) => (
          <ProcessStep key={step.num} {...step} />
        ))}
      </div>
    </section>
  );
}
