export function centsToDollars(cents: number) {
  return cents / 100;
}

export function currency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(centsToDollars(cents));
}

export function parseCurrencyToCents(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return 0;
  }

  const normalized = value.replace(/[$,\s]/g, "");
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return Math.round(amount * 100);
}
