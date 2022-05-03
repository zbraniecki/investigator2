export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg || condition);
  }
}

export function assertUnreachable(value: never): never {
  throw new Error(`This should never happen: ${value}.`);
}
