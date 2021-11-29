import { Wallet, AssetInfo } from "../store/oracle";
import {
  PortfolioEntry,
  PortfolioItem,
  PortfolioEntryMeta,
} from "../store/account";
import { Strategy } from "../store/strategy";
import { assert } from "./helpers";
import { groupItemsByAsset } from "./portfolio";
import { getAsset } from "./asset";

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
  symbol: string;
  name: string;
  target: number;
  current: number;
  deviation: number;
  delta: number;
  deltaUsd: number;
}

export interface StrategyTableRow {
  cells: {
    symbol: {
      symbol?: string;
      name?: string;
    };
    target: number;
    current: number;
    deviation: number;
    delta: number;
    deltaUsd: number;
  };
  children?: StrategyTableRow[];
}

function getAssetFromItems(
  symbol: string,
  items: PortfolioItem[]
): PortfolioItem | null {
  for (const item of items) {
    if (item.meta.id === symbol) {
      return item;
    }
  }
  return null;
}

function calculateStrategyItems(
  sid: string,
  portfolios: PortfolioEntry[],
  portfolioMeta: Record<string, PortfolioEntryMeta>,
  assetInfo: AssetInfo[],
  wallets: Wallet[],
  strategies: Strategy[]
): StrategyItem[] {
  const result: StrategyItem[] = [];

  const strategy = getStrategy(sid, strategies);
  assert(strategy);

  const pmeta = Object.values(portfolioMeta)[0];
  const items = groupItemsByAsset(pmeta.items);

  for (const target of strategy.targets) {
    const item = getAssetFromItems(target.symbol, items);
    let currentValue = 0;
    if (item) {
      currentValue += item.meta.value;
    }
    for (const symbol of target.contains) {
      const citem = getAssetFromItems(symbol, items);
      if (citem) {
        currentValue += citem.meta.value;
      }
    }

    const asset = getAsset(target.symbol, assetInfo);
    assert(asset);

    const currentPercent = currentValue / pmeta.value;
    const targetValue = pmeta.value * target.percent;
    const deviation = Math.abs(target.percent - currentPercent);
    const delta = targetValue / currentValue - 1;
    const deltaUsd = targetValue - currentValue;

    result.push({
      symbol: asset.symbol,
      name: asset.name,
      target: target.percent,
      current: currentPercent,
      deviation,
      delta,
      deltaUsd,
    });
  }

  return result;
}

function prepareStrategyTableGroup(items: StrategyItem[]): StrategyTableRow[] {
  const result: StrategyTableRow[] = [];
  for (const item of items) {
    result.push({
      cells: {
        symbol: {
          symbol: item.symbol,
          name: item.name,
        },
        target: item.target,
        current: item.current,
        deviation: item.deviation,
        delta: item.delta,
        deltaUsd: item.deltaUsd,
      },
    });
  }

  return result;
}

export function prepareStrategyTableData(
  sid: string,
  portfolios: PortfolioEntry[],
  portfolioMeta: Record<string, PortfolioEntryMeta>,
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
  // items.sort((a, b) => {
  //   if (b.target === a.target) {
  //     return b.current - a.current;
  //   }
  //   return b.target - a.target;
  // });

  return prepareStrategyTableGroup(items);
}
