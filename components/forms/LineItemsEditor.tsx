"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { currency } from "@/lib/utils/currency";

type EditableLineItem = {
  description: string;
  quantity: number;
  unit_price_cents: number;
};

type LocalLineItem = EditableLineItem & {
  key: string;
};

export function LineItemsEditor({ initialItems = [] }: { initialItems?: EditableLineItem[] }) {
  const [items, setItems] = useState<LocalLineItem[]>(
    initialItems.length > 0
      ? initialItems.map((item) => ({ ...item, key: crypto.randomUUID() }))
      : [{ key: crypto.randomUUID(), description: "", quantity: 1, unit_price_cents: 0 }]
  );

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        return sum + Math.round(item.quantity * item.unit_price_cents);
      }, 0),
    [items]
  );

  return (
    <div className="space-y-3">
      <div className="hidden grid-cols-[1fr_120px_160px_48px] gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
        <span>Description</span>
        <span>Quantity</span>
        <span>Unit price</span>
        <span />
      </div>
      {items.map((item, index) => (
        <div key={item.key} className="grid gap-3 rounded-2xl border border-slate-200 p-3 md:grid-cols-[1fr_120px_160px_48px] md:border-0 md:p-0">
          <Input
            name="item_description"
            value={item.description}
            onChange={(event) => {
              const value = event.target.value;
              setItems((current) =>
                current.map((currentItem) =>
                  currentItem.key === item.key ? { ...currentItem, description: value } : currentItem
                )
              );
            }}
            placeholder="Excavation, grading, haul-off..."
            required={index === 0}
          />
          <Input
            name="item_quantity"
            type="number"
            min="0.01"
            step="0.01"
            value={item.quantity}
            onChange={(event) => {
              const value = Number(event.target.value);
              setItems((current) =>
                current.map((currentItem) =>
                  currentItem.key === item.key ? { ...currentItem, quantity: value } : currentItem
                )
              );
            }}
          />
          <Input
            name="item_unit_price"
            type="number"
            min="0"
            step="0.01"
            value={(item.unit_price_cents / 100).toString()}
            onChange={(event) => {
              const value = Math.round(Number(event.target.value || 0) * 100);
              setItems((current) =>
                current.map((currentItem) =>
                  currentItem.key === item.key ? { ...currentItem, unit_price_cents: value } : currentItem
                )
              );
            }}
          />
          <Button
            type="button"
            variant="ghost"
            className="px-3"
            onClick={() => setItems((current) => current.filter((currentItem) => currentItem.key !== item.key))}
            disabled={items.length === 1}
            aria-label="Remove line item"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setItems((current) => [
              ...current,
              { key: crypto.randomUUID(), description: "", quantity: 1, unit_price_cents: 0 }
            ])
          }
        >
          <Plus className="mr-2 size-4" />
          Add line item
        </Button>
        <p className="text-lg font-bold text-slate-950">Estimated total: {currency(total)}</p>
      </div>
    </div>
  );
}
