import { BASE_URL } from "./main";
import { assert } from "../utils/helpers";

export const fetchPortfolios = async ({ token }: { token: string }) => {
  const data = await fetch(`${BASE_URL}profile/portfolio/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return data.json();
};

export const fetchWatchlists = async ({ token }: { token: string }) => {
  const data = await fetch(`${BASE_URL}profile/watchlist/`, {
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
      token: resp.key,
      username: resp.user.username,
      email: resp.user.email,
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
  const data = await fetch(`${BASE_URL}auth/user/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  const resp = await data.json();
  return resp;
};
