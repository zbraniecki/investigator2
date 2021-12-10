/* eslint camelcase: "off" */

import {
  Portfolio,
} from "../store/account";
import { AssetInfo, Wallet } from "../store/oracle";
import { Holding } from "../store/account";
import { getAsset } from "./asset";
import { getWalletAsset } from "./wallet";
import { assert, groupTableDataByColumn, GroupingStrategy } from "./helpers";
import { DataRowProps, SymbolNameCell } from "../views/components/Table";

export interface PortfolioTableRow extends DataRowProps {
  cells: {
    id: string,
    name?: SymbolNameCell | string;
    price?: number;
    quantity?: number;
    value?: number;
    wallet?: string;
    yield?: number;
  };
  children?: PortfolioTableRow[];
  type: "portfolio" | "asset";
}

function computeHeaderData(
  portfolio: Portfolio,
  data: PortfolioTableRow[],
  topLevel: boolean,
): PortfolioTableRow["cells"] {
  let cells: PortfolioTableRow["cells"] = {
    id: `header-${portfolio.id}`,
    value: portfolio.value !== undefined ? portfolio.value : data.reduce((total, curr) => total + (curr.cells.value || 0), 0),
  };

  if (!topLevel) {
    cells.name = portfolio.name;
  }

  let totalYield = data.reduce((total, row) => {
    if (row.cells.yield && row.cells.value && cells.value) {
      let perc = row.cells.value / cells.value;
      return total + (row.cells.yield * perc);
    } else {
      return total;
    }
  }, 0);

  if (totalYield > 0) {
    cells.yield = totalYield;
  }

  return cells;
}

export function buildPortfolioTableData(
  portfolio: Portfolio,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>,
): PortfolioTableRow[] {
  let rows: PortfolioTableRow[] = portfolio.holdings.map(({id, quantity, account}) => {
    let asset = assetInfo[id];
    assert(asset);

    return {
      cells: {
        id,
        name: {
          name: asset.name,
          symbol: asset.symbol,
        },
        price: asset.info.value,
        quantity,
        value: asset.info.value * quantity,
      },
      type: "asset",
    };
  });
  let res2: PortfolioTableRow[] = portfolio.portfolios.map(pid => {
    let portfolio = portfolios[pid];
    assert(portfolio);
    return {
      cells: {
        id: portfolio.id,
        name: portfolio.name,
      },
      children: buildPortfolioTableData(portfolio, portfolios, assetInfo),
      type: "portfolio",
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
  topLevel: boolean,
): PortfolioTableRow {
  let rows: PortfolioTableRow[] = portfolio.holdings.map(({id, quantity, account}) => {
    let asset = assetInfo[id];
    assert(asset);
    let wallet = wallets[account];
    let walletAsset;
    if (wallet) {
      walletAsset = getWalletAsset(wallet.id, asset.id, wallets);
    }

    return {
      cells: {
        id,
        name: {
          name: asset.name,
          symbol: asset.symbol,
        },
        price: asset.info.value,
        quantity,
        value: asset.info.value * quantity,
        wallet: wallet?.name,
        yield: walletAsset?.apy,
      },
      type: "asset",
    };
  });
  let res2 = portfolio.portfolios.map(pid => {
    let portfolio = portfolios[pid];
    assert(portfolio);
    return createPortfolioTableData(portfolio, portfolios, assetInfo, wallets, false);
  });
  rows.push(...res2);

  rows.sort((a, b) => (b.cells.value || 0) - (a.cells.value || 0));

  let cells = computeHeaderData(portfolio, rows, topLevel);

  return {
    cells,
    children: rows.length > 0 ? rows : undefined,
    type: "portfolio",
  };
}

export function preparePortfolioTableData(
  pid: string,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>,
  wallets: Record<string, Wallet>,
): PortfolioTableRow | undefined {
  let portfolio = portfolios[pid];
  assert(portfolio);
  if (Object.keys(assetInfo).length === 0) {
    return undefined;
  }

  let data = createPortfolioTableData(
    portfolio,
    portfolios,
    assetInfo,
    wallets,
    true,
  );
  if (data.children !== undefined) {
    data.children = groupTableDataByColumn(
      data.children,
      "id",
      [
        {key: "name", strategy: GroupingStrategy.IfSame},
        {key: "price", strategy: GroupingStrategy.IfSame},
        {key: "wallet", strategy: GroupingStrategy.IfSame},
        {key: "yield", strategy: GroupingStrategy.IfSame},
        {key: "quantity", strategy: GroupingStrategy.Sum},
      ],
      false,
    ) as PortfolioTableRow[];
  }

  return data;
}
