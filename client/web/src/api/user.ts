import { makeAsyncThunk, fetchEntries, fetchAuthEntriesType } from "./helpers";
import { BASE_URL } from "./main";
import { assert } from "../utils/helpers";
import { Watchlist, Portfolio, Account, User, Holding, Transaction } from "../types";

const fetchPortfolios = fetchEntries.bind(undefined, "user/portfolios/", {
  tags: (input: Array<string>) => new Set(input),
}) as fetchAuthEntriesType<Portfolio>;
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

export const setUserWatchlists = async ({
  token,
  uid,
  wids,
}: {
  token: string;
  uid: string;
  wids: string[];
}): Promise<string[]> => {
  const params = {
    wids,
  };

  const data = await fetch(`${BASE_URL}user/users/${uid}/watchlists/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params),
  });
  const resp = await data.json();

  return wids;
};

export const addUserWatchlist = async ({
  token,
  watchlist,
}: {
  token: string;
  watchlist: Partial<Watchlist>;
}): Promise<Watchlist> => {
  const params = {
    name: watchlist.name,
    type: watchlist.type,
    portfolio: watchlist.portfolio,
    assets: [],
  };

  const data = await fetch(`${BASE_URL}user/watchlists/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params),
  });
  const resp = await data.json();

  return resp;
};

export const deleteUserWatchlist = async ({
  token,
  wid,
}: {
  token: string;
  wid: string;
}): Promise<string> => {
  const params = {
    wid,
  };

  const data = await fetch(`${BASE_URL}user/watchlists/${wid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params),
  });
  const resp = await data.text();

  return wid;
};

export const addHolding = async ({
  token,
  holding,
}: {
  token: string;
  holding: Partial<Holding>;
}): Promise<Holding> => {
  const params = {
    asset: holding.asset,
    account: holding.account,
    quantity: holding.quantity,
    owner: holding.owner,
  };

  const data = await fetch(`${BASE_URL}user/holdings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params),
  });
  const resp = await data.json();

  return resp;
};
