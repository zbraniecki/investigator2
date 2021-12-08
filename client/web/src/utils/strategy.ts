/* eslint camelcase: "off" */

import {
  Portfolio,
} from "../store/account";
import { AssetInfo, Wallet } from "../store/oracle";
import { Strategy } from "../store/strategy";
import { getAsset } from "./asset";
import { PortfolioTableRow } from "./portfolio";
import { buildPortfolioTableData, createPortfolioTableData } from "./portfolio";
import {
  assert,
  groupTableDataByColumn,
  groupTableDataByColumn2,
  computeGroupedTableData,
  GroupingStrategy
} from "./helpers";
import { DataRowProps, SymbolNameCell } from "../views/components/Table";

export interface StrategyTableRow {
  cells: {
    name?: SymbolNameCell | string;
    target?: number;
    current?: number;
    deviation?: number;
    delta?: number;
    deltaUsd?: number;
  };
  children?: StrategyTableRow[];
  type: "portfolio" | "asset" | "catch-all";
}

export function createStrategyTableData(
  strategy: Strategy,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>,
  computedTableData: Record<string, Record<string, any>>,
  topLevel: boolean,
): StrategyTableRow {
  let totalPortfolioValue = Object.values(computedTableData).reduce((total, asset) => {
    return total + asset.value;
  }, 0);

  let rows: StrategyTableRow[] = strategy.targets.map((target) => {
    let asset = assetInfo[target.asset];
    assert(asset);

    let computedData = computedTableData[asset.id];
    assert(computedData);

    let targetValue = totalPortfolioValue * target.percent;
    let currentPercent = computedData.value / totalPortfolioValue;
    let deviation = Math.abs(target.percent - currentPercent);
    let delta = targetValue / computedData.value - 1;
    let deltaUsd = targetValue - computedData.value;
    return {
      cells: {
        name: {
          name: asset.name,
          symbol: asset.symbol,
        },
        target: target.percent,
        current: currentPercent,
        deviation,
        delta,
        deltaUsd,
      },
      type: "asset",
    };
  });

  let targettedAssetIds = strategy.targets.map(target => target.asset);
  let unlistedAssetIds: Set<string> = new Set();
  for (let asset of Object.keys(computedTableData)) {
    if (!targettedAssetIds.includes(asset)) {
      unlistedAssetIds.add(asset);
    }
  }
  if (unlistedAssetIds.size > 0) {
    let children: StrategyTableRow[] = [];
    for (let assetId of unlistedAssetIds) {
      let asset = assetInfo[assetId];
      assert(asset);

      let computedData = computedTableData[asset.id];
      assert(computedData);

      let current = computedData.value / totalPortfolioValue;

      children.push({
        cells: {
          name: {
            name: asset.name,
            symbol: asset.symbol,
          },
          current,
        },
        type: "asset",
      });
    }

    rows.push({
      cells: {
        name: "?",
        current: children.reduce((total, row) => total + (row.cells.current || 0), 0),
      },
      children,
      type: "catch-all",
    });
  }
  console.log(unlistedAssetIds);

  return {
    cells: {
    },
    children: rows.length > 0 ? rows : undefined,
    type: "asset",
  };
}

export function prepareStrategyTableData(
  sid: string,
  strategies: Record<string, Strategy>,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>,
): StrategyTableRow | undefined {
  let strategy = strategies[sid];
  assert(strategy);
  if (Object.keys(assetInfo).length === 0 || Object.keys(portfolios).length === 0) {
    return undefined;
  }

  let portfolio = portfolios[strategy.portfolio];
  assert(portfolio);


  let portfolioData = buildPortfolioTableData(
    portfolio,
    portfolios,
    assetInfo,
  );
  let groupedPortfolioData = groupTableDataByColumn2(
    portfolioData,
    "id",
    true,
  );
  let computedTableData = computeGroupedTableData(groupedPortfolioData, ["value"]);

  let data = createStrategyTableData(
    strategy,
    portfolios,
    assetInfo,
    computedTableData,
    true,
  );

  return data;
}
