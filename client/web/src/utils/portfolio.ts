/* eslint camelcase: "off" */

import { PortfolioEntry, PortfolioEntryMeta, Holding } from "../store/account";
import { AssetInfo, Wallet } from "../store/oracle";
import { getAsset } from "./asset";
import { getWallet, getWalletAsset } from "./wallet";

export interface PortfolioTableRow {
  cells: {
    symbol: string | undefined;
    name: string | undefined;
    price: number | undefined;
    quantity: number | undefined;
    value: number;
    wallet: string | undefined;
    yield: number | undefined;
  };
  subData?: PortfolioTableRow[];
}

export function preparePortfolioTableData(
  pid: string,
  portfolios: PortfolioEntry[],
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): PortfolioTableRow[] {
  const portfolio = getPortfolio(pid, portfolios);
  if (portfolio === null || assetInfo.length === 0) {
    return [];
  }

  const assets: Record<string, Holding[]> = {};

  for (const holding of portfolio.holdings) {
    if (!Object.keys(assets).includes(holding.symbol)) {
      assets[holding.symbol] = [];
    }
    assets[holding.symbol].push(holding);
  }

  const result: PortfolioTableRow[] = [];

  for (const [symbol, holdings] of Object.entries(assets)) {
    const asset = getAsset(symbol, assetInfo);

    const subData: PortfolioTableRow[] = holdings.map((holding) => {
      const walletAsset = getWalletAsset(
        holding.account,
        holding.symbol,
        wallets
      );
      const wallet = getWallet(holding.account, wallets);
      const price = asset?.value || 0;
      const apy = walletAsset?.apy;
      return {
        cells: {
          symbol: undefined,
          name: undefined,
          price: undefined,
          quantity: holding.quantity,
          value: holding.quantity * price,
          wallet: wallet?.name || holding.account,
          yield: apy,
        },
      };
    });
    subData.sort((a, b) => b.cells.value - a.cells.value);
    const price = asset?.value;
    let value = 0;
    let quantity = 0;
    let apy = 0;
    for (const row of subData) {
      value += row.cells.value;
      quantity += row.cells.quantity || 0;
    }
    for (const row of subData) {
      const y = row.cells.yield || 0;
      const perc = row.cells.value / value;
      apy += y * perc;
    }

    const row: PortfolioTableRow = {
      cells: {
        symbol,
        name: asset?.name,
        price,
        quantity,
        value,
        wallet: undefined,
        yield: apy > 0.0 ? apy : undefined,
      },
    };
    if (subData.length > 1) {
      row.subData = subData;
    }
    result.push(row);
  }

  portfolio.portfolios.forEach((subPid) => {
    const subPortfolio = getPortfolio(subPid, portfolios);
    if (subPortfolio === null) {
      result.push({
        cells: {
          symbol: "",
          name: subPid,
          price: undefined,
          quantity: undefined,
          value: 0,
          wallet: undefined,
          yield: undefined,
        },
      });
    } else {
      const subData = preparePortfolioTableData(
        subPid,
        portfolios,
        assetInfo,
        wallets
      );

      let value = 0;
      let apy = 0;
      for (const row of subData) {
        value += row.cells.value;
      }

      for (const row of subData) {
        const y = row.cells.yield || 0;
        const perc = row.cells.value / value;
        apy += y * perc;
      }

      result.push({
        cells: {
          symbol: "",
          name: subPortfolio.name,
          price: undefined,
          quantity: undefined,
          value,
          wallet: undefined,
          yield: apy > 0.0 ? apy : undefined,
        },
        subData,
      });
    }
  });

  result.sort((a, b) => b.cells.value - a.cells.value);
  return result;
}

export function getPortfolio(
  id: string,
  portfolios: PortfolioEntry[]
): PortfolioEntry | null {
  for (const portfolio of portfolios) {
    if (portfolio.id === id) {
      return portfolio;
    }
  }
  return null;
}

function computePortfolioMeta(
  portfolio: PortfolioEntry,
  portfolios: PortfolioEntry[],
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): PortfolioEntryMeta {
  let value = 0;
  let apy = 0;
  let price_change_24h = 0;

  for (const holding of portfolio.holdings) {
    const asset = getAsset(holding.symbol, assetInfo);

    if (asset !== null) {
      value += holding.quantity * asset.value;
    }
  }

  for (const holding of portfolio.holdings) {
    const asset = getAsset(holding.symbol, assetInfo);
    const walletAsset = getWalletAsset(
      holding.account,
      holding.symbol,
      wallets
    );
    const y = walletAsset?.apy || 0.0;
    const v = asset?.value || 0;
    // XXX: This is wrong, we need to first get total value with sub portfolios
    apy += y * (v / value);
    if (asset) {
      price_change_24h += asset.price_change_percentage_24h * (v / value);
    }
  }

  for (const pid of portfolio.portfolios) {
    const subp = getPortfolio(pid, portfolios);
    if (subp !== null) {
      const subMeta = computePortfolioMeta(
        subp,
        portfolios,
        assetInfo,
        wallets
      );
      value += subMeta.value;
      apy += subMeta.yield;
      price_change_24h +=
        subMeta.price_change_percentage_24h * (subMeta.value / value);
    }
  }
  return {
    value,
    price_change_percentage_24h: price_change_24h,
    yield: apy,
  };
}

export function computePortfoliosMeta(
  portfolios: PortfolioEntry[],
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): Record<string, PortfolioEntryMeta> {
  const result: Record<string, PortfolioEntryMeta> = {};
  for (const portfolio of portfolios) {
    result[portfolio.id] = computePortfolioMeta(
      portfolio,
      portfolios,
      assetInfo,
      wallets
    );
  }
  return result;
}
