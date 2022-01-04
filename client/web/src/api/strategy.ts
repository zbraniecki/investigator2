import { makeAsyncThunk, fetchEntries, fetchAuthEntriesType } from "./helpers";
import { Strategy } from "../types";

const fetchStrategies = fetchEntries.bind(
  undefined,
  "strategy/list/"
) as fetchAuthEntriesType<Strategy>;

export const fetchStrategiesThunk = makeAsyncThunk(
  "strategy/fetchList",
  fetchStrategies
);
