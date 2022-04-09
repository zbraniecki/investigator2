import { Asset, Watchlist, Portfolio, Holding, Account } from "../types";
import { assert } from "./helpers";
import {
  RowData,
  RowType,
  CellData,
  StyledRowData,
  newCellData,
} from "../views/components/table/data/Row";
import {
  CollectionType,
  CollectionItemType,
  Collection,
  CollectionItem,
  collectWatchlistHoldings,
} from "./collections";

export interface WatchlistTableRow extends RowData {
  cells: {
    id?: string;
    market_cap_rank?: number;
    market_cap?: number;
    name?: string;
    symbol?: string;
    price?: number;
    price_change_percentage_1h?: number;
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
  };
  children?: WatchlistTableRow[];
  type: RowType;
}
export interface StyledWatchlistTableRow extends StyledRowData {
  cells: {
    id?: CellData<string>;
    market_cap_rank?: CellData<number>;
    market_cap?: CellData<number>;
    name?: CellData<string>;
    symbol?: CellData<string>;
    price?: CellData<number>;
    price_change_percentage_1h?: CellData<number>;
    price_change_percentage_24h?: CellData<number>;
    price_change_percentage_7d?: CellData<number>;
    price_change_percentage_30d?: CellData<number>;
  };
  children?: StyledWatchlistTableRow[];
  type: RowType;
}

function computeHeaderData(
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
  portfolios: Record<string, Portfolio>,
  holdings: Record<string, Holding>,
  accounts: Record<string, Account>,
  assetInfo: Record<string, Asset>
): Set<string> {
  const symbols: Set<string> = new Set();
  for (const hid of portfolio.holdings) {
    const holding = holdings[hid];
    symbols.add(holding.asset);
  }
  for (const pid of portfolio.portfolios) {
    const p = portfolios[pid];
    assert(p);
    const subset = getAssetsFromPortfolio(
      p,
      portfolios,
      holdings,
      accounts,
      assetInfo
    );
    subset.forEach(symbols.add, symbols);
  }
  if (portfolio.tags.length > 0) {
    Object.values(accounts).forEach((account) => {
      account.holdings.forEach((hid) => {
        const holding = holdings[hid];
        const asset = assetInfo[holding.asset];
        assert(asset);
        if (portfolio.tags.includes(asset.asset_class)) {
          symbols.add(asset.pk);
        }
      });
    });
  }
  return symbols;
}

export function createWatchlistTableData(
  watchlist: Watchlist,
  watchlists: Record<string, Watchlist>,
  assetInfo: Record<string, Asset>,
  portfolios: Record<string, Portfolio>,
  holdings: Record<string, Holding>,
  accounts: Record<string, Account>
): WatchlistTableRow {
  const symbols: Set<string> = new Set(watchlist.assets);

  if (watchlist.portfolio) {
    const portfolio = portfolios[watchlist.portfolio];
    assert(portfolio);
    const subset = getAssetsFromPortfolio(
      portfolio,
      portfolios,
      holdings,
      accounts,
      assetInfo
    );
    subset.forEach(symbols.add, symbols);
  }

  const rows: WatchlistTableRow[] = Array.from(symbols).map((symbol) => {
    const asset = assetInfo[symbol];
    assert(asset, `Missing asset: ${symbol}`);

    return {
      cells: {
        id: asset.pk,
        market_cap_rank: asset.info.market_cap_rank,
        market_cap: asset.info.market_cap,
        name: asset.symbol.toUpperCase(),
        symbol: asset.symbol,
        price: asset.info.value,
        price_change_percentage_1h: asset.info.price_change_percentage_1h,
        price_change_percentage_24h: asset.info.price_change_percentage_24h,
        price_change_percentage_7d: asset.info.price_change_percentage_7d,
        price_change_percentage_30d: asset.info.price_change_percentage_30d,
      },
      type: RowType.Asset,
    };
  });

  const cells = rows.length ? computeHeaderData(rows) : {};

  return {
    cells,
    children: rows.length > 0 ? rows : undefined,
    type: RowType.Asset,
  };
}

