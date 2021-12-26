/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPortfolios,
  fetchWatchlists,
  authenticate,
  logout,
  fetchUserInfo,
  updateCell,
  updateUserInfo,
} from "../api/account";
import { createHolding } from "../api/holding";
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

export const updateCellThunk = createAsyncThunk(
  "account/portfolio/update/cell",
  updateCell
);

export const createHoldingThunk = createAsyncThunk(
  "account/createHolding",
  createHolding
);

export const updateUserInfoThunk = createAsyncThunk(
  "account/updateUserInfo",
  updateUserInfo
);

export interface Holding {
  pk: string;
  asset_id: string;
  quantity: number;
  account?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  holdings: Holding[];
  portfolios: string[];
  value?: number;
}

export interface User {
  pk: string;
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
    user_pk?: string;
  };
  portfolios: Record<string, Portfolio>;
  watchlists?: Record<string, Watchlist>;
  users: Record<string, User>;
}

const initialState = {
  session: {
    authenticateState: AuthenticateState.None,
    token: getFromLocalStorage("token", "string", undefined),
    user_pk: getFromLocalStorage("user_pk", "string", undefined),
  },
  portfolios: {},
  users: {},
} as AccountState;

function cleanSlice(state: any) {
  state.session.authenticateState = AuthenticateState.None;
  state.session.user_pk = undefined;
  state.session.token = undefined;
  state.portfolios = {};
  state.watchlists = undefined;
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
        state.session.user_pk = action.payload.pk;
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
        state.users[item.pk] = item;
      }
    });
    builder.addCase(updateCellThunk.fulfilled, (state, action) => {
      if (action.payload.error !== null) {
        console.log(`action failed`);
        return;
      }
      const { pk, quantity } = action.payload;
      for (const portfolio of Object.values(state.portfolios)) {
        for (const holding of portfolio.holdings) {
          if (holding.pk === pk) {
            console.log("Updating quantity");
            holding.quantity = quantity;
          }
        }
      }
      console.log("STATUS UPDATED");
    });
    builder.addCase(createHoldingThunk.fulfilled, (state, action) => {
      console.log("Created new holding");
      console.log(action);
    });
    builder.addCase(updateUserInfoThunk.fulfilled, (state, action) => {
      state.users[action.payload.pk] = action.payload;
    });
  },
});

export const getPortfolios = (state: any) => state.account.portfolios;
export const getWatchlists = (state: any) => state.account.watchlists;
export const getSession = (state: any) => state.account.session;
export const getUsers = (state: any) => state.account.users;
export const { setAuthenticateState } = accountSlice.actions;

export default accountSlice.reducer;
