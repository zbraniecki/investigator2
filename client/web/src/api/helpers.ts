import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "./main";

export type createEntryType<E> = (input: {
  token: string;
  input: Omit<E, "pk">;
}) => Promise<E>;

export async function createEntry<E>(
  path: string,
  { token, input }: { token: string; input: Omit<E, "pk"> }
): Promise<E> {
  const data = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(input),
  });
  const resp = await data.json();

  return resp;
}

type Args = Record<string, string>;

export type fetchAuthEntriesType<E> = (input: {
  token: string;
  args?: Args;
}) => Promise<null | E[]>;
export type fetchPublicEntriesType<E> = (input?: {
  token?: string;
  args?: Args;
}) => Promise<null | E[]>;

export const fetchEntries = async <E>(
  path: string,
  converters?: Record<string, (input: any) => any>,
  params?: { token?: string; args?: Args }
): Promise<null | E[]> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  let query = "";
  if (params !== undefined) {
    headers.Authorization = `Token ${params.token}`;
    if (params.args) {
      query = `?${new URLSearchParams(params.args).toString()}`;
    }
  }
  const fullPath = `${BASE_URL}${path}${query}`;
  const resp = await fetch(fullPath, {
    method: "GET",
    headers,
  }).then((response) => {
    if (!response.ok) {
      console.log(`Error when fetching ${fullPath} - ${response.status}`);
      return null;
    }

    // XXX: Handle JSON errors
    return response.json();
  });

  if (converters) {
    Object.entries(converters).forEach(([key, converter]) => {
      for (const item of resp) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          item[key] = converter(item[key]);
        }
      }
    });
  }
  return resp;
};

export function makeAsyncThunk<E>(name: string, fn: fetchPublicEntriesType<E>) {
  return createAsyncThunk(name, fn);
}
