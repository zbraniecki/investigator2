/* eslint camelcase: "off" */

import {
  PortfolioEntry,
  PortfolioItem,
  PortfolioEntryMeta,
} from "../store/account";
import { AssetInfo, Wallet } from "../store/oracle";
import { getAsset } from "./asset";
import { getWallet, getWalletAsset } from "./wallet";
import { assert } from "./helpers";

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

export function calculatePortfolioItems(
  pid: string,
  portfolios: PortfolioEntry[],
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): PortfolioItem[] {
  const items: PortfolioItem[] = [];

  const portfolio = getPortfolio(pid, portfolios);
  if (portfolio === null || assetInfo.length === 0) {
    return [];
  }

  for (const holding of portfolio.holdings) {
    const asset = getAsset(holding.symbol, assetInfo);
    assert(asset, `Missing asset: ${holding.symbol}`);

    const walletAsset = getWalletAsset(
      holding.account,
      holding.symbol,
      wallets
    );

    const price_change_percentage_24h = asset
      ? asset.price_change_percentage_24h / 100
      : undefined;

    items.push({
      meta: {
        type: "asset",
        id: holding.symbol,
        symbol: holding.symbol,
        name: asset?.name,
        price: asset?.value,
        quantity: holding.quantity,
        value: holding.quantity * (asset?.value || 0),
        wallet: holding.account,
        yield: walletAsset?.apy,
        price_change_percentage_24h,
      },
      children: null,
    });
  }

  return items;
}

function calculatePortfolioMeta(
  pid: string,
  portfolios: PortfolioEntry[],
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): PortfolioEntryMeta {
  const result: PortfolioEntryMeta = {
    value: 0,
    yield: 0,
    price_change_percentage_24h: 0,
    items: [],
  };
  const items = calculatePortfolioItems(pid, portfolios, assetInfo, wallets);

  /* Step 1: Calculate value of the portfolio */
  for (const item of items) {
    result.value += item.meta.value;
  }

  /* Step 2: Calculate other metas about portfolio */
  for (const item of items) {
    const itemShare = item.meta.value / result.value;

    if (item.meta.yield) {
      result.yield += item.meta.yield * itemShare;
    }
    if (item.meta.price_change_percentage_24h) {
      result.price_change_percentage_24h +=
        item.meta.price_change_percentage_24h * itemShare;
    }
  }

  result.items = items;

  return result;
}

export function calculatePortfoliosMeta(
  portfolios: PortfolioEntry[],
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): Record<string, PortfolioEntryMeta> {
  const result: Record<string, PortfolioEntryMeta> = {};
  for (const portfolio of portfolios) {
    result[portfolio.id] = calculatePortfolioMeta(
      portfolio.id,
      portfolios,
      assetInfo,
      wallets
    );
  }
  return result;
}

export interface PortfolioTableRow {
  cells: {
    symbol: {
      symbol?: string;
      name?: string;
    };
    price?: number;
    quantity?: number;
    value: number;
    wallet?: string;
    yield?: number;
  };
  children?: PortfolioTableRow[];
}

export function groupItemsByAsset(items: PortfolioItem[]): PortfolioItem[] {
  const result: PortfolioItem[] = [];

  const combinedItems: Record<string, PortfolioItem[]> = {};

  for (const item of items) {
    if (!Object.keys(combinedItems).includes(item.meta.id)) {
      combinedItems[item.meta.id] = [];
    }
    combinedItems[item.meta.id].push(item);
  }

  for (const children of Object.values(combinedItems)) {
    // children.sort((a, b) => b.meta.value - a.meta.value);

    const item = children[0];
    assert(item);

    if (children.length === 1) {
      result.push(item);
      continue;
    }

    let value = 0;
    let quantity = 0;

    for (const child of children) {
      value += child.meta.value;
      assert(child.meta.quantity);
      quantity += child.meta.quantity;
    }

    let apy = 0;
    for (const child of children) {
      const itemShare = child.meta.value / value;
      if (child.meta.yield) {
        apy += child.meta.yield * itemShare;
      }
    }

    result.push({
      meta: {
        type: "asset-group",
        id: item.meta.id,
        symbol: item.meta.symbol,
        name: item.meta.name,
        price: item.meta.price,
        quantity,
        value,
        yield: apy,
        price_change_percentage_24h: item.meta.price_change_percentage_24h,
      },
      children,
    });
  }

  return result;
}

function preparePortfolioTableGroup(
  items: PortfolioItem[],
  wallets: Wallet[]
): PortfolioTableRow[] {
  const result: PortfolioTableRow[] = [];
  for (const item of items) {
    const assetWallets = new Set();
    if (item.meta.wallet) {
      const wallet = getWallet(item.meta.wallet, wallets);
      assert(wallet);
      assetWallets.add(wallet.name);
    }

    let children;
    if (item.children) {
      children = preparePortfolioTableGroup(item.children, wallets);
      for (const child of children) {
        child.cells.symbol = {
          symbol: "",
          name: "",
        };
        child.cells.price = undefined;
      }
    }
    const row: PortfolioTableRow = {
      cells: {
        symbol: {
          symbol: item.meta.symbol,
          name: item.meta.name,
        },
        price: item.meta.price,
        quantity: item.meta.quantity,
        value: item.meta.value,
        wallet: Array.from(assetWallets).join(", "),
        yield: item.meta.yield,
      },
      children,
    };
    result.push(row);
  }

  return result;
}

export function preparePortfolioTableData(
  pid: string,
  portfolios: PortfolioEntry[],
  portfoliosMeta: Record<string, PortfolioEntryMeta>,
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): PortfolioTableRow[] {
  const meta = portfoliosMeta[pid];
  if (!meta) {
    return [];
  }
  let { items } = meta;
  items = groupItemsByAsset(items);

  // items.sort((a, b) => b.meta.value - a.meta.value);

  return preparePortfolioTableGroup(items, wallets);
}
