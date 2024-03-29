import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchPortfoliosThunk,
  fetchWatchlistsThunk,
  fetchAccountsThunk,
  fetchUsersThunk,
  fetchHoldingsThunk,
  fetchAssetsThunk,
  fetchServicesThunk,
  fetchPublicWatchlistsThunk,
  fetchTagsThunk,
  fetchCategoriesThunk,
  fetchStrategiesThunk,
  fetchTargetsThunk,
  fetchTargetChangesThunk,
} from "../api";
import { useAppDispatch, getSession } from "../store";
import { Chrome } from "./ui/Chrome";

export function App() {
  const dispatch = useAppDispatch();
  const session = useSelector(getSession);

  useEffect(() => {
    Promise.all([
      dispatch(fetchAssetsThunk()),
      dispatch(fetchPublicWatchlistsThunk()),
      dispatch(fetchTagsThunk()),
      dispatch(fetchCategoriesThunk()),
      dispatch(fetchServicesThunk()),
    ]);
  });

  useEffect(() => {
    if (session.token) {
      const p = dispatch(
        fetchUsersThunk({ token: session.token })
      ) as unknown as Promise<any>;
      p.then(() =>
        Promise.all([
          dispatch(fetchPortfoliosThunk({ token: session.token })),
          dispatch(fetchAccountsThunk({ token: session.token })),
          dispatch(fetchHoldingsThunk({ token: session.token })),
          dispatch(fetchStrategiesThunk({ token: session.token })),
          dispatch(fetchWatchlistsThunk({ token: session.token })),
          dispatch(fetchTargetsThunk({ token: session.token })),
          dispatch(fetchTargetChangesThunk({ token: session.token })),
        ])
      );
    }
  }, [session.token, session.user_pk, session.authenticateState]);

  return <Chrome />;
}
