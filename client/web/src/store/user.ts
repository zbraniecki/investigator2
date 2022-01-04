/* eslint camelcase: "off" */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPortfoliosThunk,
  fetchWatchlistsThunk,
  fetchAccountsThunk,
  fetchUsersThunk,
  authenticate,
  logout,
  updateUserInfo,
} from "../api/user";
import {
  fetchHoldingsThunk,
  createHolding,
  updateHolding,
} from "../api/holding";
import { createTransaction } from "../api/account";
import {
  Watchlist,
  Portfolio,
  Session,
  Account,
  Holding,
  User,
  AuthenticateState,
} from "../types";
import { getFromLocalStorage } from "./main";
import { setFetchEntitiesReducer } from "./helpers";

export const authenticateThunk = createAsyncThunk(
  "user/authenticate",
  authenticate
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

interface AccountState {
  session: Session;
  portfolios: Record<string, Portfolio>;
  watchlists: Record<string, Watchlist>;
  accounts: Record<string, Account>;
  holdings: Record<string, Holding>;
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
  holdings: {},
  users: {},
} as AccountState;

function cleanSlice(state: any) {
  state.session.authenticateState = AuthenticateState.None;
  state.session.user_pk = undefined;
  state.session.token = undefined;
  state.portfolios = {};
  state.watchlists = {};
  state.accounts = {};
  state.holdings = {};
  state.users = {};
}

const userSlice = createSlice({
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
    setFetchEntitiesReducer(builder, fetchPortfoliosThunk, "portfolios");
    setFetchEntitiesReducer(builder, fetchHoldingsThunk, "holdings");
    setFetchEntitiesReducer(builder, fetchWatchlistsThunk, "watchlists");
    setFetchEntitiesReducer(builder, fetchAccountsThunk, "accounts");
    setFetchEntitiesReducer(builder, fetchUsersThunk, "users");

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
    builder.addCase(updateHoldingThunk.fulfilled, (state, action) => {
      if (action.payload.error !== null) {
        console.log(`action failed`);
        return;
      }
      const { pk, quantity } = action.payload;
      state.holdings[pk].quantity = quantity;
    });
    builder.addCase(createHoldingThunk.fulfilled, (state, action) => {
      const account = action.payload.account as string;
      state.holdings[action.payload.pk] = {
        pk: action.payload.pk,
        asset: action.payload.asset,
        quantity: action.payload.quantity,
        account,
      };
      state.accounts[account].holdings.push(action.payload.pk);
    });
    builder.addCase(updateUserInfoThunk.fulfilled, (state, action) => {
      state.users[action.payload.pk] = action.payload;
    });
  },
});

export const getPortfolios = (state: any) => state.user.portfolios;
export const getWatchlists = (state: any) => state.user.watchlists;
export const getHoldings = (state: any) => state.user.holdings;
export const getSession = (state: any) => state.user.session;
export const getUsers = (state: any) => state.user.users;
export const getAccounts = (state: any) => state.user.accounts;
export const { setAuthenticateState } = userSlice.actions;

export default userSlice.reducer;
