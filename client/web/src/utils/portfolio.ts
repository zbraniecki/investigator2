/* eslint camelcase: "off" */

import { Portfolio, Account, Holding, Asset, Service } from "../types";
import { assert } from "./helpers";
import { DataState } from "./state";
import {
  RowData,
  RowType,
  CellData,
  StyledRowData,
  newCellData,
} from "../views/components/table/data/Row";
import {
  CollectionType,
  Collection,
  collectPortfolioHoldings,
  groupCollectionItems,
  CollectionGroupKey,
} from "./collections";

export function isSufficientDataLoaded(state: DataState): boolean {
  return (
    state.portfolios !== undefined &&
    state.assets !== undefined &&
    state.holdings !== undefined &&
    state.accounts !== undefined
  );
}

export interface PortfolioTableRow extends RowData {
  cells: {
    id?: string;
    account_id?: string;
    asset?: string;
    name?: string;
    symbol?: string;
    price?: number;
    quantity?: number;
    value?: number;
    account?: string;
    yield?: number;
    mcap?: number;
    circ_supply_share?: number;
    minted_perc?: number;
  };
  children?: PortfolioTableRow[];
  type: RowType;
}
export interface StyledPortfolioTableRow extends StyledRowData {
  cells: {
    id?: CellData<string>;
    account_id?: CellData<string>;
    asset?: CellData<string>;
    name?: CellData<string>;
    symbol?: CellData<string>;
    price?: CellData<number>;
    quantity?: CellData<number>;
    value?: CellData<number>;
    account?: CellData<string>;
    yield?: CellData<number>;
    mcap?: CellData<number>;
    circ_supply_share?: CellData<number>;
    minted_perc?: CellData<number>;
  };
  children?: StyledPortfolioTableRow[];
  type: RowType;
}

function computeHeaderData(
  data: PortfolioTableRow[],
  topLevel: boolean,
  portfolio?: Portfolio
): PortfolioTableRow["cells"] {
  const cells: PortfolioTableRow["cells"] = {
    value:
      portfolio?.value ??
      data.reduce((total, curr) => total + (curr.cells.value || 0), 0),
  };

  if (!topLevel && portfolio) {
    cells.name = portfolio.name;
  }

  const totalYield = data.reduce((total, row) => {
    if (row.cells.yield && row.cells.value && cells.value) {
      const perc = row.cells.value / cells.value;
      return total + row.cells.yield * perc;
    }
    return total;
  }, 0);

  if (totalYield > 0) {
    cells.yield = totalYield;
  }

  if (cells.value === 0) {
    cells.value = undefined;
  }
  return cells;
}

