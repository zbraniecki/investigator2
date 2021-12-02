import { AssetInfo, Watchlist } from "../store/oracle";
import { Portfolio } from "../store/account";
import { getAsset } from "./asset";
import { assert } from "./helpers";
import { DataRowProps, SymbolNameCell } from "../views/components/Table";

export interface WatchlistTableRow extends DataRowProps {
  cells: {
    market_cap_rank?: number;
    name?: SymbolNameCell | string;
    price?: number;
    price_change_percentage_1h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
  children?: WatchlistTableRow[];
}

export function prepareWatchlistTableData(
  wid: string,
  watchlists: Record<string, Watchlist>,
  assetInfo: Record<string, AssetInfo>,
  portfolios: Record<string, Portfolio>,
): {headerRow?: WatchlistTableRow, data: WatchlistTableRow[]} {
  const result: WatchlistTableRow[] = [];

  if (Object.keys(assetInfo).length === 0) {
    return {data: result};
  }

  let watchlist = watchlists[wid];
  assert(watchlist);

  let header = {
    market_cap: 0,
    price_change_percentage_1h: 0,
    price_change_percentage_24h: 0,
    price_change_percentage_7d: 0,
    price_change_percentage_30d: 0,
  };

  const symbols: Set<string> = new Set(watchlist.assets);

  if (watchlist.portfolio) {
    const portfolio = portfolios[watchlist.portfolio];
    if (portfolio !== undefined) {
      for (const holding of portfolio.holdings) {
        symbols.add(holding.id);
      }
    }
  }

  for (const symbol of symbols) {
    const asset = assetInfo[symbol];
    assert(asset, `Missing asset: ${symbol}`);

    header.market_cap += asset.info.market_cap;

    result.push({
      cells: {
        market_cap_rank: asset.info.market_cap_rank,
        name: {
          symbol: asset.symbol,
          name: asset.name,
        },
        price: asset.info.value,
        price_change_percentage_1h: asset.info.price_change_percentage_1h,
        price_change_percentage_24h: asset.info.price_change_percentage_24h,
        price_change_percentage_7d: asset.info.price_change_percentage_7d,
        price_change_percentage_30d: asset.info.price_change_percentage_30d,
      },
    });
  }

  for (const symbol of symbols) {
    const asset = assetInfo[symbol];
    assert(asset, `Missing asset: ${symbol}`);

    let perc = asset.info.market_cap / header.market_cap;

    header.price_change_percentage_1h += asset.info.price_change_percentage_1h * perc;
    header.price_change_percentage_24h += asset.info.price_change_percentage_24h * perc;
    header.price_change_percentage_7d += asset.info.price_change_percentage_7d * perc;
    header.price_change_percentage_30d += asset.info.price_change_percentage_30d * perc;
  }

  return {
    headerRow: {
      cells: {
        price_change_percentage_1h: header.price_change_percentage_1h,
        price_change_percentage_24h: header.price_change_percentage_24h,
        price_change_percentage_7d: header.price_change_percentage_7d,
        price_change_percentage_30d: header.price_change_percentage_30d,
      }
    },
    data: result,
  };
}
