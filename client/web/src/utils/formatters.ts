const pfmt = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const nfmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const cfmt = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function currency(input: any): string {
  return cfmt.format(input);
}
export function number(input: any): string {
  return nfmt.format(input);
}
export function percent(input: any): string {
  return pfmt.format(input);
}
export function symbol(input: any): string {
  return input.symbol.toUpperCase();
}
