import { Portfolio, Holding, Asset, Service, Account } from "../types";
import { assert } from "./helpers";
import { DataState } from "./state";
import {
  CollectionType,
  Collection,
  collectPortfolioHoldings,
  groupCollectionItems,
  CollectionGroupKey,
} from "./collections";
import {
  RowData,
  RowType,
  CellData,
  StyledRowData,
  newCellData,
} from "../views/components/table/data/Row";

export function isSufficientDataLoaded(state: DataState): boolean {
  return (
    state.accounts !== undefined &&
    state.assets !== undefined &&
    state.holdings !== undefined &&
    state.portfolios !== undefined
  );
}

export interface AccountsTableRow extends RowData {
  cells: {
    id?: string;
    account?: string;
    name?: string;
    symbol?: string;
    quantity?: number;
    yield?: number;
    value?: number;
  };
  children?: AccountsTableRow[];
  type: RowType;
}

export interface StyledAccountsTableRow extends StyledRowData {
  cells: {
    id?: CellData<string>;
    account?: CellData<string>;
    name?: CellData<string>;
    symbol?: CellData<string>;
    quantity?: CellData<number>;
    value?: CellData<number>;
  };
  children?: StyledAccountsTableRow[];
  type: RowType;
}

function convertCollectionToTableRow(
  item: Collection,
  state: {
    accounts: Record<string, Account>;
    assets: Record<string, Asset>;
    holdings: Record<string, Holding>;
    portfolios: Record<string, Portfolio>;
    services: Record<string, Service>;
  },
  options?: {
    hideAccount: boolean;
  }
): AccountsTableRow {
  switch (item.type) {
    case CollectionType.Portfolio: {
      assert(item.pk);
      assert(item.items);
      const portfolio = state.portfolios[item.pk];

      const children: AccountsTableRow[] = Array.from(item.items).map((item) =>
        convertCollectionToTableRow(item, state)
      );

      return {
        cells: {},
        children,
        type: RowType.Portfolio,
      };
    }
    case CollectionType.Account: {
      assert(item.pk);
      assert(item.items);
      const account = state.accounts[item.pk];

      const children: AccountsTableRow[] = Array.from(item.items).map((item) =>
        convertCollectionToTableRow(item, state, {
          hideAccount: true,
        })
      );

      const value = children.reduce(
        (total, row) => total + (row.cells.value ? row.cells.value : 0),
        0
      );

      return {
        cells: {
          id: account.pk,
          account: account.name,
          value,
        },
        children,
        type: RowType.Account,
      };
    }
    case CollectionType.Holding: {
      assert(item.pk);
      const holding = state.holdings[item.pk];
      const asset = state.assets[holding.asset];
      assert(holding.account);
      const account = state.accounts[holding.account];

      return {
        cells: {
          id: holding.pk,
          account: options?.hideAccount ? undefined : account.name,
          name: asset.symbol.toUpperCase(),
          quantity: holding.quantity,
          value: holding.quantity * asset.info.value,
        },
        type: RowType.Holding,
      };
    }
    default: {
      console.log(item.type);
      assert(false);
    }
  }
}

export function prepareAccountsTableData(
  pid: string,
  state: {
    accounts: Record<string, Account>;
    assets: Record<string, Asset>;
    holdings: Record<string, Holding>;
    portfolios: Record<string, Portfolio>;
    services: Record<string, Service>;
  }
): AccountsTableRow | null {
  const portfolio = state.portfolios[pid];
  assert(portfolio);

  const collection = collectPortfolioHoldings(portfolio, state, [], null);

  const groupedCollection = groupCollectionItems(
    collection,
    CollectionGroupKey.Account,
    state,
    {
      collapseSingle: true,
    }
  );

  const data = convertCollectionToTableRow(groupedCollection, state);

  return data;
}

interface StylingColumnData {
  mean: number;
  stdev: number;
}

type StylingTableData = Record<string, StylingColumnData>;

export function computeAccountsTableDataStyle(
  data: AccountsTableRow
): StyledAccountsTableRow {
  const stylingInfo: StylingTableData = {
    // price: {
    //   mean: 0.005,
    //   stdev: 0.005,
    // },
  };

  const result: StyledAccountsTableRow = {
    cells: {
      id: newCellData(data.cells.id),
      account: newCellData(data.cells.account),
      name: newCellData(data.cells.name),
      quantity: newCellData(data.cells.quantity),
      value: newCellData(data.cells.value),
    },
    children: data.children?.map((row) => computeAccountsTableDataStyle(row)),
    type: data.type,
  };

  for (const [key, cell] of Object.entries(result.cells)) {
    const info = stylingInfo[key];
    if (info === undefined) {
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
