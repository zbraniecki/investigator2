/* eslint camelcase: "off" */

import { Portfolio } from "../store/account";
import { AssetInfo, Wallet } from "../store/oracle";
import { getWalletAsset } from "./wallet";
import { assert, groupTableDataByColumn, GroupingStrategy } from "./helpers";
import { RowData, RowType } from "../views/components/table/Data";

export interface PortfolioTableRow extends RowData {
  cells: {
    id: string;
    name?: string;
    symbol?: string;
    price?: number;
    quantity?: number;
    value?: number;
    wallet?: string;
    yield?: number;
  };
  children?: PortfolioTableRow[];
  type: RowType;
}

function computeHeaderData(
  portfolio: Portfolio,
  data: PortfolioTableRow[],
  topLevel: boolean
): PortfolioTableRow["cells"] {
  const cells: PortfolioTableRow["cells"] = {
    id: `header-${portfolio.id}`,
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

  return cells;
}

export function buildPortfolioTableData(
  portfolio: Portfolio,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>
): PortfolioTableRow[] {
  const rows: PortfolioTableRow[] = portfolio.holdings.map(
    ({ id, quantity }) => {
      const asset = assetInfo[id];
      assert(asset);

      return {
        cells: {
          id,
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
        id: subPortfolio.id,
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
  wallets: Record<string, Wallet>,
  topLevel: boolean
): PortfolioTableRow {
  const rows: PortfolioTableRow[] = portfolio.holdings.map(
    ({ id, quantity, account }) => {
      const asset = assetInfo[id];
      assert(asset);
      const wallet = wallets[account];
      let walletAsset;
      if (wallet) {
        walletAsset = getWalletAsset(wallet.id, asset.id, wallets);
      }

      return {
        cells: {
          id,
          name: asset.name,
          symbol: asset.symbol,
          price: asset.info.value,
          quantity,
          value: asset.info.value * quantity,
          wallet: wallet?.name,
          yield: walletAsset?.apy,
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
      wallets,
      false
    );
  });
  rows.push(...res2);

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
  wallets: Record<string, Wallet>
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
    wallets,
    true
  );
  if (data.children !== undefined) {
    data.children = groupTableDataByColumn(
      data.children,
      "id",
      [
        { key: "name", strategy: GroupingStrategy.IfSame },
        { key: "price", strategy: GroupingStrategy.IfSame },
        { key: "wallet", strategy: GroupingStrategy.IfSame },
        { key: "yield", strategy: GroupingStrategy.IfSame },
        { key: "quantity", strategy: GroupingStrategy.Sum },
      ],
      false
    ) as PortfolioTableRow[];
  }

  return data;
}
