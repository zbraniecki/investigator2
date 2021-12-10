import { AssetInfo, Watchlist } from "../store/oracle";
import { Portfolio } from "../store/account";
import { assert } from "./helpers";
import { DataRowProps, SymbolNameCell } from "../views/components/Table";

export interface WatchlistTableRow extends DataRowProps {
  cells: {
    market_cap_rank?: number;
    market_cap?: number;
    name?: SymbolNameCell | string;
    price?: number;
    price_change_percentage_1h?: number;
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
  };
  children?: WatchlistTableRow[];
  type: "portfolio" | "asset";
}

function computeHeaderData(
  watchlist: Watchlist,
  data: WatchlistTableRow[]
): WatchlistTableRow["cells"] {
  const cells = {
    price_change_percentage_1h: 0,
    price_change_percentage_24h: 0,
    price_change_percentage_7d: 0,
    price_change_percentage_30d: 0,
  };

  const totalMcap = data.reduce(
    (total, curr) => total + (curr.cells.market_cap || 0),
    0
  );

  data.forEach((row) => {
    if (row.cells.market_cap === undefined) {
      return;
    }
    const perc = row.cells.market_cap / totalMcap;
    if (row.cells.price_change_percentage_1h) {
      cells.price_change_percentage_1h +=
        row.cells.price_change_percentage_1h * perc;
    }
    if (row.cells.price_change_percentage_24h) {
      cells.price_change_percentage_24h +=
        row.cells.price_change_percentage_24h * perc;
    }
    if (row.cells.price_change_percentage_7d) {
      cells.price_change_percentage_7d +=
        row.cells.price_change_percentage_7d * perc;
    }
    if (row.cells.price_change_percentage_30d) {
      cells.price_change_percentage_30d +=
        row.cells.price_change_percentage_30d * perc;
    }
  });

  return cells;
}

function getAssetsFromPortfolio(
  portfolio: Portfolio,
  portfolios: Record<string, Portfolio>
): Set<string> {
  const symbols: Set<string> = new Set();
  for (const holding of portfolio.holdings) {
    symbols.add(holding.id);
  }
  for (const pid of portfolio.portfolios) {
    const p = portfolios[pid];
    assert(p);
    const subset = getAssetsFromPortfolio(p, portfolios);
    subset.forEach(symbols.add, symbols);
  }
  return symbols;
}

export function createWatchlistTableData(
  watchlist: Watchlist,
  watchlists: Record<string, Watchlist>,
  assetInfo: Record<string, AssetInfo>,
  portfolios: Record<string, Portfolio>,
): WatchlistTableRow {
  const symbols: Set<string> = new Set(watchlist.assets);

  if (watchlist.portfolio) {
    const portfolio = portfolios[watchlist.portfolio];
    assert(portfolio);
    const subset = getAssetsFromPortfolio(portfolio, portfolios);
    subset.forEach(symbols.add, symbols);
  }

  const rows: WatchlistTableRow[] = Array.from(symbols).map((symbol) => {
    const asset = assetInfo[symbol];
    assert(asset, `Missing asset: ${symbol}`);

    return {
      cells: {
        market_cap_rank: asset.info.market_cap_rank,
        market_cap: asset.info.market_cap,
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
      type: "asset",
    };
  });

  const cells = computeHeaderData(watchlist, rows);

  return {
    cells,
    children: rows.length > 0 ? rows : undefined,
    type: "asset",
  };
}

export function prepareWatchlistTableData(
  wid: string,
  watchlists: Record<string, Watchlist>,
  assetInfo: Record<string, AssetInfo>,
  portfolios: Record<string, Portfolio>
): WatchlistTableRow | undefined {
  if (Object.keys(watchlists).length === 0) {
    return undefined;
  }

  const watchlist = watchlists[wid];
  if (watchlist === undefined) {
    return undefined;
  }
  if (watchlist.portfolio && portfolios[watchlist.portfolio] === undefined) {
    return undefined;
  }

  if (Object.keys(assetInfo).length === 0) {
    return undefined;
  }

  const data = createWatchlistTableData(
    watchlist,
    watchlists,
    assetInfo,
    portfolios,
  );
  return data;
}
