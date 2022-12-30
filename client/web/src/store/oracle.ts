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
  assets: Record<string, Asset> | undefined;
  services: Record<string, Service> | undefined;
  watchlists: Record<string, Watchlist> | undefined;
  categories: Record<string, Category> | undefined;
  tags: Record<string, Tag> | undefined;
}

const initialState = {
  assets: undefined,
  services: undefined,
  watchlists: undefined,
  categories: undefined,
  tags: undefined,
} as OracleState;

const oracleSlice = createSlice({
  name: "oracle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setFetchEntitiesReducer(
      builder,
      fetchAssetsThunk,
      "assets",
      undefined,
      (state, action) => {
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
      }
    );
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
export const getTags = (state: any) => state.oracle.tags;
export const getCategories = (state: any) => state.oracle.categories;

export default oracleSlice.reducer;
