/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAssetInfo, fetchWallets, fetchWatchlists } from "../api/oracle";

export const fetchAssetInfoThunk = createAsyncThunk(
  "oracle/fetchAssetInfo",
  fetchAssetInfo
);

export const fetchWalletsThunk = createAsyncThunk(
  "oracle/fetchWallets",
  fetchWallets
);

export const fetchWatchlistsThunk = createAsyncThunk(
  "oracle/fetchWatchlists",
  fetchWatchlists
);

export interface Watchlist {
  id: string;
  name: string;
  type: "dynamic";
  assets: [];
}

export interface AssetInfo {
  symbol: string;
  name: string;
  pair: [string, string];
  value: number;
  high_24h: number;
  low_24h: number;
  market_cap_rank: number;
  market_cap: number;
  market_cap_change_percentage_24h: number;
  price_change_percentage_1h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  image: string;
  last_updated: string;
}

export interface WalletAsset {
  symbol: string;
  apy: number;
  yield_type: "ST" | "LP" | "INT";
}

export interface Wallet {
  id: string;
  name: string;
  currency: WalletAsset[];
  type: "WALT" | "CHAC" | "SAAC" | "INAC" | "REAC" | "CRAC" | "LOAN";
}

interface OracleState {
  assets: AssetInfo[];
  wallets: Wallet[];
  watchlists: Watchlist[];
}

const initialState = {
  assets: [],
  wallets: [],
  watchlists: [],
} as OracleState;

export const oracleSlice = createSlice({
  name: "oracle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssetInfoThunk.fulfilled, (state, action) => {
      state.assets = action.payload;
    });
    builder.addCase(fetchWalletsThunk.fulfilled, (state, action) => {
      state.wallets = action.payload;
    });
    builder.addCase(fetchWatchlistsThunk.fulfilled, (state, action) => {
      state.watchlists = action.payload;
    });
  },
});

export const getAssetInfo = (state: any) => state.oracle.assets;
export const getWallets = (state: any) => state.oracle.wallets;
export const getWatchlists = (state: any) => state.oracle.watchlists;

export default oracleSlice.reducer;
