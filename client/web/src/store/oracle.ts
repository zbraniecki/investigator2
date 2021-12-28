/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAssetInfo,
  fetchWallets,
  fetchWatchlists,
  fetchTaxonomies,
} from "../api/oracle";

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

export const fetchTaxonomiesThunk = createAsyncThunk(
  "oracle/fetchTaxonomies",
  fetchTaxonomies
);

export interface Watchlist {
  id: string;
  name: string;
  type: "dynamic";
  assets: [];
  portfolio?: string;
}

export interface AssetInfo {
  pk: string;
  symbol: string;
  name: string;
  asset_class: string;
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

export interface Category {
  pk: string;
  name: string;
  slug: string;
  parent?: string;
}

export interface Tag {
  pk: string;
  name: string;
  slug: string;
  category?: string;
}

interface OracleState {
  assetUpdated?: string;
  assets: Record<string, AssetInfo>;
  wallets: Record<string, Wallet>;
  watchlists: Record<string, Watchlist>;
  taxonomies: {
    categories: Record<string, Category>;
    tags: Record<string, Tag>;
  };
}

const initialState = {
  assets: {},
  wallets: {},
  watchlists: {},
  taxonomies: {
    categories: {},
    tags: {},
  },
} as OracleState;

export const oracleSlice = createSlice({
  name: "oracle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssetInfoThunk.fulfilled, (state, action) => {
      let lastUpdated = null;
      for (const item of action.payload) {
        if (item.info.last_updated) {
          if (lastUpdated === null || lastUpdated < item.info.last_updated) {
            lastUpdated = item.info.last_updated;
          }
        }
      }

      if (lastUpdated !== null) {
        state.assetUpdated = lastUpdated;
      }
      state.assets = {};
      for (const item of action.payload) {
        state.assets[item.pk] = item;
      }
    });
    builder.addCase(fetchWalletsThunk.fulfilled, (state, action) => {
      for (const item of action.payload) {
        state.wallets[item.pk] = item;
      }
    });
    builder.addCase(fetchWatchlistsThunk.fulfilled, (state, action) => {
      for (const item of action.payload) {
        state.watchlists[item.pk] = item;
      }
    });
    builder.addCase(fetchTaxonomiesThunk.fulfilled, (state, action) => {
      state.taxonomies = action.payload;
    });
  },
});

export const getAssetInfo = (state: any) => state.oracle.assets;
export const getAssetUpdated = (state: any): Date =>
  new Date(state.oracle.assetUpdated);
export const getWallets = (state: any) => state.oracle.wallets;
export const getWatchlists = (state: any) => state.oracle.watchlists;
export const getTaxonomies = (state: any) => state.oracle.taxonomies;

export default oracleSlice.reducer;
