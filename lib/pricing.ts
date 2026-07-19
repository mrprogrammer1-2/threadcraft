// Pricing configuration for customization and add-ons
// All prices are in EGP (Egyptian Pound)

export const PRICING_CONFIG = {
  // Add-on prices
  addOns: {
    patch: {
      basePrice: 50, // EGP
    },
  },

  // Customization pricing
  customization: {
    // Price per side customized (in EGP)
    perSide: 100, // EGP per side
    // Maximum sides that can be customized
    maxSides: 4,
  },
};

// Helper function to calculate customization price
export function calculateCustomizationPrice(
  customization: Record<string, any> | null | undefined,
): number {
  if (!customization) return 0;

  const sidesCustomized = Object.keys(customization).filter(
    (key) => customization[key],
  ).length;

  return sidesCustomized * PRICING_CONFIG.customization.perSide;
}

// Helper function to calculate add-on price
export function calculateAddOnPrice(
  addOns: Array<{ id: string; price: number }> | null | undefined,
): number {
  if (!addOns || !Array.isArray(addOns)) return 0;

  return addOns.reduce((sum, addon) => sum + addon.price, 0);
}

// Helper function to calculate total item price
export function calculateItemPrice(
  basePrice: number,
  customization?: Record<string, string> | null,
  addOns?: Array<{ id: string; price: number }> | null,
): number {
  let price = basePrice;

  if (customization) {
    const sidesCustomized = Object.values(customization).filter(Boolean).length;
    price += sidesCustomized * 100; // 100 EGP per customized side
  }

  if (addOns && Array.isArray(addOns)) {
    price += addOns.reduce((sum, addon) => sum + addon.price, 0);
  }

  return price;
}
