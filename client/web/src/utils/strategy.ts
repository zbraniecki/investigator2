import { Wallet, AssetInfo } from "../store/oracle";
import { PortfolioEntry } from "../store/account";
import { PortfolioItem, calculatePortfolioItems } from "./portfolio";

export interface StrategyTableRow {
  cells: {
    // wallet?: string;
    // symbol?: string;
    // quantity?: string;
    // yield?: number;
    // value: number;
  };
  children?: StrategyTableRow[];
}

function prepareStrategyTableGroup(
  items: PortfolioItem[],
  wallets: Wallet[]
): StrategyTableRow[] {
  const result: StrategyTableRow[] = [];
  // for (const item of items) {
  //   assert(item.meta.wallet);
  //   const wallet = getWallet(item.meta.wallet, wallets);
  //   assert(wallet);

  //   let children;
  //   let symbol;
  //   if (item.children) {
  //     children = prepareWalletTableGroup(item.children, wallets);
  //     for (const child of children) {
  //       child.cells.wallet = undefined;
  //     }
  //   } else {
  //     symbol = item.meta.symbol;
  //   }

  //   const row: WalletTableRow = {
  //     cells: {
  //       wallet: wallet.name,
  //       value: item.meta.value,
  //       yield: item.meta.yield,
  //       symbol,
  //     },
  //     children,
  //   };
  //   result.push(row);
  // }

  return result;
}

export function prepareStrategyTableData(
  pid: string,
  portfolios: PortfolioEntry[],
  assetInfo: AssetInfo[],
  wallets: Wallet[]
): StrategyTableRow[] {
  const items: PortfolioItem[] = calculatePortfolioItems(
    pid,
    portfolios,
    assetInfo,
    wallets
  );

  return prepareStrategyTableGroup(items, wallets);
}
