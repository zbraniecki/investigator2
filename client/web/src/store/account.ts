import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPortfolios } from "../api/account";

export const fetchPortfoliosThunk = createAsyncThunk(
  "account/fetchPortfolios",
  fetchPortfolios
);

export interface Holding {
  symbol: string;
  quantity: number;
  account: string;
}

export interface PortfolioEntry {
  id: string;
  name: string;
  holdings: Holding[];
}

interface AccountState {
  portfolios: PortfolioEntry[];
}

const initialState = {
  portfolios: [],
} as AccountState;

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPortfoliosThunk.fulfilled, (state, action) => {
      state.portfolios = action.payload;
    });
  },
});

export const getPortfolios = (state: any) => state.account.portfolios;

export default accountSlice.reducer;
