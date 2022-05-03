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
import { assert } from "./helpers";
import { DataState } from "./state";
import {
  CollectionType,
  Collection,
  collectPortfolioHoldings,
  groupCollectionItems,
  CollectionGroupKey,
} from "./collections";
import {
  RowData,
  RowType,
  CellData,
  StyledRowData,
  newCellData,
} from "../views/components/table/data/Row";

export function isSufficientDataLoaded(state: DataState): boolean {
  return (
    state.accounts !== undefined &&
    state.assets !== undefined &&
    state.holdings !== undefined &&
    state.portfolios !== undefined &&
    state.strategies !== undefined &&
    state.targets !== undefined &&
    state.targetChanges !== undefined &&
    state.users !== undefined
  );
}

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

function convertCollectionToTableRow(
  item: Collection,
  sid: string,
  state: {
    accounts: Record<string, Account>;
    assets: Record<string, Asset>;
    holdings: Record<string, Holding>;
    portfolios: Record<string, Portfolio>;
    services: Record<string, Service>;
    strategies: Record<string, Strategy>;
    targets: Record<string, Target>;
  }
): StrategyTableRow {
  const strategy = state.strategies[sid];
  assert(strategy);

  switch (item.type) {
    case CollectionType.Portfolio: {
      assert(item.pk);
      const portfolio = state.portfolios[item.pk];
      assert(item.items);
      const ungroupedAssets = new Set();

      const assetValues: Record<string, number> = {};

      Array.from(item.items).forEach((item) => {
        assert(item.pk);
        const asset = state.assets[item.pk];
        assert(asset);
        assert(item.items);

        const assetValue = Array.from(item.items).reduce((total, item) => {
          assert(item.pk);
          const holding = state.holdings[item.pk];
          return total + holding.quantity * asset.info.value;
        }, 0);
        assetValues[item.pk] = assetValue;
      });

      const totalValue = Object.values(assetValues).reduce(
        (total, item) => total + item,
        0
      );

      let children: StrategyTableRow[] = Array.from(item.items).map((item) =>
        convertCollectionToTableRow(item, sid, state)
      );

      for (const tid of strategy.targets) {
        const target = state.targets[tid];
        if (!assetValues[target.asset]) {
          const asset = state.assets[target.asset];
          children.push({
            cells: {
              id: asset.pk,
              name: asset.symbol.toUpperCase(),
              target: target?.percent,
            },
            type: RowType.Asset,
          });
          assetValues[target.asset] = 0;
        }
      }

      // children = children.filter((row) => {
      // 	assert(row.cells.id);
      // 	let asset = state.assets[row.cells.id];
      // 	for (let tid of strategy.targets) {
      // 		let target = state.targets[tid];
      // 		if (target.contains.includes(asset.pk)) {
      // 			return false;
      // 		}
      // 	}
      // 	return true;
      // });

      children.forEach((row) => {
        assert(row.cells.id);
        const assetValue = assetValues[row.cells.id];
        assert(assetValue !== undefined);
        const currentPercent = assetValue / totalValue;
        row.cells.current = currentPercent;

        const targetPercent = row.cells.target;
        if (!targetPercent) {
          return;
        }
        const targetValue = totalValue * targetPercent;

        const deviation = Math.abs(targetPercent - currentPercent);
        const delta = targetValue / assetValue - 1;
        const deltaUsd = targetValue - assetValue;

        row.cells.deviation = deviation;
        row.cells.delta = delta;
        row.cells.deltaUsd = deltaUsd;
      });

      const ungroupedChildren = children.filter(
        (item) => item.cells.target === undefined
      );
      children = children.filter((item) => item.cells.target !== undefined);

      const ungroupedChildrenTotal = ungroupedChildren.reduce((total, item) => {
        assert(item.cells.current);
        return total + item.cells.current;
      }, 0);

      children.push({
        cells: {
          name: "?",
          current: ungroupedChildrenTotal,
        },
        children: ungroupedChildren,
        type: RowType.Group,
      });

      const cells = children.length
        ? computeHeaderData(strategy, children)
        : {};
      return {
        cells,
        children,
        type: RowType.Portfolio,
      };
    }
    case CollectionType.Asset: {
      assert(item.pk);
      const asset = state.assets[item.pk];
      const tid = strategy.targets.find(
        (tid) => state.targets[tid].asset === asset.pk
      );
      const target = tid ? state.targets[tid] : undefined;

      return {
        cells: {
          id: asset.pk,
          name: asset.symbol.toUpperCase(),
          target: target?.percent,
        },
        type: RowType.Asset,
      };
    }
    default: {
      console.log(item.type);
      assert(false);
    }
  }
}

export function prepareStrategyTableData(
  sid: string,
  state: {
    accounts: Record<string, Account>;
    assets: Record<string, Asset>;
    holdings: Record<string, Holding>;
    portfolios: Record<string, Portfolio>;
    services: Record<string, Service>;
    strategies: Record<string, Strategy>;
    targets: Record<string, Target>;
    targetChanges: Record<string, TargetChange>;
  }
): StrategyTableRow | null {
  const strategy = state.strategies[sid];
  assert(strategy);

  const portfolio = state.portfolios[strategy.portfolio];
  assert(portfolio);

  const collection = collectPortfolioHoldings(portfolio, state, [], null);

  const groupedCollection = groupCollectionItems(
    collection,
    CollectionGroupKey.Asset,
    state,
    {
      collapseSingle: false,
    }
  );

  const data = convertCollectionToTableRow(
    groupedCollection,
    strategy.pk,
    state
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
