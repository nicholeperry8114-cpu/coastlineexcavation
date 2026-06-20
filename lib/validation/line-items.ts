import { parseCurrencyToCents } from "@/lib/utils/currency";

export type LineItemInput = {
  description: string;
  quantity: number;
  unit_price_cents: number;
  sort_order: number;
};

export function parseLineItems(formData: FormData): LineItemInput[] {
  const descriptions = formData.getAll("item_description");
  const quantities = formData.getAll("item_quantity");
  const prices = formData.getAll("item_unit_price");

  return descriptions
    .map((description, index) => {
      const text = typeof description === "string" ? description.trim() : "";
      const quantityValue = quantities[index];
      const quantity =
        typeof quantityValue === "string" && Number.isFinite(Number(quantityValue))
          ? Number(quantityValue)
          : 1;

      return {
        description: text,
        quantity: Math.max(quantity, 0.01),
        unit_price_cents: parseCurrencyToCents(prices[index] || null),
        sort_order: index
      };
    })
    .filter((item) => item.description.length > 0);
}
