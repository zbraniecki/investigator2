import { BASE_URL } from "./main";

export const fetchAssetInfo = async () => {
  const resp = await fetch(`${BASE_URL}oracle/assets`);
  return resp.json();
};

export const fetchWallets = async () => {
  const resp = await fetch(`${BASE_URL}oracle/wallets`);
  return resp.json();
};
