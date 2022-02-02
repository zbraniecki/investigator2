import { createEntry, createEntryType } from "./helpers";
import { Transaction } from "../types";

export const createTransaction = createEntry.bind(
  undefined,
  "user/transactions/"
) as createEntryType<Transaction>;
