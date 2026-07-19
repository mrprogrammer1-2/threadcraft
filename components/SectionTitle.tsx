import React from "react";

export default function SectionTitle({
  text1,
  text2,
}: {
  text1: string;
  text2: string;
}) {
  return (
    <h1 className="leading-none font-black mb-8 font-family-playfair text-[clamp(52px,6vw,88px)] [&_em]:italic [&_em]:text-(--sienna) [&_em]:block [&_em]:font-semibold">
      {text1} <br />
      <em>{text2}</em>
    </h1>
  );
}
