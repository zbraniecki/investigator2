import { BASE_URL } from "./main";

export const fetchAssetInfo = async ({
  refresh,
  token,
}: {
  refresh?: boolean;
  token?: string;
}) => {
  if (refresh && token) {
    const data = await fetch(`${BASE_URL}oracle/assets/?refresh=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    return data.json();
  }
  const resp = await fetch(`${BASE_URL}oracle/assets/`);
  return resp.json();
};

export const fetchServices = async () => {
  const resp = await fetch(`${BASE_URL}oracle/services/`);
  return resp.json();
};

export const fetchWatchlists = async () => {
  const resp = await fetch(`${BASE_URL}oracle/watchlists/`);
  return resp.json();
};

export const fetchTaxonomies = async () => {
  const resp = await fetch(`${BASE_URL}oracle/taxonomy/`);
  return resp.json();
};
