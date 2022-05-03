import { useSelector } from "react-redux";
import { assert } from "./helpers";
import {
  Asset,
  Category,
  Watchlist,
  Portfolio,
  Holding,
  Account,
  Service,
  User,
  Strategy,
  Tag,
  Target,
  TargetChange,
} from "../types";
import {
  getCategories,
  getPortfolios,
  getUserWatchlists,
  getUsers,
  getServices,
  getTags,
  getStrategies,
  getHoldings,
  getAssets,
  getPublicWatchlists,
  getAccounts,
  getTargets,
  getTargetChanges,
} from "../store";

export interface DatabaseKey {
  accounts: Account;
  assets: Asset;
  categories: Category;
}

// export enum DatabaseKey {
// 	Accounts = "accounts",
// 	Assets = "assets",
// 	Categories = "categories",
// 	Holdings = "holdings",
// 	Portfolios = "portfolios",
// 	PublicWatchlists = "publicWatchlists",
// 	Services = "services",
// 	Session = "session",
// 	Strategies = "strategies",
// 	Tags = "tags",
// 	Targets = "targets",
// 	TargetChanges = "targetChanges",
// 	UserWatchlists = "userWatchlists",
// 	Users = "users",
// }

export interface DataState {
  accounts?: Record<string, Account>;
  assets?: Record<string, Asset>;
  categories?: Record<string, Category>;
  holdings?: Record<string, Holding>;
  portfolios?: Record<string, Portfolio>;
  publicWatchlists?: Record<string, Watchlist>;
  services?: Record<string, Service>;
  strategies?: Record<string, Strategy>;
  tags?: Record<string, Tag>;
  targets?: Record<string, Target>;
  targetChanges?: Record<string, TargetChange>;
  userWatchlists?: Record<string, Watchlist>;
  users?: Record<string, User>;
  watchlists?: Record<string, Watchlist>;
}

const methods: Record<keyof DataState, any> = {
  accounts: getAccounts,
  assets: getAssets,
  categories: getCategories,
  holdings: getHoldings,
  portfolios: getPortfolios,
  publicWatchlists: getPublicWatchlists,
  services: getServices,
  strategies: getStrategies,
  tags: getTags,
  targets: getTargets,
  targetChanges: getTargetChanges,
  userWatchlists: getUserWatchlists,
  watchlists: null,
  users: getUsers,
};

export function loadData(keys: Array<keyof DataState>): DataState {
  const result: DataState = {};
  keys.forEach((key) => {
    const method = methods[key];
    assert(method);
    result[key] = useSelector(method);
  });
  return result;
}

export function verifyDataState<K extends Array<keyof DataState>>(
  state: DataState,
  required: K
): Required<DataState> {
  for (const key of required) {
    assert(state[key]);
  }
  return state as unknown as Required<DataState>;
}