function convertCollectionItemToTableRow(
  item: CollectionItem,
  assets: Record<string, Asset>,
  accounts: Record<string, Account>,
  seenAssets: Set<string>
): WatchlistTableRow | null {
  switch (item.type) {
    case CollectionItemType.Holding: {
      const apk = item.value.asset;
      const asset = assets[apk];
      if (seenAssets.has(asset.pk)) {
        return null;
      }
      seenAssets.add(asset.pk);
      return {
        cells: {
          id: asset.pk,
          market_cap_rank: asset.info.market_cap_rank,
          market_cap: asset.info.market_cap,
          name: asset.symbol.toUpperCase(),
          symbol: asset.symbol,
          price: asset.info.value,
          price_change_percentage_1h: asset.info.price_change_percentage_1h,
          price_change_percentage_24h: asset.info.price_change_percentage_24h,
          price_change_percentage_7d: asset.info.price_change_percentage_7d,
          price_change_percentage_30d: asset.info.price_change_percentage_30d,
        },
        type: RowType.Asset,
      };
    }
    case CollectionItemType.Collection: {
      switch (item.value.type) {
        case CollectionType.Account: {
          const account = accounts[item.value.meta.pk];
          const seenAssets: Set<string> = new Set();

          const children: WatchlistTableRow[] = Array.from(item.value.items)
            .map((item) =>
              convertCollectionItemToTableRow(
                item,
                assets,
                accounts,
                seenAssets
              )
            )
            .filter((i): i is WatchlistTableRow => i != null);

          return {
            cells: {
              name: account.name,
            },
            children,
            type: RowType.Account,
          };
        }
        default: {
          assert(false);
        }
      }
    }
    default: {
      assert(false);
    }
  }
}

function convertCollectionToTableRows(
  collection: Collection,
  assets: Record<string, Asset>,
  accounts: Record<string, Account>
): WatchlistTableRow {
  const seenAssets: Set<string> = new Set();
  const rows: WatchlistTableRow[] = Array.from(collection.items)
    .map((item) =>
      convertCollectionItemToTableRow(item, assets, accounts, seenAssets)
    )
    .filter((i): i is WatchlistTableRow => i !== null);

  const cells = rows.length ? computeHeaderData(rows) : {};

  return {
    cells,
    children: rows.length > 0 ? rows : undefined,
    type: RowType.Asset,
  };
}

export function prepareWatchlistTableData(
  wid: string,
  watchlists: Record<string, Watchlist>,
  assets: Record<string, Asset>,
  portfolios: Record<string, Portfolio>,
  holdings: Record<string, Holding>,
  accounts: Record<string, Account>
): WatchlistTableRow | undefined {
  if (
    watchlists === undefined ||
    assets === undefined ||
    accounts === undefined ||
    portfolios === undefined ||
    holdings === undefined
  ) {
    return undefined;
  }

  const watchlist = watchlists[wid];
  if (watchlist === undefined) {
    return undefined;
  }

  assert(watchlist.portfolio);
  const collection = collectWatchlistHoldings(
    watchlist,
    watchlists,
    portfolios,
    assets,
    accounts,
    holdings,
    [],
    null
  );
  console.log(collection);

  const data = convertCollectionToTableRows(collection, assets, accounts);
  console.log(data);

  return data;
}

interface StylingColumnData {
  mean: number;
  stdev: number;
}

type StylingTableData = Record<string, StylingColumnData>;

export function computeWatchlistTableDataStyle(
  data: WatchlistTableRow
): StyledWatchlistTableRow {
  const stylingInfo: StylingTableData = {
    price_change_percentage_1h: {
      mean: 0.005,
      stdev: 0.005,
    },
    price_change_percentage_24h: {
      mean: 0.01,
      stdev: 0.02,
    },
    price_change_percentage_7d: {
      mean: 0.05,
      stdev: 0.03,
    },
    price_change_percentage_30d: {
      mean: 0.17,
      stdev: 0.05,
    },
  };

  const result: StyledWatchlistTableRow = {
    cells: {
      id: newCellData(data.cells.id),
      market_cap_rank: newCellData(data.cells.market_cap_rank),
      market_cap: newCellData(data.cells.market_cap),
      name: newCellData(data.cells.name),
      symbol: newCellData(data.cells.symbol),
      price: newCellData(data.cells.price),
      price_change_percentage_1h: newCellData(
        data.cells.price_change_percentage_1h
      ),
      price_change_percentage_24h: newCellData(
        data.cells.price_change_percentage_24h
      ),
      price_change_percentage_7d: newCellData(
        data.cells.price_change_percentage_7d
      ),
      price_change_percentage_30d: newCellData(
        data.cells.price_change_percentage_30d
      ),
    },
    children: data.children?.map((row) => computeWatchlistTableDataStyle(row)),
    type: data.type,
  };

  for (const [key, cell] of Object.entries(result.cells)) {
    const info = stylingInfo[key];
    if (info === undefined) {
      continue;
    }
    if (cell === undefined || cell.value === null) {
      continue;
    }
    assert(typeof cell.value === "number");
    if (cell.value > info.mean + info.stdev) {
      cell.color = "green";
    } else if (cell.value < (info.mean + info.stdev) * -1) {
      cell.color = "red";
    }
  }

  return result;
}
