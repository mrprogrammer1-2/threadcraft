"use client";

const items = [
  "Hand-Embroidered",
  "Premium Quality",
  "Custom Designs",
  "5–7 Day Delivery",
  "40+ Thread Colors",
  "Ships Worldwide",
];

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-(--thread) py-4.5">
      <div className="flex w-max animate-marquee">
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            className="whitespace-nowrap px-8 text-[11px] uppercase tracking-[0.25em] text-(--cream)"
          >
            {item}
            <span className="px-2 text-(--gold)">✦</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          to {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marqueeScroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
