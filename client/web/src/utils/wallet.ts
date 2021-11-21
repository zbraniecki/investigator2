import { Wallet, WalletAsset, AssetInfo } from "../store/oracle";
import { PortfolioEntry } from "../store/account";
import { PortfolioItem, calculatePortfolioItems } from "./portfolio";
import { assert } from "./helpers";

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
    const item = children[0];
    assert(item);

    result.push({
      meta: {
        type: "wallet-group",
        id: wid,
        // symbol,
        // name,
        // price,
        // quantity,
        wallet: wid,
        value: 0,
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
    symbol?: string;
    quantity?: string;
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
    const row: WalletTableRow = {
      cells: {
        wallet: wallet.name,
        value: item.meta.value,
        yield: item.meta.yield,
      },
      // children,
    };
    result.push(row);
  }

  return result;
}

export function prepareWalletTableData(
  pid: string,
  portfolios: PortfolioEntry[],
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): WalletTableRow[] {
  let items: PortfolioItem[] = calculatePortfolioItems(
    pid,
    portfolios,
    assetInfo,
    wallets
  );
  items = groupItemsByWallet(items);

  return prepareWalletTableGroup(items, wallets);
}
