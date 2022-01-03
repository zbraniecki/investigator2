import { BASE_URL } from "./main";
import { assert } from "../utils/helpers";
import { Transaction } from "../store/user";

export const createTransaction = async ({
  token,
  accountPk,
  assetPk,
  type,
  quantity,
  timestamp,
}: {
  token: string;
  accountPk: string;
  assetPk: string;
  type: string;
  quantity: number;
  timestamp: Date;
}): Promise<Transaction> => {
  const params = {
    account: accountPk,
    asset: assetPk,
    type,
    quantity,
    timestamp: timestamp.toISOString(),
  };

  const data = await fetch(`${BASE_URL}user/transactions/`, {
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
