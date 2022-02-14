/* eslint camelcase: "off" */

import { Portfolio, Account, Holding, Asset, Service } from "../types";
import { getServiceAsset } from "./service";
import { assert, groupTableDataByColumn, GroupingStrategy } from "./helpers";
import {
  RowData,
  RowType,
  CellData,
  StyledRowData,
  newCellData,
} from "../views/components/table/data/Row";

export function collectPortfolioHoldings(
  portfolio: Portfolio,
  portfolios: Record<string, Portfolio>,
  assets: Record<string, Asset>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>
): Set<Holding> {
  const result: Set<Holding> = new Set(
    Object.values(portfolio.holdings).map((hid) => holdings[hid])
  );

  Object.values(portfolio.accounts).forEach((aid) => {
    for (const hid of accounts[aid].holdings) {
      result.add(holdings[hid]);
    }
  });

  if (portfolio.tags.length > 0) {
    Object.values(accounts).forEach((account) => {
      account.holdings.forEach((hid) => {
        const holding = holdings[hid];
        const asset = assets[holding.asset];
        if (portfolio.tags.includes(asset.asset_class)) {
          result.add(holding);
        }
      });
    });
  }

  Object.values(portfolio.portfolios).forEach((pid) => {
    for (const hid of collectPortfolioHoldings(
      portfolios[pid],
      portfolios,
      assets,
      accounts,
      holdings
    )) {
      result.add(hid);
    }
  });

  return result;
}

export interface HoldingsGroup {
  item: string;
  children?: Array<HoldingsGroup>;
}

export function groupHoldings(
  holdings: Set<Holding>,
  column: string
): Array<HoldingsGroup> {
  const groups: Record<string, Array<Holding>> = {};

  for (const holding of holdings) {
    const key = holding[column];
    assert(key);
    if (!Object.prototype.hasOwnProperty.call(groups, key)) {
      groups[key] = [];
    }
    groups[key].push(holding);
  }

  return Object.entries(groups).map(([key, values]) => ({
    item: key,
    children: values.map((value) => ({
      item: value.pk,
    })),
  }));
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
    mcap_share?: number;
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
    mcap_share?: CellData<number>;
    minted_perc?: CellData<number>;
  };
  children?: StyledPortfolioTableRow[];
  type: RowType;
}

