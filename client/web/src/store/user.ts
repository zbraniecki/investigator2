/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPortfolios,
  fetchWatchlists,
  fetchAccounts,
  authenticate,
  logout,
  fetchUserInfo,
  updateUserInfo,
} from "../api/user";
import { createHolding, updateHolding } from "../api/holding";
import { createTransaction } from "../api/account";
import { Watchlist } from "./oracle";
import { getFromLocalStorage } from "./main";

export const fetchPortfoliosThunk = createAsyncThunk(
  "user/fetchPortfolios",
  fetchPortfolios
);

export const fetchWatchlistsThunk = createAsyncThunk(
  "user/fetchWatchlists",
  fetchWatchlists
);

export const fetchAccountsThunk = createAsyncThunk(
  "user/fetchAccounts",
  fetchAccounts
);

export const authenticateThunk = createAsyncThunk(
  "user/authenticate",
  authenticate
);

export const fetchUserInfoThunk = createAsyncThunk(
  "user/userInfo",
  fetchUserInfo
);

export const logoutThunk = createAsyncThunk("user/logout", logout);

export const updateHoldingThunk = createAsyncThunk(
  "user/updateHolding",
  updateHolding
);

export const createHoldingThunk = createAsyncThunk(
  "user/createHolding",
  createHolding
);

export const updateUserInfoThunk = createAsyncThunk(
  "user/updateUserInfo",
  updateUserInfo
);

export const createTransactionThunk = createAsyncThunk(
  "user/createTransaction",
  createTransaction
);

export interface Transaction {
  pk: string;
  account: string;
  asset: string;
  type: string;
  quantity: number;
  timestamp: string;
}

export interface Holding {
  pk: string;
  asset: string;
  quantity: number;
  account?: string;
}

export interface Portfolio {
  pk: string;
  name: string;
  holdings: Holding[];
  portfolios: string[];
  accounts: string[];
  tags: string[];
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

export interface Account {
  pk: string;
  owner: string;
  name: string;
  service: string;
  holdings: Holding[];
  transactions: Transaction[];
}

export enum AuthenticateState {
  None,
  Authenticating,
  Session,
  Error,
}

export interface Session {
  authenticateState: AuthenticateState;
  token?: string;
  user_pk?: string;
}

interface AccountState {
  session: Session;
  portfolios: Record<string, Portfolio>;
  watchlists: Record<string, Watchlist>;
  accounts: Record<string, Account>;
  users: Record<string, User>;
}

const initialState = {
  session: {
    authenticateState: AuthenticateState.None,
    token: getFromLocalStorage("token", "string", undefined),
    user_pk: getFromLocalStorage("user_pk", "string", undefined),
  },
  portfolios: {},
  watchlists: {},
  accounts: {},
  users: {},
} as AccountState;

function cleanSlice(state: any) {
  state.session.authenticateState = AuthenticateState.None;
  state.session.user_pk = undefined;
  state.session.token = undefined;
  state.portfolios = {};
  state.watchlists = {};
  state.accounts = {};
  state.users = {};
}

export const userSlice = createSlice({
  name: "user",
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
        state.portfolios[item.pk] = item;
      }
    });
    builder.addCase(fetchWatchlistsThunk.fulfilled, (state, action) => {
      state.watchlists = {};
      for (const item of action.payload) {
        state.watchlists[item.id] = item;
      }
    });
    builder.addCase(fetchAccountsThunk.fulfilled, (state, action) => {
      state.accounts = {};
      for (const item of action.payload) {
        state.accounts[item.pk] = item;
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
    builder.addCase(updateHoldingThunk.fulfilled, (state, action) => {
      if (action.payload.error !== null) {
        console.log(`action failed`);
        return;
      }
      const { pk, quantity } = action.payload;
      for (const account of Object.values(state.accounts)) {
        for (const holding of account.holdings) {
          if (holding.pk === pk) {
            holding.quantity = quantity;
          }
        }
      }
    });
    builder.addCase(createHoldingThunk.fulfilled, (state, action) => {
      const account = action.payload.account as string;
      state.accounts[account].holdings.push({
        pk: action.payload.pk,
        asset: action.payload.asset,
        quantity: action.payload.quantity,
        account,
      });
    });
    builder.addCase(updateUserInfoThunk.fulfilled, (state, action) => {
      state.users[action.payload.pk] = action.payload;
    });
  },
});

export const getPortfolios = (state: any) => state.user.portfolios;
export const getWatchlists = (state: any) => state.user.watchlists;
export const getSession = (state: any) => state.user.session;
export const getUsers = (state: any) => state.user.users;
export const getAccounts = (state: any) => state.user.accounts;
export const { setAuthenticateState } = userSlice.actions;

export default userSlice.reducer;
