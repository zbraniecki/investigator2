/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchStrategiesThunk,
  fetchTargetsThunk,
  fetchTargetChangesThunk,
} from "../api";
import { logoutThunk } from "./user";
import { Strategy, Target, TargetChange } from "../types";
import { setFetchEntitiesReducer } from "./helpers";
import {
  updateTarget,
  createTargetChange,
  updateTargetChange,
} from "../api/strategy";

export const updateTargetThunk = createAsyncThunk(
  "strategy/updateTarget",
  updateTarget
);

export const createTargetChangeThunk = createAsyncThunk(
  "strategy/createTargetChange",
  createTargetChange
);

export const updateTargetChangeThunk = createAsyncThunk(
  "strategy/updateTargetChange",
  updateTargetChange
);

interface StrategyState {
  strategies: Record<string, Strategy>;
  targets: Record<string, Target>;
  changes: Record<string, TargetChange>;
}

const initialState = {
  strategies: {},
  targets: {},
  changes: {},
} as StrategyState;

const strategySlice = createSlice({
  name: "strategy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setFetchEntitiesReducer(builder, fetchStrategiesThunk, "strategies");
    setFetchEntitiesReducer(builder, fetchTargetsThunk, "targets");
    setFetchEntitiesReducer(builder, fetchTargetChangesThunk, "changes");
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.strategies = {};
    });
    builder.addCase(updateTargetThunk.fulfilled, (state, action) => {
      if (action.payload.error !== null) {
        return;
      }
      const { pk, percent } = action.payload;
      state.targets[pk].percent = percent;
    });
    builder.addCase(createTargetChangeThunk.fulfilled, (state, action) => {
      const item = action.payload;
      item.timestamp = new Date(item.timestamp);
      state.changes[action.payload.pk] = item;
    });
    builder.addCase(updateTargetChangeThunk.fulfilled, (state, action) => {
      state.changes[action.payload.pk].change = action.payload.change;
      state.changes[action.payload.pk].timestamp = action.payload.timestamp;
    });
  },
});

export const getStrategies = (state: any) => state.strategy.strategies;
export const getTargets = (state: any) => state.strategy.targets;
export const getTargetChanges = (state: any) => state.strategy.changes;

export default strategySlice.reducer;
