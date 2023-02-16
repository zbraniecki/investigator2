const pfmt = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const nfmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 5,
});

const cfmt = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const fracfmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const dtfmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
});

export function currency(input: any): string {
  return cfmt.format(input);
}
export function number(input: any): string {
  return nfmt.format(input);
}
export function percent(input: any): string {
  if (input === undefined) {
    return "";
  }
  return pfmt.format(input);
}
export function symbol(input: any): string {
  return input.symbol.toUpperCase();
}

export function fraction(input: any): string {
  const v = 1 / input;
  return `1/${fracfmt.format(v)}`;
}
export function datetime(input: any): string {
  return dtfmt.format(input);
}
