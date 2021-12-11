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
  portfolio?: string;
}

export interface AssetInfo {
  id: string;
  symbol: string;
  name: string;
  info: {
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
  };
}

export interface WalletAsset {
  id: string;
  apy: number;
  yield_type: "ST" | "LP" | "INT";
}

export interface Wallet {
  id: string;
  name: string;
  assets: WalletAsset[];
  type: "WALT" | "CHAC" | "SAAC" | "INAC" | "REAC" | "CRAC" | "LOAN";
}

interface OracleState {
  assetUpdated?: string;
  assets: Record<string, AssetInfo>;
  wallets: Record<string, Wallet>;
  watchlists: Record<string, Watchlist>;
}

const initialState = {
  assets: {},
  wallets: {},
  watchlists: {},
} as OracleState;

export const oracleSlice = createSlice({
  name: "oracle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssetInfoThunk.fulfilled, (state, action) => {
      for (const item of action.payload) {
        if (item.info.last_updated) {
          state.assetUpdated = item.info.last_updated;
          break;
        }
      }
      state.assets = {};
      for (const item of action.payload) {
        state.assets[item.id] = item;
      }
    });
    builder.addCase(fetchWalletsThunk.fulfilled, (state, action) => {
      for (const item of action.payload) {
        state.wallets[item.id] = item;
      }
    });
    builder.addCase(fetchWatchlistsThunk.fulfilled, (state, action) => {
      for (const item of action.payload) {
        state.watchlists[item.id] = item;
      }
    });
  },
});

export const getAssetInfo = (state: any) => state.oracle.assets;
export const getAssetUpdated = (state: any): Date =>
  new Date(state.oracle.assetUpdated);
export const getWallets = (state: any) => state.oracle.wallets;
export const getWatchlists = (state: any) => state.oracle.watchlists;

export default oracleSlice.reducer;
