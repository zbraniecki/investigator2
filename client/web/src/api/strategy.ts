import {
  makeAsyncThunk,
  fetchEntries,
  createEntry,
  fetchAuthEntriesType,
  createEntryType,
} from "./helpers";
import { BASE_URL } from "./main";
import { Strategy, Target, TargetChange } from "../types";

const fetchStrategies = fetchEntries.bind(
  undefined,
  "strategy/list/",
  undefined
) as fetchAuthEntriesType<Strategy>;

const fetchTargets = fetchEntries.bind(
  undefined,
  "strategy/targets/",
  undefined
) as fetchAuthEntriesType<Target>;

const fetchTargetChanges = fetchEntries.bind(undefined, "strategy/changes/", {
  timestamp: (input: string) => new Date(input),
}) as fetchAuthEntriesType<TargetChange>;

export const fetchStrategiesThunk = makeAsyncThunk(
  "strategy/fetchList",
  fetchStrategies
);

export const fetchTargetsThunk = makeAsyncThunk(
  "strategy/targets",
  fetchTargets
);

export const fetchTargetChangesThunk = makeAsyncThunk(
  "strategy/changes",
  fetchTargetChanges
);

export const updateTarget = async ({
  token,
  pk,
  percent,
}: {
  token: string;
  pk: string;
  percent: number;
}) => {
  const params = {
    percent,
  };

  const data = await fetch(`${BASE_URL}strategy/targets/${pk}/`, {
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
    percent: resp.percent,
  };
};

export const createTargetChange = createEntry.bind(
  undefined,
  "strategy/changes/"
) as createEntryType<TargetChange>;

export const updateTargetChange = async ({
  token,
  pk,
  change,
  timestamp,
}: {
  token: string;
  pk: string;
  change: number;
  timestamp: Date;
}) => {
  const params = {
    change,
    timestamp: timestamp.toISOString(),
  };

  const data = await fetch(`${BASE_URL}strategy/changes/${pk}/`, {
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
    change: resp.change,
    timestamp: new Date(resp.timestamp),
  };
};
