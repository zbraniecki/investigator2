import {
  makeAsyncThunk,
  fetchEntries,
  fetchPublicEntriesType,
} from "./helpers";
import { Asset, Watchlist, Tag, Category, Service } from "../types";

const fetchAssets = fetchEntries.bind(
  undefined,
  "oracle/assets/",
  undefined
) as fetchPublicEntriesType<Asset>;
const fetchPublicWatchlists = fetchEntries.bind(
  undefined,
  "oracle/watchlists/",
  undefined
) as fetchPublicEntriesType<Watchlist>;
const fetchTags = fetchEntries.bind(
  undefined,
  "oracle/tags/",
  undefined
) as fetchPublicEntriesType<Tag>;
const fetchCategories = fetchEntries.bind(
  undefined,
  "oracle/categories/",
  undefined
) as fetchPublicEntriesType<Category>;
const fetchServices = fetchEntries.bind(
  undefined,
  "oracle/services/",
  undefined
) as fetchPublicEntriesType<Service>;

export const fetchAssetsThunk = makeAsyncThunk(
  "oracle/fetchAssets",
  fetchAssets
);
export const fetchPublicWatchlistsThunk = makeAsyncThunk(
  "oracle/fetchWatchlists",
  fetchPublicWatchlists
);
export const fetchTagsThunk = makeAsyncThunk("oracle/fetchTags", fetchTags);
export const fetchCategoriesThunk = makeAsyncThunk(
  "oracle/fetchCategories",
  fetchCategories
);
export const fetchServicesThunk = makeAsyncThunk(
  "oracle/fetchServices",
  fetchServices
);
