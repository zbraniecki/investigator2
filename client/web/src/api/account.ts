import { createEntry } from "./helpers";

export const createTransaction = createEntry.bind(
  undefined,
  "user/transactions/"
);
