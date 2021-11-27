import { BASE_URL } from "./main";

export const fetchStrategies = async ({token}: {token: string}) => {
  const data = await fetch(`${BASE_URL}strategy/list/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return data.json();
};
