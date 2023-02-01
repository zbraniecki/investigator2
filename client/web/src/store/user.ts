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
  setUserWatchlists,
  addUserWatchlist,
} from "../api/user";
import {
  fetchHoldingsThunk,
  createHolding,
  updateHolding,
} from "../api/holding";
import { createTransaction } from "../api/transaction";
import {
  Watchlist,
  Portfolio,
  Session,
  Account,
  Holding,
  User,
  AuthenticateState,
  Transaction,
} from "../types";
import { getFromLocalStorage } from "./main";
import { setFetchEntitiesReducer } from "./helpers";
import { assert } from "../utils/helpers";

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

export const setUserWatchlistsThunk = createAsyncThunk(
  "user/setUserWatchlists",
  setUserWatchlists
);

export const addUserWatchlistThunk = createAsyncThunk(
  "user/addUserWatchlist",
  addUserWatchlist
);

interface AccountState {
  session: Session;
  portfolios: Record<string, Portfolio> | undefined;
  watchlists: Record<string, Watchlist> | undefined;
  accounts: Record<string, Account> | undefined;
  holdings: Record<string, Holding> | undefined;
  users: Record<string, User> | undefined;
}

const initialState = {
  session: {
    authenticateState: AuthenticateState.None,
    token: getFromLocalStorage("token", "string", undefined),
    user_pk: getFromLocalStorage("user_pk", "string", undefined),
  },
  portfolios: undefined,
  watchlists: undefined,
  accounts: undefined,
  holdings: undefined,
  users: undefined,
} as AccountState;

function cleanSlice(state: any) {
  state.session.authenticateState = AuthenticateState.None;
  state.session.user_pk = undefined;
  state.session.token = undefined;
  state.portfolios = undefined;
  state.watchlists = undefined;
  state.accounts = undefined;
  state.holdings = undefined;
  state.users = undefined;
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
    setFetchEntitiesReducer(
      builder,
      fetchAccountsThunk,
      "accounts",
      (account: Account) => {
        account.transactions.forEach((transaction: Transaction) => {
          transaction.timestamp = new Date(transaction.timestamp);
        });
      }
    );
    setFetchEntitiesReducer(
      builder,
      fetchUsersThunk,
      "users",
      undefined,
      (state, action) => {
        if (action.payload === null) {
          state.session.authenticateState = AuthenticateState.Error;
          state.session.token = undefined;
          state.session.user_pk = undefined;
        }
      }
    );

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
        return;
      }
      const { pk, quantity } = action.payload;
      if (state.holdings) {
        state.holdings[pk].quantity = quantity;
      }
    });
    builder.addCase(createHoldingThunk.fulfilled, (state, action) => {
      const account = action.payload.account as string;
      if (state.holdings) {
        state.holdings[action.payload.pk] = {
          pk: action.payload.pk,
          asset: action.payload.asset,
          quantity: action.payload.quantity,
          account,
        };
      }
      if (state.accounts) {
        state.accounts[account].holdings.push(action.payload.pk);
      }
    });
    builder.addCase(createTransactionThunk.fulfilled, (state, action) => {
      const account = action.payload.account as string;
      if (state.accounts) {
        state.accounts[account].transactions.push(action.payload);
      }
    });
    builder.addCase(updateUserInfoThunk.fulfilled, (state, action) => {
      if (state.users) {
        state.users[action.payload.pk] = action.payload;
      }
    });
    builder.addCase(setUserWatchlistsThunk.fulfilled, (state, action) => {
      const userPk = state.session.user_pk;
      assert(userPk);
      assert(state.users);
      const user = state.users[userPk];
      assert(user);
      user.visible_lists.watchlists = action.payload;
    });
    builder.addCase(addUserWatchlistThunk.fulfilled, (state, action) => {
      const watchlist = action.payload;

      if (!state.watchlists) {
	state.watchlists = {};
      }
      state.watchlists[watchlist.pk] = watchlist;

      const userPk = state.session.user_pk;
      assert(userPk);
      assert(state.users);
      const user = state.users[userPk];
      assert(user);
      user.visible_lists.watchlists.push(watchlist.pk);
    });
  },
});

export const getPortfolios = (state: any) => state.user.portfolios;
export const getUserWatchlists = (state: any) => state.user.watchlists;
export const getHoldings = (state: any) => state.user.holdings;
export const getSession = (state: any) => state.user.session;
export const getUsers = (state: any) => state.user.users;
export const getAccounts = (state: any) => state.user.accounts;
export const { setAuthenticateState } = userSlice.actions;

export default userSlice.reducer;
