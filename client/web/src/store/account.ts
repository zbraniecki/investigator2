/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPortfolios } from "../api/account";

export const fetchPortfoliosThunk = createAsyncThunk(
  "account/fetchPortfolios",
  fetchPortfolios
);

export interface Holding {
  symbol: string;
  quantity: number;
  account: string;
}

export interface PortfolioEntryMeta {
  value: number;
  yield: number;
  price_change_percentage_24h: number;
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
}

const initialState = {
  portfolios: [],
  meta: {},
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
  },
});

export const getPortfolios = (state: any) => state.account.portfolios;
export const getPortfolioMeta = (state: any) => state.account.meta;
export const { setPortfoliosMeta } = accountSlice.actions;

export default accountSlice.reducer;
