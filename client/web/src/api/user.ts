import { makeAsyncThunk, fetchEntries, fetchAuthEntriesType } from "./helpers";
import { BASE_URL } from "./main";
import { assert } from "../utils/helpers";
import { Watchlist, Portfolio, Account, User } from "../types";

const fetchPortfolios = fetchEntries.bind(
  undefined,
  "user/portfolios/",
  undefined
) as fetchAuthEntriesType<Portfolio>;
const fetchAccounts = fetchEntries.bind(
  undefined,
  "user/accounts/",
  undefined
) as fetchAuthEntriesType<Account>;
const fetchWatchlists = fetchEntries.bind(
  undefined,
  "user/watchlists/",
  undefined
) as fetchAuthEntriesType<Watchlist>;
const fetchUsers = fetchEntries.bind(
  undefined,
  "user/users/",
  undefined
) as fetchAuthEntriesType<User>;

export const fetchPortfoliosThunk = makeAsyncThunk(
  "user/fetchPortfolios",
  fetchPortfolios
);
export const fetchAccountsThunk = makeAsyncThunk(
  "user/fetchAccounts",
  fetchAccounts
);
export const fetchWatchlistsThunk = makeAsyncThunk(
  "user/fetchWatchlists",
  fetchWatchlists
);
export const fetchUsersThunk = makeAsyncThunk("user/fetchUsers", fetchUsers);

export const authenticate = async ({
  email,
  password,
  handleClose,
}: {
  email: string;
  password: string;
  handleClose: any;
}) => {
  const user = {
    email,
    password,
  };
  const data = await fetch(`${BASE_URL}auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const resp = await data.json();

  if (resp.key) {
    handleClose();
    return {
      pk: resp.user.pk,
      token: resp.key,
      username: resp.user.username,
    };
  }
  return {
    error: true,
  };
};

export const logout = async ({ token }: { token: string }) => {
  const data = await fetch(`${BASE_URL}auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  const resp = await data.json();
  assert(resp.detail);
};

export const updateUserInfo = async ({
  token,
  pk,
  baseAsset,
}: {
  token: string;
  pk: string;
  baseAsset: string;
}): Promise<User> => {
  const params = {
    base_asset: baseAsset,
  };

  const data = await fetch(`${BASE_URL}user/users/${pk}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params),
  });
  const resp = await data.json();

  return resp;
};
