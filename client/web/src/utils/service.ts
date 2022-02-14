import {
  Portfolio,
  Holding,
  Asset,
  Service,
  ServiceAsset,
  Account,
} from "../types";
import { collectPortfolioHoldings, groupHoldings } from "./portfolio";
import { assert } from "./helpers";
import {
  RowData,
  RowType,
  CellData,
  StyledRowData,
  newCellData,
} from "../views/components/table/data/Row";

export function getServiceAsset(
  serviceId: string,
  assetId: string,
  services: Record<string, Service>
): ServiceAsset | null {
  const service = services[serviceId];
  if (!service) {
    return null;
  }
  for (const asset of service.assets) {
    if (asset.asset_pk === assetId) {
      return asset;
    }
  }
  return null;
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

export function prepareAccountsTableData(
  pid: string,
  portfolios: Record<string, Portfolio>,
  assets: Record<string, Asset>,
  services: Record<string, Service>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>
): AccountsTableRow | undefined {
  const portfolio = portfolios[pid];
  assert(portfolio);
  if (Object.keys(assets).length === 0) {
    return undefined;
  }

  const ph = collectPortfolioHoldings(
    portfolio,
    portfolios,
    assets,
    accounts,
    holdings
  );

  const groups = groupHoldings(ph, "account");

  return {
    cells: {},
    type: RowType.Asset,
    children: groups.map((group) => {
      const account = accounts[group.item];
      let groupValue = 0;

      const children = group.children?.map((item) => {
        const holding = holdings[item.item];
        const asset = assets[holding.asset];
        const value = holding.quantity * asset.info.value;
        groupValue += value;

        return {
          cells: {
            id: holding.pk,
            name: asset.name,
            symbol: asset.symbol,
            quantity: holding.quantity,
            value,
          },
          type: RowType.Asset,
        };
      });

      return {
        cells: {
          id: group.item,
          account: account.name,
          value: groupValue,
        },
        children,
        type: RowType.Account,
      };
    }),
  };
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
