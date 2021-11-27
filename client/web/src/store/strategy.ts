/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrategies } from "../api/strategy";
import { logoutThunk } from "./account";

export const fetchStrategiesThunk = createAsyncThunk(
  "account/fetchStrategies",
  fetchStrategies
);

export interface Strategy {
  id: string;
  targets: Target[];
}

export interface Target {
  symbol: string;
  contains: string[];
  percent: number;
}

interface StrategyState {
  strategies: Strategy[];
}

const initialState = {
  strategies: [],
} as StrategyState;

export const strategySlice = createSlice({
  name: "strategy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStrategiesThunk.fulfilled, (state, action) => {
      state.strategies = action.payload;
    });
    builder.addCase(logoutThunk.fulfilled, (state, action) => {
      state.strategies = [];
    });
  },
});

export const getStrategies = (state: any) => state.strategy.strategies;

export default strategySlice.reducer;
