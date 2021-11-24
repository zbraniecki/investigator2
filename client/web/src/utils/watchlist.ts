import { AssetInfo, Watchlist } from "../store/oracle";
import { getAsset } from "./asset";
import { assert } from "./helpers";

export function getWatchlist(
  id: string,
  watchlists: Watchlist[]
): Watchlist | null {
  for (const watchlist of watchlists) {
    if (watchlist.id === id) {
      return watchlist;
    }
  }
  return null;
}

export interface WatchlistItem {
  meta: {
    type: "asset";
    market_cap_rank: number;
    id: string;
    symbol: string;
    name: string;
    price: number;
    price_change_percentage_1h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
  children: null;
}

export function calculateWatchlistItems(
  wid: string,
  watchlists: Watchlist[],
  assetInfo: AssetInfo[]
): WatchlistItem[] {
  const items: WatchlistItem[] = [];

  const watchlist = getWatchlist(wid, watchlists);
  if (watchlist === null || assetInfo.length === 0) {
    return [];
  }

  for (const symbol of watchlist.assets) {
    const asset = getAsset(symbol, assetInfo);
    assert(asset, `Missing asset: ${symbol}`);

    items.push({
      meta: {
        type: "asset",
        market_cap_rank: asset.market_cap_rank,
        id: asset.symbol,
        symbol: asset.symbol,
        name: asset.name,
        price: asset.value,
        price_change_percentage_1h: asset.price_change_percentage_1h,
        price_change_percentage_24h: asset.price_change_percentage_24h,
        price_change_percentage_7d: asset.price_change_percentage_7d,
        price_change_percentage_30d: asset.price_change_percentage_30d,
      },
      children: null,
    });
  }

  return items;
}

export interface WatchlistTableRow {
  cells: {
    market_cap_rank: number;
    symbol: string;
    name: string;
    price: number;
    price_change_percentage_1h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
  children?: WatchlistTableRow[];
}

function prepareWatchlistTableGroup(
  items: WatchlistItem[]
): WatchlistTableRow[] {
  const result: WatchlistTableRow[] = [];

  for (const item of items) {
    result.push({
      cells: {
        market_cap_rank: item.meta.market_cap_rank,
        symbol: item.meta.symbol,
        name: item.meta.name,
        price: item.meta.price,
        price_change_percentage_1h: item.meta.price_change_percentage_1h / 100,
        price_change_percentage_24h:
          item.meta.price_change_percentage_24h / 100,
        price_change_percentage_7d: item.meta.price_change_percentage_7d / 100,
        price_change_percentage_30d:
          item.meta.price_change_percentage_30d / 100,
      },
    });
  }

  return result;
}

export function prepareWatchlistTableData(
  wid: string,
  watchlists: Watchlist[],
  assetInfo: AssetInfo[]
): WatchlistTableRow[] {
  const items = calculateWatchlistItems(wid, watchlists, assetInfo);

  return prepareWatchlistTableGroup(items);
}
