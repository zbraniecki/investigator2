/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPortfolios, fetchWatchlists } from "../api/account";
import { Watchlist } from "./oracle";

export const fetchPortfoliosThunk = createAsyncThunk(
  "account/fetchPortfolios",
  fetchPortfolios
);

export const fetchWatchlistsThunk = createAsyncThunk(
  "account/fetchWatchlists",
  fetchWatchlists
);

export interface Holding {
  symbol: string;
  quantity: number;
  account: string;
}

export interface PortfolioItem {
  meta: {
    type: "asset-group" | "asset" | "portfolio" | "wallet-group";
    id: string;
    symbol?: string;
    name?: string;
    price?: number;
    quantity?: number;
    value: number;
    wallet?: string;
    yield?: number;
    price_change_percentage_24h?: number;
  };
  children: PortfolioItem[] | null;
}

export interface PortfolioEntryMeta {
  value: number;
  yield: number;
  price_change_percentage_24h: number;
  items: PortfolioItem[];
}

export interface PortfolioEntry {
  id: string;
  name: string;
  holdings: Holding[];
  portfolios: string[];
}

interface AccountState {
  portfolios: PortfolioEntry[];
  meta: Record<string, PortfolioEntryMeta>;
  watchlists: Watchlist[];
}

const initialState = {
  portfolios: [],
  meta: {},
  watchlists: [],
} as AccountState;

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setPortfoliosMeta: (
      state,
      { payload }: { payload: Record<string, PortfolioEntryMeta> }
    ) => {
      state.meta = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPortfoliosThunk.fulfilled, (state, action) => {
      state.portfolios = action.payload;
    });
    builder.addCase(fetchWatchlistsThunk.fulfilled, (state, action) => {
      state.watchlists = action.payload;
    });
  },
});

export const getPortfolios = (state: any) => state.account.portfolios;
export const getPortfolioMeta = (state: any) => state.account.meta;
export const getWatchlists = (state: any) => state.account.watchlists;
export const { setPortfoliosMeta } = accountSlice.actions;

export default accountSlice.reducer;
