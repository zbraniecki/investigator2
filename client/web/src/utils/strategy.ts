/* eslint camelcase: "off" */

import { Portfolio } from "../store/user";
import { AssetInfo } from "../store/oracle";
import { Strategy } from "../store/strategy";
import { buildPortfolioTableData } from "./portfolio";
import {
  assert,
  groupTableDataByColumn2,
  computeGroupedTableData,
} from "./helpers";
// import { SymbolNameCell } from "../views/components/Table";

export interface StrategyTableRow {
  cells: {
    name?: string;
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
  computedTableData: Record<string, Record<string, any>>
): StrategyTableRow {
  const totalPortfolioValue = Object.values(computedTableData).reduce(
    (total, asset) => total + asset.value,
    0
  );

  const rows: StrategyTableRow[] = strategy.targets.map((target) => {
    const asset = assetInfo[target.asset];
    assert(asset);

    const computedData = computedTableData[asset.pk];

    const currentValue = computedData?.value || 0;
    const targetValue = totalPortfolioValue * target.percent;
    const currentPercent = currentValue / totalPortfolioValue;
    const deviation = Math.abs(target.percent - currentPercent);
    const delta = targetValue / currentValue - 1;
    const deltaUsd = targetValue - currentValue;
    return {
      cells: {
        name: asset.name,
        target: target.percent,
        current: currentPercent,
        deviation,
        delta,
        deltaUsd,
      },
      type: "asset",
    };
  });

  const targettedAssetIds = strategy.targets.map((target) => target.asset);
  const unlistedAssetIds: Set<string> = new Set();
  for (const asset of Object.keys(computedTableData)) {
    if (!targettedAssetIds.includes(asset)) {
      unlistedAssetIds.add(asset);
    }
  }
  if (unlistedAssetIds.size > 0) {
    const children: StrategyTableRow[] = [];
    for (const assetId of unlistedAssetIds) {
      const asset = assetInfo[assetId];
      assert(asset);

      const computedData = computedTableData[asset.pk];
      assert(computedData);

      const current = computedData.value / totalPortfolioValue;

      children.push({
        cells: {
          name: asset.name,
          current,
        },
        type: "asset",
      });
    }

    rows.push({
      cells: {
        name: "?",
        current: children.reduce(
          (total, row) => total + (row.cells.current || 0),
          0
        ),
      },
      children,
      type: "catch-all",
    });
  }

  return {
    cells: {},
    children: rows.length > 0 ? rows : undefined,
    type: "asset",
  };
}

export function prepareStrategyTableData(
  sid: string,
  strategies: Record<string, Strategy>,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>
): StrategyTableRow | undefined {
  // const strategy = strategies[sid];
  // assert(strategy);
  // if (
  //   Object.keys(assetInfo).length === 0 ||
  //   Object.keys(portfolios).length === 0
  // ) {
  //   return undefined;
  // }

  // const portfolio = portfolios[strategy.portfolio];
  // assert(portfolio);

  // const portfolioData = buildPortfolioTableData(
  //   portfolio,
  //   portfolios,
  //   assetInfo
  // );
  // const groupedPortfolioData = groupTableDataByColumn2(
  //   portfolioData,
  //   "id",
  //   true
  // );
  // const computedTableData = computeGroupedTableData(groupedPortfolioData, [
  //   "value",
  // ]);

  // const data = createStrategyTableData(
  //   strategy,
  //   portfolios,
  //   assetInfo,
  //   computedTableData
  // );

  // return data;
  return undefined;
}
