import { Wallet, AssetInfo } from "../store/oracle";
import { PortfolioEntry, PortfolioEntryMeta } from "../store/account";
import { Strategy } from "../store/strategy";
import { PortfolioItem, calculatePortfolioItems } from "./portfolio";
import { assert } from "./helpers";

export function getStrategy(
  id: string,
  strategies: Strategy[]
): Strategy | null {
  for (const strategy of strategies) {
    if (strategy.id === id) {
      return strategy;
    }
  }
  return null;
}

export interface StrategyItem {
  asset: string;
  target: number;
  current: number;
}

export interface StrategyTableRow {
  cells: {
    symbol: string;
    target: number;
    current: number;
  };
  children?: StrategyTableRow[];
}

function calculateStrategyItems(
  sid: string,
  portfolios: PortfolioEntry[],
  portfolioMeta: Record<string, PortfolioEntryMeta[]>,
  assetInfo: AssetInfo[],
  wallets: Wallet[],
  strategies: Strategy[]
): StrategyItem[] {
  const result: StrategyItem[] = [];

  const strategy = getStrategy(sid, strategies);
  assert(strategy);

  const pmeta = Object.values(portfolioMeta)[0];
  console.log(pmeta);

  for (const target of strategy.targets) {
    result.push({
      asset: target.symbol,
      target: target.percent,
      current: 0.0,
    });
  }

  return result;
}

function prepareStrategyTableGroup(items: StrategyItem[]): StrategyTableRow[] {
  const result: StrategyTableRow[] = [];
  for (const item of items) {
    result.push({
      cells: {
        symbol: item.asset,
        target: item.target,
        current: item.current,
      },
    });
  }

  return result;
}

export function prepareStrategyTableData(
  sid: string,
  portfolios: PortfolioEntry[],
  portfolioMeta: Record<string, PortfolioEntryMeta[]>,
  assetInfo: AssetInfo[],
  wallets: Wallet[],
  strategies: Strategy[]
): StrategyTableRow[] {
  if (strategies.length === 0 || Object.keys(portfolioMeta).length === 0) {
    return [];
  }

  const items: StrategyItem[] = calculateStrategyItems(
    sid,
    portfolios,
    portfolioMeta,
    assetInfo,
    wallets,
    strategies
  );

  return prepareStrategyTableGroup(items);
}