function convertCollectionToTableRow(
  item: Collection,
  state: {
    accounts: Record<string, Account>;
    assets: Record<string, Asset>;
    holdings: Record<string, Holding>;
    portfolios: Record<string, Portfolio>;
    services: Record<string, Service>;
  },
  topLevel: boolean
): PortfolioTableRow {
  switch (item.type) {
    case CollectionType.Portfolio: {
      assert(item.pk);
      const portfolio = state.portfolios[item.pk];
      assert(item.items);
      const children: PortfolioTableRow[] = Array.from(item.items).map((item) =>
        convertCollectionToTableRow(item, state, false)
      );

      const cells = children.length
        ? computeHeaderData(children, topLevel, portfolio)
        : {};
      return {
        cells,
        children,
        type: RowType.Portfolio,
      };
    }
    case CollectionType.Asset: {
      assert(item.pk);
      assert(item.items);
      const asset = state.assets[item.pk];

      const children: PortfolioTableRow[] = Array.from(item.items)
        .map((item) => convertCollectionToTableRow(item, state, false))
        .filter((i): i is PortfolioTableRow => i != null);

      const quantity = children.reduce((total, row) => {
        assert(row.cells.quantity !== undefined);
        return total + row.cells.quantity;
      }, 0);
      const circ_supply_share = asset.info.max_supply
        ? quantity / asset.info.max_supply
        : undefined;

      const totalValue = asset.info.value * quantity;

      const totalYield = children.reduce((total, row) => {
        if (row.cells.yield && row.cells.value) {
          const perc = row.cells.value / totalValue;
          return total + row.cells.yield * perc;
        }
        return total;
      }, 0);

      children.forEach((row) => {
        row.cells.name = undefined;
        row.cells.price = undefined;
        row.cells.mcap = undefined;
      });

      return {
        cells: {
          id: asset.pk,
          asset: asset.pk,
          name: asset.symbol.toUpperCase(),
          symbol: asset.symbol,
          price: asset.info.value,
          quantity,
          value: totalValue,
          yield: totalYield,
          mcap: asset.info.market_cap,
          circ_supply_share,
          minted_perc: asset.info.circulating_supply / asset.info.max_supply,
        },
        type: RowType.Asset,
        children,
      };
    }
    case CollectionType.Holding: {
      assert(item.pk);
      const holding = state.holdings[item.pk];
      const asset = state.assets[holding.asset];
      const account = holding.account
        ? state.accounts[holding.account]
        : undefined;
      const service = account ? state.services[account.service] : undefined;

      const circ_supply_share = asset.info.max_supply
        ? holding.quantity / asset.info.max_supply
        : undefined;

      let serviceAsset = service?.assets.find((a) => {
        return a.asset_pk === asset.pk;
      });
      return {
        cells: {
          id: holding.pk,
          account_id: account?.pk,
          asset: asset.pk,
          name: asset.symbol.toUpperCase(),
          symbol: asset.symbol,
          price: asset.info.value,
          quantity: holding.quantity,
          value: asset.info.value * holding.quantity,
          account: service?.provider_name,
          yield: serviceAsset?.apy,
          mcap: asset.info.market_cap,
          circ_supply_share,
          minted_perc: asset.info.circulating_supply / asset.info.max_supply,
        },
        type: RowType.Holding,
      };
    }
    case CollectionType.Account: {
      assert(item.pk);
      assert(item.items);
      const account = state.accounts[item.pk];

      const children: PortfolioTableRow[] = Array.from(item.items).map((item) =>
        convertCollectionToTableRow(item, state, false)
      );

      const cells = children.length ? computeHeaderData(children, false) : {};
      cells.name = account.name;

      return {
        cells,
        children,
        type: RowType.Account,
      };
    }
    default: {
      console.log(item.type);
      assert(false);
    }
  }
}

export function preparePortfolioTableData(
  pid: string,
  state: {
    accounts: Record<string, Account>;
    assets: Record<string, Asset>;
    holdings: Record<string, Holding>;
    portfolios: Record<string, Portfolio>;
    services: Record<string, Service>;
  }
): PortfolioTableRow | null {
  const portfolio = state.portfolios[pid];
  assert(portfolio);

  const collection = collectPortfolioHoldings(
    portfolio,
    state,
    [CollectionType.Account, CollectionType.Portfolio],
    true,
    null
  );

  const groupedCollection = groupCollectionItems(
    collection,
    CollectionGroupKey.Asset,
    state,
    {
      collapseSingle: true,
    }
  );

  const data = convertCollectionToTableRow(groupedCollection, state, true);

  return data;
}

interface StylingColumnData {
  mean: number;
  stdev: number;
}

type StylingTableData = Record<string, StylingColumnData>;

export function computePortfolioTableDataStyle(
  data: PortfolioTableRow
): StyledPortfolioTableRow {
  const stylingInfo: StylingTableData = {
    // price: {
    //   mean: 0.005,
    //   stdev: 0.005,
    // },
  };

  const result: StyledPortfolioTableRow = {
    cells: {
      id: newCellData(data.cells.id),
      account_id: newCellData(data.cells.account_id),
      asset: newCellData(data.cells.asset),
      name: newCellData(data.cells.name),
      symbol: newCellData(data.cells.symbol),
      price: newCellData(data.cells.price),
      quantity: newCellData(data.cells.quantity),
      value: newCellData(data.cells.value),
      account: newCellData(data.cells.account),
      yield: newCellData(data.cells.yield),
      mcap: newCellData(data.cells.mcap),
      circ_supply_share: newCellData(data.cells.circ_supply_share),
      minted_perc: newCellData(data.cells.minted_perc),
    },
    children: data.children?.map((row) => computePortfolioTableDataStyle(row)),
    type: data.type,
  };

  for (const [key, cell] of Object.entries(result.cells)) {
    const info = stylingInfo[key];
    if (info === undefined) {
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
