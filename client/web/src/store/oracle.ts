/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAssetInfo, fetchWallets } from "../api/oracle";

export const fetchAssetInfoThunk = createAsyncThunk(
  "oracle/fetchAssetInfo",
  fetchAssetInfo
);

export const fetchWalletsThunk = createAsyncThunk(
  "oracle/fetchWallets",
  fetchWallets
);

export interface AssetInfo {
  symbol: string;
  name: string;
  pair: [string, string];
  value: number;
  market_cap: number;
  price_change_percentage_24h: number;
  market_cap_change_percentage_24h: number;
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
}

const initialState = {
  assets: [],
  wallets: [],
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
  },
});

export const getAssetInfo = (state: any) => state.oracle.assets;
export const getWallets = (state: any) => state.oracle.wallets;

export default oracleSlice.reducer;
