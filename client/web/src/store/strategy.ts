/* eslint camelcase: "off" */

import { createSlice } from "@reduxjs/toolkit";
import { fetchStrategiesThunk } from "../api";
import { logoutThunk } from "./user";
import { Strategy } from "../types";
import { setFetchEntitiesReducer } from "./helpers";

interface StrategyState {
  strategies: Record<string, Strategy>;
}

const initialState = {
  strategies: {},
} as StrategyState;

const strategySlice = createSlice({
  name: "strategy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setFetchEntitiesReducer(builder, fetchStrategiesThunk, "strategies");
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.strategies = {};
    });
  },
});

export const getStrategies = (state: any) => state.strategy.strategies;

export default strategySlice.reducer;
