"use client";

import { X } from "lucide-react";

type AddOn = {
  id: string;
  name: string;
  price: number;
  text?: string;
};

export default function AddOnModal({
  addOns,
  onClose,
}: {
  addOns: AddOn[];
  onClose: () => void;
}) {
  console.log("addon addon");
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal Card */}
        <div
          className="relative bg-white dark:bg-gradient-to-b dark:from-[#1a1d2e] dark:to-[#141623] border border-gray-100 dark:border-white/[0.07] rounded-2xl shadow-xl dark:shadow-none w-full max-w-sm overflow-hidden mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400 dark:text-gray-500">
                Add-ons
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            {addOns.map((addOn) => (
              <div
                key={addOn.id}
                className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/25 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-purple-900 dark:text-purple-100">
                    📌 {addOn.name}
                  </p>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    {addOn.price} EGP
                  </span>
                </div>

                {addOn.text && (
                  <div className="bg-white dark:bg-white/[0.05] border border-purple-100 dark:border-purple-500/15 rounded p-3">
                    <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 dark:text-gray-500 mb-1.5">
                      Custom Text
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 break-words">
                      {addOn.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
