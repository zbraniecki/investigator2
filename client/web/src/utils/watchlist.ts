import { Asset, Watchlist, Portfolio, Holding, Account } from "../types";
import { assert, DataState } from "./helpers";
import {
  RowData,
  RowType,
  CellData,
  StyledRowData,
  newCellData,
} from "../views/components/table/data/Row";
import {
  CollectionType,
  Collection,
  collectWatchlistHoldings,
  groupCollectionItems,
  CollectionGroupKey,
} from "./collections";

export enum DataLoadedState {
  None,
  Public,
  User,
}

export function isSufficientDataLoaded(data: DataState): DataLoadedState {
  const state = data.assets !== undefined && data.publicWatchlists !== undefined;
  if (!state) {
    return DataLoadedState.None;
  }
  if (
    data.accounts !== undefined &&
    data.holdings !== undefined &&
    data.userWatchlists !== undefined &&
    data.portfolios !== undefined &&
    data.users !== undefined
  ) {
    return DataLoadedState.User;
  }
  return DataLoadedState.Public;
}

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

function convertCollectionToTableRow(
  item: Collection,
  state: {
    accounts: Record<string, Account>;
    assets: Record<string, Asset>;
    holdings: Record<string, Holding>;
  }
): WatchlistTableRow | null {
  switch (item.type) {
    case CollectionType.Watchlist: {
      assert(item.items);
      const children: WatchlistTableRow[] = Array.from(item.items)
        .map((item) => convertCollectionToTableRow(item, state))
        .filter((i): i is WatchlistTableRow => i != null);

      const cells = children.length ? computeHeaderData(children) : {};
      return {
        cells,
        children,
        type: RowType.Watchlist,
      };
    }
    case CollectionType.Asset: {
      assert(item.pk);
      const asset = state.assets[item.pk];
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
    case CollectionType.Account: {
      assert(item.pk);
      assert(item.items);
      const account = state.accounts[item.pk];

      const children: WatchlistTableRow[] = Array.from(item.items)
        .map((item) => convertCollectionToTableRow(item, state))
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
      console.log(item.type);
      assert(false);
    }
  }
}

export function prepareWatchlistTableData(
  wid: string,
  state: {
    accounts: Record<string, Account>;
    assets: Record<string, Asset>;
    holdings: Record<string, Holding>;
    portfolios: Record<string, Portfolio>;
    watchlists: Record<string, Watchlist>;
  }
): WatchlistTableRow | null {
  const watchlist = state.watchlists[wid];
  if (watchlist === undefined) {
    return null;
  }

  assert(watchlist.portfolio);
  const collection = collectWatchlistHoldings(
    watchlist,
    state,
    [CollectionType.Account],
    null
  );
  console.log(collection);

  const groupedCollection = groupCollectionItems(
    collection,
    CollectionGroupKey.Asset,
    state
  );
  console.log(groupedCollection);

  const data = convertCollectionToTableRow(groupedCollection, state);
  console.log(data);
  assert(data);

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
