export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg || condition);
  }
}

export function assertUnreachable(value: never): never {
  throw new Error(`This should never happen: ${value}.`);
}

export function tryParseNumber(input: string): number | undefined {
  if (input.length === 0) {
    return 0;
  }

  if (input === "-") {
    return -0;
  }
  const i = input.replace(",", "");
  const parsed = parseFloat(i.endsWith(".") ? `${i}0` : i);
  if (Number.isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}
