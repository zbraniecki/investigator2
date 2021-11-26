import { BASE_URL } from "./main";

export const fetchPortfolios = async (userId: number) => {
  const resp = await fetch(`${BASE_URL}account/portfolio/?owner=${userId}`);
  return resp.json();
};

export const fetchWatchlists = async () => {
  const resp = await fetch(`${BASE_URL}account/watchlist/`);
  return resp.json();
};

export const authenticate = async ({
  username,
  password,
  handleClose,
}: {
  username: string;
  password: string;
  handleClose: any;
}) => {
  if (username === "zibi" && password === "pass") {
    handleClose();
    return "sess5g";
  }
  return "error";
};
