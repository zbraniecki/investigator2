import { AssetInfo, Watchlist } from "../store/oracle";
import { PortfolioEntry } from "../store/account";
import { getAsset } from "./asset";
import { getPortfolio } from "./portfolio";
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
  assetInfo: AssetInfo[],
  portfolios: PortfolioEntry[]
): WatchlistItem[] {
  const items: WatchlistItem[] = [];

  const watchlist = getWatchlist(wid, watchlists);
  if (watchlist === null || assetInfo.length === 0) {
    return [];
  }

  const symbols: Set<string> = new Set(watchlist.assets);

  if (watchlist.portfolio) {
    const portfolio = getPortfolio(watchlist.portfolio, portfolios);
    assert(portfolio);

    for (const holding of portfolio.holdings) {
      symbols.add(holding.symbol);
    }
  }

  for (const symbol of symbols) {
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

  items.sort((a, b) => {
    const amcap = a.meta.market_cap_rank;
    const bmcap = b.meta.market_cap_rank;
    if (!amcap) {
      return 1;
    }
    if (!bmcap) {
      return -1;
    }
    return a.meta.market_cap_rank - b.meta.market_cap_rank;
  });

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

export interface WatchlistMeta {
  value_change_1h: number;
  value_change_24h: number;
  value_change_7d: number;
  value_change_30d: number;
}

export function calculateWatchlistMeta(
  wid: string,
  watchlists: Watchlist[],
  assetInfo: AssetInfo[],
  portfolios: PortfolioEntry[]
): WatchlistMeta {
  const result = {
    value_change_1h: 0,
    value_change_24h: 0,
    value_change_7d: 0,
    value_change_30d: 0,
  };

  const items = calculateWatchlistItems(wid, watchlists, assetInfo, portfolios);

  let totalMcap = 0;

  for (const item of items) {
    const asset = getAsset(item.meta.symbol, assetInfo);
    assert(asset, `Missing asset: ${item.meta.symbol}`);

    totalMcap += asset.market_cap;
  }

  for (const item of items) {
    const asset = getAsset(item.meta.symbol, assetInfo);
    assert(asset, `Missing asset: ${item.meta.symbol}`);

    const perc = asset.market_cap / totalMcap;
    result.value_change_1h += (asset.price_change_percentage_1h * perc) / 100;
    result.value_change_24h += (asset.price_change_percentage_24h * perc) / 100;
    result.value_change_7d += (asset.price_change_percentage_7d * perc) / 100;
    result.value_change_30d += (asset.price_change_percentage_30d * perc) / 100;
  }

  return result;
}

export function prepareWatchlistTableData(
  wid: string,
  watchlists: Watchlist[],
  assetInfo: AssetInfo[],
  portfolios: PortfolioEntry[]
): WatchlistTableRow[] {
  const items = calculateWatchlistItems(wid, watchlists, assetInfo, portfolios);

  return prepareWatchlistTableGroup(items);
}
