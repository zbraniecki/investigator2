import { BASE_URL } from "./main";
import { assert } from "../utils/helpers";
import { Holding } from "../store/account";

export const createHolding = async ({
  token,
  assetId,
  quantity,
}: {
  token: string;
  assetId: string;
  quantity: number;
}): Promise<Holding> => {
  const params = {
    asset: assetId,
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
