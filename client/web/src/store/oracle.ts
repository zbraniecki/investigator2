/* eslint camelcase: "off" */
import { createSlice } from "@reduxjs/toolkit";
import { Asset, Service, Watchlist, Category, Tag } from "../types";

import {
  fetchAssetsThunk,
  fetchServicesThunk,
  fetchPublicWatchlistsThunk,
  fetchTagsThunk,
  fetchCategoriesThunk,
} from "../api/oracle";
import { setFetchEntitiesReducer } from "./helpers";

interface OracleState {
  assetUpdated?: string;
  assets: Record<string, Asset>;
  services: Record<string, Service>;
  watchlists: Record<string, Watchlist>;
  taxonomies: {
    categories: Record<string, Category>;
    tags: Record<string, Tag>;
  };
}

const initialState = {
  assets: {},
  services: {},
  watchlists: {},
  taxonomies: {
    categories: {},
    tags: {},
  },
} as OracleState;

const oracleSlice = createSlice({
  name: "oracle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setFetchEntitiesReducer(builder, fetchAssetsThunk, "assets", (state) => {
      let lastUpdated = null;
      for (const asset of Object.values<Asset>(state.assets)) {
        if (asset.info.last_updated) {
          if (lastUpdated === null || lastUpdated < asset.info.last_updated) {
            lastUpdated = asset.info.last_updated;
          }
        }
      }
      if (lastUpdated !== null) {
        state.assetUpdated = lastUpdated;
      }
    });
    setFetchEntitiesReducer(builder, fetchServicesThunk, "services");
    setFetchEntitiesReducer(builder, fetchPublicWatchlistsThunk, "watchlists");
    setFetchEntitiesReducer(builder, fetchTagsThunk, "tags");
    setFetchEntitiesReducer(builder, fetchCategoriesThunk, "categories");
  },
});

export const getAssets = (state: any) => state.oracle.assets;
export const getAssetUpdated = (state: any): Date =>
  new Date(state.oracle.assetUpdated);
export const getServices = (state: any) => state.oracle.services;
export const getPublicWatchlists = (state: any) => state.oracle.watchlists;
export const getTaxonomies = (state: any) => state.oracle.taxonomies;

export default oracleSlice.reducer;
