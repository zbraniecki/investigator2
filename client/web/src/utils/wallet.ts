import { Wallet, WalletAsset, AssetInfo } from "../store/oracle";
import {
  PortfolioEntry,
  PortfolioEntryMeta,
  PortfolioItem,
} from "../store/account";
import { assert } from "./helpers";
import { getAsset } from "./asset";

export function getWallet(id: string, wallets: Wallet[]): Wallet | null {
  for (const wallet of wallets) {
    if (wallet.id === id) {
      return wallet;
    }
  }
  return null;
}

export function getWalletAsset(
  id: string,
  symbol: string,
  wallets: Wallet[]
): WalletAsset | null {
  for (const wallet of wallets) {
    if (wallet.id === id) {
      for (const asset of wallet.currency) {
        if (asset.symbol === symbol) {
          return asset;
        }
      }
      break;
    }
  }
  return null;
}

function groupItemsByWallet(items: PortfolioItem[]): PortfolioItem[] {
  const result: PortfolioItem[] = [];

  const combinedItems: Record<string, PortfolioItem[]> = {};

  for (const item of items) {
    if (!item.meta.wallet) {
      continue;
    }
    if (!Object.keys(combinedItems).includes(item.meta.wallet)) {
      combinedItems[item.meta.wallet] = [];
    }
    combinedItems[item.meta.wallet].push(item);
  }

  for (const [wid, children] of Object.entries(combinedItems)) {
    // children.sort((a, b) => b.meta.value - a.meta.value);

    const item = children[0];
    assert(item);

    let value = 0;

    for (const child of children) {
      value += child.meta.value;
    }

    result.push({
      meta: {
        type: "wallet-group",
        id: wid,
        // symbol: "",
        // name: ""
        // name,
        // price,
        // quantity,
        wallet: wid,
        value,
        // yield: apy,
        // price_change_percentage_24h: item.meta.price_change_percentage_24h,
      },
      children,
    });
  }

  return result;
}

export interface WalletTableRow {
  cells: {
    wallet?: string;
    symbol: {
      symbol?: string;
      name?: string;
    };
    quantity?: number;
    yield?: number;
    value: number;
  };
  children?: WalletTableRow[];
}

function prepareWalletTableGroup(
  items: PortfolioItem[],
  wallets: Wallet[]
): WalletTableRow[] {
  const result: WalletTableRow[] = [];
  for (const item of items) {
    assert(item.meta.wallet);
    const wallet = getWallet(item.meta.wallet, wallets);
    assert(wallet);

    let children;
    let symbol;
    if (item.children) {
      children = prepareWalletTableGroup(item.children, wallets);
      for (const child of children) {
        child.cells.wallet = undefined;
      }
    } else {
      symbol = item.meta.symbol;
    }

    const row: WalletTableRow = {
      cells: {
        wallet: wallet.name,
        value: item.meta.value,
        quantity: item.meta.quantity,
        symbol: {
          symbol: item.meta.symbol || "",
          name: item.meta.name || "",
        },
      },
      children,
    };
    result.push(row);
  }

  return result;
}

export function prepareWalletTableData(
  pid: string,
  portfolios: PortfolioEntry[],
  portfoliosMeta: Record<string, PortfolioEntryMeta>,
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): WalletTableRow[] {
  const meta = portfoliosMeta[pid];
  if (!meta) {
    return [];
  }
  let { items } = meta;
  items = groupItemsByWallet(items);

  // items.sort((a, b) => b.meta.value - a.meta.value);

  return prepareWalletTableGroup(items, wallets);
}
