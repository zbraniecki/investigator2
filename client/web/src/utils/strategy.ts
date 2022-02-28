/* eslint camelcase: "off" */

import {
  Portfolio,
  Holding,
  Asset,
  Strategy,
  Target,
  TargetChange,
  Account,
  Service,
} from "../types";
import { buildPortfolioTableData } from "./portfolio";
import {
  assert,
  groupTableDataByColumn2,
  computeGroupedTableData,
} from "./helpers";
import {
  RowData,
  RowType,
  CellData,
  StyledRowData,
  newCellData,
} from "../views/components/table/data/Row";

export interface StrategyTableRow extends RowData {
  cells: {
    id?: string;
    name?: string;
    target?: number;
    current?: number;
    deviation?: number;
    delta?: number;
    deltaUsd?: number;
  };
  children?: StrategyTableRow[];
  type: RowType;
}

export interface StyledStrategyTableRow extends StyledRowData {
  cells: {
    id?: CellData<string>;
    name?: CellData<string>;
    target?: CellData<number>;
    current?: CellData<number>;
    deviation?: CellData<number>;
    delta?: CellData<number>;
    deltaUsd?: CellData<number>;
  };
  children?: StyledStrategyTableRow[];
  type: RowType;
}

function computeHeaderData(
  strategy: Strategy,
  data: StrategyTableRow[]
): StrategyTableRow["cells"] {
  const deltaUsd = data.reduce(
    (total, curr) =>
      total +
      (curr.cells.deltaUsd && curr.cells.deltaUsd > 0
        ? curr.cells.deltaUsd
        : 0),
    0
  );
  const deviation = data.reduce(
    (total, curr) =>
      total +
      (curr.cells.deviation && Number.isFinite(curr.cells.deviation)
        ? curr.cells.deviation
        : 0),
    0
  );
  const target = data.reduce(
    (total, curr) => total + (curr.cells.target ?? 0),
    0
  );
  const cells = {
    deltaUsd,
    target: target === 1.0 ? undefined : target,
    deviation,
  };
  return cells;
}

export function createStrategyTableData(
  strategy: Strategy,
  targets: Record<string, Target>,
  targetChanges: Record<string, TargetChange>,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, Asset>,
  computedTableData: Record<string, Record<string, any>>
): StrategyTableRow {
  const totalPortfolioValue = Object.values(computedTableData).reduce(
    (total, asset) => total + asset.value,
    0
  );

  const rows: StrategyTableRow[] = Object.values(strategy.targets).map(
    (tid) => {
      const target = targets[tid];
      const asset = assetInfo[target.asset];
      assert(asset);

      const computedData = computedTableData[asset.pk];

      let currentValue = computedData?.value || 0;

      for (const a of target.contains) {
        const containsAsset = assetInfo[a];
        assert(containsAsset);
        const subComputedData = computedTableData[containsAsset.pk];
        currentValue += subComputedData?.value || 0;
      }
      const targetValue = totalPortfolioValue * target.percent;
      const currentPercent = currentValue / totalPortfolioValue;
      const deviation = Math.abs(target.percent - currentPercent);
      const delta = targetValue / currentValue - 1;
      const deltaUsd = targetValue - currentValue;
      return {
        cells: {
          id: target.pk,
          name: asset.symbol.toUpperCase(),
          target: target.percent,
          current: currentPercent,
          deviation,
          delta,
          deltaUsd,
        },
        type: RowType.Asset,
      };
    }
  );

  const targettedAssetIds = Object.values(strategy.targets)
    .map((tid) => {
      const target = targets[tid];
      return [target.asset, ...target.contains];
    })
    .flat();
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
        type: RowType.Asset,
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
      type: RowType.Portfolio,
    });
  }

  const cells = computeHeaderData(strategy, rows);

  return {
    cells,
    children: rows.length > 0 ? rows : undefined,
    type: RowType.Asset,
  };
}

export function prepareStrategyTableData(
  sid: string,
  strategies: Record<string, Strategy>,
  targets: Record<string, Target>,
  targetChanges: Record<string, TargetChange>,
  portfolios: Record<string, Portfolio>,
  holdings: Record<string, Holding>,
  assetInfo: Record<string, Asset>,
  accounts: Record<string, Account>,
  services: Record<string, Service>
): StrategyTableRow | undefined {
  const strategy = strategies[sid];
  assert(strategy);

  if (
    Object.keys(assetInfo).length === 0 ||
    Object.keys(portfolios).length === 0
  ) {
    return undefined;
  }

  const portfolio = portfolios[strategy.portfolio];
  assert(portfolio);

  const portfolioData = buildPortfolioTableData(
    portfolio,
    portfolios,
    holdings,
    assetInfo,
    accounts,
    services
  );
  const groupedPortfolioData = groupTableDataByColumn2(
    portfolioData,
    "asset",
    true
  );
  assert(groupedPortfolioData.ungrouped.length === 0);
  const computedTableData = computeGroupedTableData(
    groupedPortfolioData.grouped,
    ["value"]
  );

  const data = createStrategyTableData(
    strategy,
    targets,
    targetChanges,
    portfolios,
    assetInfo,
    computedTableData
  );

  return data;
}

interface StylingColumnData {
  mean: number;
  stdev: number;
}

type StylingTableData = Record<string, StylingColumnData>;

export function computeStrategyTableDataStyle(
  data: StrategyTableRow
): StyledStrategyTableRow {
  const stylingInfo: StylingTableData = {
    delta: {
      mean: 0.005,
      stdev: 0.005,
    },
  };

  const result: StyledStrategyTableRow = {
    cells: {
      id: newCellData(data.cells.id),
      name: newCellData(data.cells.name),
      target: newCellData(data.cells.target),
      current: newCellData(data.cells.current),
      deviation: newCellData(data.cells.deviation),
      delta: newCellData(data.cells.delta),
      deltaUsd: newCellData(data.cells.deltaUsd),
    },
    children: data.children?.map((row) => computeStrategyTableDataStyle(row)),
    type: data.type,
  };

  for (const [key, cell] of Object.entries(result.cells)) {
    const info = stylingInfo[key];
    if (info === undefined) {
      continue;
    }
    if (!cell) {
      continue;
    }
    if (cell.value === null) {
      continue;
    }
    assert(typeof cell.value === "number");
    if (cell.value > info.mean + info.stdev) {
      cell.color = "green";
    } else if (cell.value < (info.mean + info.stdev) * -1) {
      cell.color = "red";
    }
  }

  return result;
}
