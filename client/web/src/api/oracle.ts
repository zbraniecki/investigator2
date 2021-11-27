import { BASE_URL } from "./main";

export const fetchAssetInfo = async ({refresh, token}: {refresh?: boolean, token?: string}) => {
  if (refresh && token) {
    const data = await fetch(`${BASE_URL}oracle/assets/?refresh=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    return data.json();
  } else {
    const resp = await fetch(`${BASE_URL}oracle/assets/`);
    return resp.json();
  }
};

export const fetchWallets = async () => {
  const resp = await fetch(`${BASE_URL}oracle/wallets/`);
  return resp.json();
};

export const fetchWatchlists = async () => {
  const resp = await fetch(`${BASE_URL}oracle/watchlists/`);
  return resp.json();
};
