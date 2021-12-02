/* eslint camelcase: "off" */

import {
  Portfolio,
} from "../store/account";
import { AssetInfo, Wallet } from "../store/oracle";
import { getAsset } from "./asset";
import { getWalletAsset } from "./wallet";
import { assert } from "./helpers";
import { DataRowProps, SymbolNameCell } from "../views/components/Table";

export interface PortfolioTableRow extends DataRowProps {
  cells: {
    name?: SymbolNameCell | string;
    price?: number;
    quantity?: number;
    value?: number;
    wallet?: string;
    yield?: number;
  };
  children?: PortfolioTableRow[];
}


export function preparePortfolioTableData(
  pid: string,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>,
  wallets: Record<string, Wallet>,
): {headerRow?: PortfolioTableRow, data: PortfolioTableRow[]} {
  const result: PortfolioTableRow[] = [];

  if (Object.keys(assetInfo).length === 0 ||
     Object.keys(wallets).length === 0) {
    return {data: result};
  }

  let portfolio = portfolios[pid];
  assert(portfolio);

  let value = 0;
  let apy = 0;

  for (const holding of portfolio.holdings) {
    let asset = assetInfo[holding.id];
    assert(asset);

    let wallet = wallets[holding.account];
    assert(wallet);
    let walletAsset = getWalletAsset(wallet.id, asset.id, wallets);

    value += holding.quantity * asset.info.value;
    result.push({
      cells: {
        name: {
          symbol: asset.symbol,
          name: asset.name,
        },
        price: asset.info.value,
        quantity: holding.quantity,
        wallet: wallet.name,
        yield: walletAsset?.apy,
        value: holding.quantity * asset.info.value,
      },
    });
  }

  for (const pid of portfolio.portfolios) {
    let portfolio = portfolios[pid];
    assert(portfolio);

    let sub = preparePortfolioTableData(pid, portfolios, assetInfo, wallets);
    result.push({
      cells: {
        name: portfolio.name,
        value: portfolio.value || sub.headerRow?.cells.value,
      },
      children: sub.data.length > 0 ? sub.data : undefined,
    });
    value += portfolio.value || sub.headerRow?.cells.value || 0;
  }

  for (const holding of portfolio.holdings) {
    let asset = assetInfo[holding.id];
    assert(asset);
    let walletAsset = getWalletAsset(holding.account, holding.id, wallets);
    
    let subValue = holding.quantity * asset.info.value;
    let perc = subValue / value;

    apy = (walletAsset?.apy || 0) * perc;
  }

  for (const pid of portfolio.portfolios) {
    let portfolio = portfolios[pid];
    assert(portfolio);

    let sub = preparePortfolioTableData(pid, portfolios, assetInfo, wallets);
    if (sub.headerRow) {
      let perc = (sub.headerRow.cells.value || 0) / value;
      apy += (sub.headerRow.cells.yield || 0) * perc;
    }
  }

  return {
    headerRow: {
      cells: {
        value,
        yield: apy,
      }
    },
    data: result,
  };
}
