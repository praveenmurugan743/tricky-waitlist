export const PRIZES = [
  {
    id: 0,
    label: "15% Off",
    shortLabel: "15% OFF",
    description: "15% off on purchases above ₹2,500 (max discount ₹1,000)",
    color: "#C8A96E",
    bg: "#1a0f00",
  },
  {
    id: 1,
    label: "Amazon Prime",
    shortLabel: "PRIME",
    description: "3 months free Amazon Prime on purchase above ₹5,000",
    color: "#FF9900",
    bg: "#0a1628",
  },
  {
    id: 2,
    label: "₹100 Voucher",
    shortLabel: "₹100",
    description: "₹100 voucher redeemable on any product",
    color: "#86efac",
    bg: "#052e16",
  },
  {
    id: 3,
    label: "₹500 Cash",
    shortLabel: "₹500",
    description: "₹500 cash prize — you hit the jackpot!",
    color: "#fbbf24",
    bg: "#1c0a00",
  },
];

// Weights: prize 0 = 15%, prize 1 = 15%, prize 2 = 69%, prize 3 = 1%
export function getWeightedPrizeIndex(): number {
  const randNUm = Math.random() * 100;
  if (randNUm < 1) return 3;
  if (randNUm < 16) return 0;
  if (randNUm < 31) return 1;
  return 2;
}
