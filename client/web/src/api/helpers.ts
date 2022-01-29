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
}) => Promise<E[]>;
export type fetchPublicEntriesType<E> = (input?: {
  token?: string;
  args?: Args;
}) => Promise<E[]>;

export const fetchEntries = async <E>(
  path: string,
  converters?: Record<string, (input: any) => any>,
  params?: { token?: string; args?: Args }
): Promise<E[]> => {
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
  const data = await fetch(`${BASE_URL}${path}${query}`, {
    method: "GET",
    headers,
  });
  const resp = await data.json();

  if (converters) {
    for (const key in converters) {
      for (const item of resp) {
        if (item.hasOwnProperty(key)) {
          item[key] = converters[key](item[key]);
        }
      }
    }
  }
  return resp;
};

export function makeAsyncThunk<E>(name: string, fn: fetchPublicEntriesType<E>) {
  return createAsyncThunk(name, fn);
}
