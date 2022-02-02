import { Portfolio, Holding, Asset, Service, ServiceAsset, Account } from "../types";
import { createPortfolioTableData } from "./portfolio";
import { assert, groupTableDataByColumn, GroupingStrategy } from "./helpers";
import { TableMeta } from "../views/components/table/data/Table";
import { CellAlign } from "../views/components/table/data/Column";
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
    wallet?: string;
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
    wallet?: CellData<string>;
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
  assetInfo: Record<string, Asset>,
  services: Record<string, Service>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>
): AccountsTableRow | undefined {
  const portfolio = portfolios[pid];
  assert(portfolio);
  if (Object.keys(assetInfo).length === 0) {
    return undefined;
  }

  const data = createPortfolioTableData(
    portfolio,
    portfolios,
    assetInfo,
    services,
    accounts,
    holdings,
    true
  ) as AccountsTableRow;
  console.log(data);

  // if (data.children !== undefined) {
  //   data.children = groupTableDataByColumn(
  //     data.children,
  //     "account",
  //     [
  //       { key: "name", strategy: GroupingStrategy.IfSame },
  //       { key: "account", strategy: GroupingStrategy.IfSame },
  //     ],
  //     true
  //   ) as AccountsTableRow[];
  // }

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
      wallet: newCellData(data.cells.wallet),
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
