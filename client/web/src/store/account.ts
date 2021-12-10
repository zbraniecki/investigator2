/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPortfolios,
  fetchWatchlists,
  authenticate,
  logout,
  fetchUserInfo,
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

export const fetchUserInfoThunk = createAsyncThunk(
  "account/user",
  fetchUserInfo
);

export const logoutThunk = createAsyncThunk("account/logout", logout);

export interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  account: string;
}

export interface Portfolio {
  id: string;
  name: string;
  holdings: Holding[];
  portfolios: string[];
  value?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  ui: {
    portfolios: string[];
    watchlists: string[];
    strategies: string[];
  };
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
  };
  portfolios: Record<string, Portfolio>;
  watchlists: Record<string, Watchlist>;
  users: Record<string, User>;
}

const initialState = {
  session: {
    authenticateState: AuthenticateState.None,
    token: getFromLocalStorage("token", "string", undefined),
  },
  portfolios: {},
  watchlists: {},
  users: {},
} as AccountState;

function cleanSlice(state: any) {
  state.session.authenticateState = AuthenticateState.None;
  state.session.username = undefined;
  state.session.token = undefined;
  state.portfolios = {};
  state.watchlists = {};
  state.users = {};
}

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAuthenticateState: (
      state,
      { payload }: { payload: AuthenticateState }
    ) => {
      state.session.authenticateState = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPortfoliosThunk.fulfilled, (state, action) => {
      state.portfolios = {};
      for (const item of action.payload) {
        // XXX: Switch to undefined in Serializer
        if (item.value === null) {
          item.value = undefined;
        }
        state.portfolios[item.id] = item;
      }
    });
    builder.addCase(fetchWatchlistsThunk.fulfilled, (state, action) => {
      state.watchlists = {};
      for (const item of action.payload) {
        state.watchlists[item.id] = item;
      }
    });
    builder.addCase(authenticateThunk.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.session.authenticateState = AuthenticateState.Error;
        state.session.token = undefined;
      } else {
        state.session.authenticateState = AuthenticateState.Session;
        state.session.token = action.payload.token;
      }
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      cleanSlice(state);
    });
    builder.addCase(fetchUserInfoThunk.fulfilled, (state, action) => {
      if (action.payload.detail) {
        cleanSlice(state);
        return;
      }

      state.users = {};
      for (const item of action.payload) {
        state.users[item.username] = item;
        if (state.session.username === undefined && item.current) {
          state.session.username = item.username;
          state.session.authenticateState = AuthenticateState.Session;
        }
      }
    });
  },
});

export const getPortfolios = (state: any) => state.account.portfolios;
export const getWatchlists = (state: any) => state.account.watchlists;
export const getSession = (state: any) => state.account.session;
export const getUsers = (state: any) => state.account.users;
export const { setAuthenticateState } = accountSlice.actions;

export default accountSlice.reducer;
