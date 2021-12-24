import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPortfoliosThunk,
  fetchWatchlistsThunk as fetchUserWatchlistsThunk,
  fetchUserInfoThunk,
  getSession,
} from "../store/account";
import {
  fetchAssetInfoThunk,
  fetchWalletsThunk,
  fetchWatchlistsThunk as fetchPublicWatchlistsThunk,
  getAssetInfo,
} from "../store/oracle";
import { fetchStrategiesThunk } from "../store/strategy";
import { Chrome } from "./ui/Chrome";

export function App() {
  const dispatch = useDispatch();
  const session = useSelector(getSession);
  const assetInfo = useSelector(getAssetInfo);

  useEffect(() => {
    console.log("in effect");
    if (session.token) {
      console.log("fetching user info");
      const p = dispatch(
        fetchUserInfoThunk({ token: session.token })
      ) as unknown as Promise<any>;
      p.then(async () => {
        console.log("Fetched info, fetching portfolio");
        dispatch(fetchPortfoliosThunk({ token: session.token }));
        dispatch(fetchStrategiesThunk({ token: session.token }));
        dispatch(fetchUserWatchlistsThunk({ token: session.token }));
        console.log("Fetched user stuff");
      });
    }
  }, [session.token, session.user_pk, session.authenticateState]);

  useEffect(() => {
    if (Object.keys(assetInfo).length === 0) {
      console.log("fetching public studd");
      const p = Promise.all([
        dispatch(fetchAssetInfoThunk({})),
        dispatch(fetchPublicWatchlistsThunk()),
        dispatch(fetchWalletsThunk()),
      ]);
      p.then(() => {
        console.log("fetched public stuff");
      });
    }
  });

  // if (!session.username) {
  //   menuItems = menuItems.filter(item => !["strategies", "portfolios", "wallets"].includes(item.id));
  // }

  return <Chrome />;
}
