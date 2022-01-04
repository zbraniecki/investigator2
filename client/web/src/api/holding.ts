import {
  makeAsyncThunk,
  fetchEntries,
  createEntry,
  fetchAuthEntriesType,
  createEntryType,
} from "./helpers";
import { BASE_URL } from "./main";
import { Holding } from "../types";

const fetchHoldings = fetchEntries.bind(
  undefined,
  "user/holdings/"
) as fetchAuthEntriesType<Holding>;
export const createHolding = createEntry.bind(
  undefined,
  "user/holdings/"
) as createEntryType<Holding>;

export const fetchHoldingsThunk = makeAsyncThunk(
  "user/fetchHoldings",
  fetchHoldings
);

export const updateHolding = async ({
  token,
  pk,
  quantity,
}: {
  token: string;
  pk: string;
  quantity: number;
}) => {
  const params = {
    quantity,
  };

  const data = await fetch(`${BASE_URL}user/holdings/${pk}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params),
  });
  const resp = await data.json();
  // error case?
  return {
    error: null,
    pk: resp.pk,
    quantity: resp.quantity,
  };
};
