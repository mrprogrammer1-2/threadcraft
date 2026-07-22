import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Process from "@/components/sections/Process";
import Marquee from "@/components/Marquee";
import Featured from "@/components/sections/Featured";
import Gallery from "@/components/sections/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Custom embroidered apparel — upload your design or choose from curated motifs. Hand-finished, premium embroidery on hoodies, shirts, caps and more.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Process />
      <Gallery />
      <WhyChooseUs />
      <div className="stitch-border" />
      <Featured />
    </>
  );
}
