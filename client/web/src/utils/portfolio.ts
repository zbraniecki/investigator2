/* eslint camelcase: "off" */

import { Portfolio, Account } from "../store/user";
import { AssetInfo, Service } from "../store/oracle";
import { getServiceAsset } from "./service";
import { assert, groupTableDataByColumn, GroupingStrategy } from "./helpers";
import {
  RowData,
  RowType,
  CellData,
  StyledRowData,
  newCellData,
} from "../views/components/table/data/Row";

export interface PortfolioTableRow extends RowData {
  cells: {
    id?: string;
    asset?: string;
    name?: string;
    symbol?: string;
    price?: number;
    quantity?: number;
    value?: number;
    account?: string;
    yield?: number;
  };
  children?: PortfolioTableRow[];
  type: RowType;
}
export interface StyledPortfolioTableRow extends StyledRowData {
  cells: {
    id?: CellData<string>;
    asset?: CellData<string>;
    name?: CellData<string>;
    symbol?: CellData<string>;
    price?: CellData<number>;
    quantity?: CellData<number>;
    value?: CellData<number>;
    account?: CellData<string>;
    yield?: CellData<number>;
  };
  children?: StyledPortfolioTableRow[];
  type: RowType;
}

function computeHeaderData(
  portfolio: Portfolio,
  data: PortfolioTableRow[],
  topLevel: boolean
): PortfolioTableRow["cells"] {
  const cells: PortfolioTableRow["cells"] = {
    value:
      portfolio.value !== undefined
        ? portfolio.value
        : data.reduce((total, curr) => total + (curr.cells.value || 0), 0),
  };

  if (!topLevel) {
    cells.name = portfolio.name;
  }

  const totalYield = data.reduce((total, row) => {
    if (row.cells.yield && row.cells.value && cells.value) {
      const perc = row.cells.value / cells.value;
      return total + row.cells.yield * perc;
    }
    return total;
  }, 0);

  if (totalYield > 0) {
    cells.yield = totalYield;
  }

  if (cells.value === 0) {
    cells.value = undefined;
  }
  return cells;
}

export function buildPortfolioTableData(
  portfolio: Portfolio,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>
): PortfolioTableRow[] {
  const rows: PortfolioTableRow[] = portfolio.holdings.map(
    ({ pk, asset: assetPk, quantity }) => {
      const asset = assetInfo[assetPk];
      assert(asset);

      return {
        cells: {
          id: pk,
          asset: asset.pk,
          name: asset.name,
          symbol: asset.symbol,
          price: asset.info.value,
          quantity,
          value: asset.info.value * quantity,
        },
        type: RowType.Asset,
      };
    }
  );
  const res2: PortfolioTableRow[] = portfolio.portfolios.map((pid) => {
    const subPortfolio = portfolios[pid];
    assert(subPortfolio);
    return {
      cells: {
        id: subPortfolio.pk,
        name: subPortfolio.name,
      },
      children: buildPortfolioTableData(subPortfolio, portfolios, assetInfo),
      type: RowType.Portfolio,
    };
  });
  rows.push(...res2);
  return rows;
}

export function createPortfolioTableData(
  portfolio: Portfolio,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>,
  services: Record<string, Service>,
  accounts: Record<string, Account>,
  topLevel: boolean
): PortfolioTableRow {
  const rows: PortfolioTableRow[] = portfolio.holdings.map(
    ({ pk, asset: assetId, quantity, account: accountId }) => {
      const asset = assetInfo[assetId];
      assert(asset);
      const account = accountId ? accounts[accountId] : undefined;
      let serviceAsset;
      if (account) {
        serviceAsset = getServiceAsset(account.pk, asset.pk, services);
      }

      return {
        cells: {
          id: pk,
          asset: asset.pk,
          name: asset.name,
          symbol: asset.symbol,
          price: asset.info.value,
          quantity,
          value: asset.info.value * quantity,
          account: account?.name,
          yield: serviceAsset?.apy,
        },
        type: RowType.Asset,
      };
    }
  );
  const res2 = portfolio.portfolios.map((pid) => {
    const subPortfolio = portfolios[pid];
    assert(subPortfolio);
    return createPortfolioTableData(
      subPortfolio,
      portfolios,
      assetInfo,
      services,
      accounts,
      false
    );
  });
  rows.push(...res2);
  if (portfolio.tags.length > 0) {
    Object.values(accounts).forEach((account) => {
      account.holdings.forEach((holding) => {
        const asset = assetInfo[holding.asset];
        assert(asset);
        if (portfolio.tags.includes(asset.asset_class)) {
          let serviceAsset;
          if (account) {
            serviceAsset = getServiceAsset(account.pk, asset.pk, services);
          }

          rows.push({
            cells: {
              id: holding.pk,
              asset: asset.pk,
              name: asset.name,
              symbol: asset.symbol,
              price: asset.info.value,
              quantity: holding.quantity,
              value: asset.info.value * holding.quantity,
              account: account?.name,
              yield: serviceAsset?.apy,
            },
            type: RowType.Asset,
          });
        }
      });
    });
  }

  rows.sort((a, b) => (b.cells.value || 0) - (a.cells.value || 0));

  const cells = computeHeaderData(portfolio, rows, topLevel);

  return {
    cells,
    children: rows.length > 0 ? rows : undefined,
    type: RowType.Portfolio,
  };
}

export function preparePortfolioTableData(
  pid: string,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>,
  services: Record<string, Service>,
  accounts: Record<string, Account>
): PortfolioTableRow | undefined {
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
    true
  );
  if (data.children !== undefined) {
    data.children = groupTableDataByColumn(
      data.children,
      "asset_id",
      [
        { key: "name", strategy: GroupingStrategy.IfSame },
        { key: "price", strategy: GroupingStrategy.IfSame },
        { key: "account", strategy: GroupingStrategy.IfSame },
        { key: "yield", strategy: GroupingStrategy.IfSame },
        { key: "quantity", strategy: GroupingStrategy.Sum },
      ],
      false
    ) as PortfolioTableRow[];
  }

  return data;
}

interface StylingColumnData {
  mean: number;
  stdev: number;
}

type StylingTableData = Record<string, StylingColumnData>;

export function computePortfolioTableDataStyle(
  data: PortfolioTableRow
): StyledPortfolioTableRow {
  const stylingInfo: StylingTableData = {
    // price: {
    //   mean: 0.005,
    //   stdev: 0.005,
    // },
  };

  const result: StyledPortfolioTableRow = {
    cells: {
      id: newCellData(data.cells.id),
      asset: newCellData(data.cells.asset),
      name: newCellData(data.cells.name),
      symbol: newCellData(data.cells.symbol),
      price: newCellData(data.cells.price),
      quantity: newCellData(data.cells.quantity),
      value: newCellData(data.cells.value),
      account: newCellData(data.cells.account),
      yield: newCellData(data.cells.yield),
    },
    children: data.children?.map((row) => computePortfolioTableDataStyle(row)),
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