function computeHeaderData(
  portfolio: Portfolio,
  data: PortfolioTableRow[],
  topLevel: boolean
): PortfolioTableRow["cells"] {
  const cells: PortfolioTableRow["cells"] = {
    value:
      portfolio.value ??
      data.reduce((total, curr) => total + (curr.cells.value || 0), 0),
  };

  if (!topLevel) {
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

export function buildPortfolioTableData(
  portfolio: Portfolio,
  portfolios: Record<string, Portfolio>,
  holdings: Record<string, Holding>,
  assetInfo: Record<string, Asset>,
  accounts: Record<string, Account>,
  services: Record<string, Service>
): PortfolioTableRow[] {
  const rows: PortfolioTableRow[] = portfolio.holdings.map((hid) => {
    const { pk, asset: assetPk, quantity } = holdings[hid];
    const asset = assetInfo[assetPk];
    assert(asset);

    const mcap_share = asset.info.circulating_supply
      ? quantity / asset.info.circulating_supply
      : undefined;

    return {
      cells: {
        id: pk,
        asset: asset.pk,
        name: asset.name,
        symbol: asset.symbol,
        price: asset.info.value,
        quantity,
        value: asset.info.value * quantity,
        mcap: asset.info.market_cap,
        mcap_share,
        minted_perc: asset.info.circulating_supply / asset.info.max_supply,
      },
      type: RowType.Asset,
    };
  });
  const res2: PortfolioTableRow[] = portfolio.portfolios.map((pid) => {
    const subPortfolio = portfolios[pid];
    assert(subPortfolio);
    return {
      cells: {
        id: subPortfolio.pk,
        name: subPortfolio.name,
      },
      children: buildPortfolioTableData(
        subPortfolio,
        portfolios,
        holdings,
        assetInfo,
        accounts,
        services
      ),
      type: RowType.Portfolio,
    };
  });
  rows.push(...res2);
  if (portfolio.tags.length > 0) {
    Object.values(accounts).forEach((account) => {
      account.holdings.forEach((hid) => {
        const holding = holdings[hid];
        const asset = assetInfo[holding.asset];
        assert(asset);
        if (portfolio.tags.includes(asset.asset_class)) {
          let serviceAsset;
          if (account) {
            serviceAsset = getServiceAsset(account.service, asset.pk, services);
          }
          const mcap_share = asset.info.circulating_supply
            ? holding.quantity / asset.info.circulating_supply
            : undefined;

          rows.push({
            cells: {
              id: holding.pk,
              account_id: account?.pk,
              asset: asset.pk,
              name: asset.name,
              symbol: asset.symbol,
              price: asset.info.value,
              quantity: holding.quantity,
              value: asset.info.value * holding.quantity,
              account: account?.name,
              yield: serviceAsset?.apy,
              mcap: asset.info.market_cap,
              mcap_share,
              minted_perc:
                asset.info.circulating_supply / asset.info.max_supply,
            },
            type: RowType.Asset,
          });
        }
      });
    });
  }
  return rows;
}

export function createPortfolioTableData(
  portfolio: Portfolio,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, Asset>,
  services: Record<string, Service>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>,
  topLevel: boolean
): PortfolioTableRow {
  const rows: PortfolioTableRow[] = portfolio.holdings.map((hid) => {
    const { pk, asset: assetId, quantity, account: accountId } = holdings[hid];
    const asset = assetInfo[assetId];
    assert(asset, `Missing asset: ${assetId}`);
    const account = accountId ? accounts[accountId] : undefined;
    let serviceAsset;
    if (account) {
      serviceAsset = getServiceAsset(account.service, asset.pk, services);
    }
    const mcap_share = asset.info.circulating_supply
      ? quantity / asset.info.circulating_supply
      : undefined;

    return {
      cells: {
        id: pk,
        account_id: account?.pk,
        asset: asset.pk,
        name: asset.name,
        symbol: asset.symbol,
        price: asset.info.value,
        quantity,
        value: asset.info.value * quantity,
        account: account?.name,
        yield: serviceAsset?.apy,
        mcap: asset.info.market_cap,
        mcap_share,
        minted_perc: asset.info.circulating_supply / asset.info.max_supply,
      },
      type: RowType.Asset,
    };
  });
  const res2 = portfolio.portfolios.map((pid) => {
    const subPortfolio = portfolios[pid];
    assert(subPortfolio);
    return createPortfolioTableData(
      subPortfolio,
      portfolios,
      assetInfo,
      services,
      accounts,
      holdings,
      false
    );
  });
  rows.push(...res2);
  if (portfolio.tags.length > 0) {
    Object.values(accounts).forEach((account) => {
      account.holdings.forEach((hid) => {
        const holding = holdings[hid];
        const asset = assetInfo[holding.asset];
        assert(asset);
        if (portfolio.tags.includes(asset.asset_class)) {
          let serviceAsset;
          if (account) {
            serviceAsset = getServiceAsset(account.service, asset.pk, services);
          }

          const mcap_share = asset.info.circulating_supply
            ? holding.quantity / asset.info.circulating_supply
            : undefined;

          rows.push({
            cells: {
              id: holding.pk,
              account_id: account?.pk,
              asset: asset.pk,
              name: asset.name,
              symbol: asset.symbol,
              price: asset.info.value,
              quantity: holding.quantity,
              value: asset.info.value * holding.quantity,
              account: account?.name,
              yield: serviceAsset?.apy,
              mcap: asset.info.market_cap,
              mcap_share,
              minted_perc:
                asset.info.circulating_supply / asset.info.max_supply,
            },
            type: RowType.Asset,
          });
        }
      });
    });
  }

  rows.sort((a, b) => (b.cells.value || 0) - (a.cells.value || 0));

  const cells = computeHeaderData(portfolio, rows, topLevel);

  return {
    cells,
    children: rows.length > 0 ? rows : undefined,
    type: RowType.Portfolio,
  };
}

export function preparePortfolioTableData(
  pid: string,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, Asset>,
  services: Record<string, Service>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>
): PortfolioTableRow | undefined {
  const portfolio = portfolios[pid];
  assert(portfolio);
  if (Object.keys(assetInfo).length === 0) {
    return undefined;
  }

  const data = createPortfolioTableData(
    portfolio,
    portfolios,
    assetInfo,
    services,
    accounts,
    holdings,
    true
  );
  if (data.children !== undefined) {
    data.children = groupTableDataByColumn(
      data.children,
      "asset",
      [
        { key: "name", strategy: GroupingStrategy.IfSame },
        { key: "price", strategy: GroupingStrategy.IfSame },
        { key: "account", strategy: GroupingStrategy.IfSame },
        { key: "yield", strategy: GroupingStrategy.Average },
        { key: "quantity", strategy: GroupingStrategy.Sum },
        { key: "mcap", strategy: GroupingStrategy.IfSame },
        { key: "mcap_share", strategy: GroupingStrategy.Sum },
        { key: "minted_perc", strategy: GroupingStrategy.IfSame },
      ],
      false
    ) as PortfolioTableRow[];
  }

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
      mcap_share: newCellData(data.cells.mcap_share),
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
