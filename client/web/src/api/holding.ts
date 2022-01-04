import { BASE_URL } from "./main";
import { assert } from "../utils/helpers";
import { Holding } from "../store/user";

export const fetchHoldings = async ({ token }: { token: string }) => {
  const data = await fetch(`${BASE_URL}user/holdings/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return data.json();
};

export const createHolding = async ({
  token,
  assetPk,
  accountPk,
  ownerPk,
  quantity,
}: {
  token: string;
  assetPk: string;
  accountPk?: string;
  ownerPk: string;
  quantity: number;
}): Promise<Holding> => {
  const params = {
    asset: assetPk,
    account: accountPk,
    owner: ownerPk,
    quantity,
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
  console.log(resp);

  return resp;
};

export const updateHolding = async ({
  token,
  pk,
  quantity,
}: {
  token: string;
  pk: string;
  quantity: number;
}) => {
  const params = {
    quantity,
  };

  const data = await fetch(`${BASE_URL}user/holdings/${pk}/`, {
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
