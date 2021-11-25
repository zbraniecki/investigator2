import { BASE_URL } from "./main";

export const fetchPortfolios = async (userId: number) => {
  const resp = await fetch(`${BASE_URL}account/portfolio/?owner=${userId}`);
  return resp.json();
};

export const fetchWatchlists = async () => {
  const resp = await fetch(`${BASE_URL}account/watchlist/`);
  return resp.json();
};
