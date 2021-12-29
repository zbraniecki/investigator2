import { BASE_URL } from "./main";
import { assert } from "../utils/helpers";
import { User } from "../store/user";

export const fetchPortfolios = async ({ token }: { token: string }) => {
  const p = new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
  await p;
  const data = await fetch(`${BASE_URL}user/portfolios/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return data.json();
};

export const fetchWatchlists = async ({ token }: { token: string }) => {
  const data = await fetch(`${BASE_URL}user/watchlist/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return data.json();
};

export const fetchAccounts = async ({ token }: { token: string }) => {
  const data = await fetch(`${BASE_URL}user/accounts/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return data.json();
};

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

export const fetchUserInfo = async ({ token }: { token: string }) => {
  const p = new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
  await p;

  const data = await fetch(`${BASE_URL}user/users/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  const resp = await data.json();
  return resp;
};

export const updateCell = async ({
  token,
  id,
  quantity,
}: {
  token: string;
  id: string;
  quantity: number;
}) => {
  const params = {
    quantity,
  };

  const data = await fetch(`${BASE_URL}user/holding/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params),
  });
  const resp = await data.json();
  // error case?
  return {
    error: null,
    pk: resp.pk,
    quantity: resp.quantity,
  };
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
