import { useSelector } from "react-redux";

import {
  //   fetchPortfoliosThunk,
  //   fetchWatchlistsThunk as fetchUserWatchlistsThunk,
  //   fetchUserInfoThunk,
  //   getPortfolios,
  getSession,
  //   AuthenticateState,
} from "../store/account";
// import {
//   fetchAssetInfoThunk,
//   fetchWalletsThunk,
//   fetchWatchlistsThunk as fetchPublicWatchlistsThunk,
//   getAssetInfo,
//   getWallets,
// } from "../../../store/oracle";
// import { fetchStrategiesThunk } from "../../../store/strategy";
import { Chrome } from "./ui/Chrome";

export function App() {
  const session = useSelector(getSession);
  // const dispatch = useDispatch();

  // const infoDisplayMode: InfoDisplayMode = useSelector(getInfoDisplayMode);

  // if (!session.username) {
  //   menuItems = menuItems.filter(item => !["strategies", "portfolios", "wallets"].includes(item.id));
  // }
  // useEffect(() => {
  //   dispatch(fetchAssetInfoThunk({}));
  //   dispatch(fetchPublicWatchlistsThunk());
  //   dispatch(fetchWalletsThunk());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (session.token && session.username === undefined) {
  //     dispatch(fetchUserInfoThunk({ token: session.token }));
  //   }
  // }, [dispatch, session.token, session.username]);

  // useEffect(() => {
  //   if (session.authenticateState === AuthenticateState.Session) {
  //     dispatch(fetchPortfoliosThunk({ token: session.token }));
  //     dispatch(fetchStrategiesThunk({ token: session.token }));
  //     dispatch(fetchUserWatchlistsThunk({ token: session.token }));
  //   }
  // }, [dispatch, session.authenticateState]);

  // const portfolios = useSelector(getPortfolios);
  // const assets = useSelector(getAssetInfo);
  // const wallets = useSelector(getWallets);

  return <Chrome />;
}
