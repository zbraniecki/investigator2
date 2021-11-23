import { BASE_URL } from "./main";

export const fetchStrategies = async (userId: number) => {
  const resp = await fetch(`${BASE_URL}strategy/list/?user=${userId}`);
  return resp.json();
};
