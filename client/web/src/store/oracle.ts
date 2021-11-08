/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAssetInfo } from "../api/oracle";

export const fetchAssetInfoThunk = createAsyncThunk(
  "oracle/fetchAssetInfo",
  fetchAssetInfo
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

interface OracleState {
  assets: AssetInfo[];
}

const initialState = {
  assets: [],
} as OracleState;

export const oracleSlice = createSlice({
  name: "oracle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssetInfoThunk.fulfilled, (state, action) => {
      state.assets = action.payload;
    });
  },
});

export const getAssetInfo = (state: any) => state.oracle.assets;

export default oracleSlice.reducer;
