import Hero from "@/components/sections/Hero";
import Process from "@/components/sections/Process";
import Marquee from "@/components/Marquee";
import Featured from "@/components/sections/Featured";
import Gallery from "@/components/sections/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";

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
