/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPortfolios,
  fetchWatchlists,
  authenticate,
  logout,
} from "../api/account";
import { Watchlist } from "./oracle";
import { getFromLocalStorage } from "./main";

export const fetchPortfoliosThunk = createAsyncThunk(
  "account/fetchPortfolios",
  fetchPortfolios
);

export const fetchWatchlistsThunk = createAsyncThunk(
  "account/fetchWatchlists",
  fetchWatchlists
);

export const authenticateThunk = createAsyncThunk(
  "account/authenticate",
  authenticate
);

export const logoutThunk = createAsyncThunk("account/logout", logout);

export interface Holding {
  symbol: string;
  quantity: number;
  account: string;
}

export interface PortfolioItem {
  meta: {
    type: "asset-group" | "asset" | "portfolio" | "wallet-group";
    id: string;
    symbol?: string;
    name?: string;
    price?: number;
    quantity?: number;
    value: number;
    wallet?: string;
    yield?: number;
    price_change_percentage_24h?: number;
  };
  children: PortfolioItem[] | null;
}

export interface PortfolioEntryMeta {
  value: number;
  yield: number;
  price_change_percentage_24h: number;
  items: PortfolioItem[];
}

export interface PortfolioEntry {
  id: string;
  name: string;
  holdings: Holding[];
  portfolios: string[];
}

export enum AuthenticateState {
  None,
  Authenticating,
  Session,
  Error,
}

interface AccountState {
  session: {
    authenticateState: AuthenticateState;
    token?: string;
    username?: string;
    email?: string;
  };
  portfolios: PortfolioEntry[];
  meta: Record<string, PortfolioEntryMeta>;
  watchlists: Watchlist[];
}

const initialState = {
  session: {
    authenticateState: getFromLocalStorage(
      "authState",
      "enum",
      AuthenticateState.None
    ),
    token: getFromLocalStorage("token", "string", undefined),
    username: getFromLocalStorage("username", "string", undefined),
  },
  portfolios: [],
  meta: {},
  watchlists: [],
} as AccountState;

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setPortfoliosMeta: (
      state,
      { payload }: { payload: Record<string, PortfolioEntryMeta> }
    ) => {
      state.meta = payload;
    },
    setAuthenticateState: (
      state,
      { payload }: { payload: AuthenticateState }
    ) => {
      state.session.authenticateState = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPortfoliosThunk.fulfilled, (state, action) => {
      state.portfolios = action.payload;
    });
    builder.addCase(fetchWatchlistsThunk.fulfilled, (state, action) => {
      state.watchlists = action.payload;
    });
    builder.addCase(authenticateThunk.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.session.authenticateState = AuthenticateState.Error;
        state.session.email = undefined;
        state.session.username = undefined;
        state.session.token = undefined;
      } else {
        state.session.authenticateState = AuthenticateState.Session;
        state.session.email = action.payload.email;
        state.session.username = action.payload.username;
        state.session.token = action.payload.token;
      }
    });
    builder.addCase(logoutThunk.fulfilled, (state, action) => {
      state.session.authenticateState = AuthenticateState.None;
      state.session.email = undefined;
      state.session.username = undefined;
      state.session.token = undefined;
    });
  },
});

export const getPortfolios = (state: any) => state.account.portfolios;
export const getPortfolioMeta = (state: any) => state.account.meta;
export const getWatchlists = (state: any) => state.account.watchlists;
export const getSession = (state: any) => state.account.session;
export const { setPortfoliosMeta, setAuthenticateState } = accountSlice.actions;

export default accountSlice.reducer;
