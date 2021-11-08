import { PortfolioEntry, Holding } from "../store/account";
import { AssetInfo } from "../store/oracle";
import { getAsset } from "./asset";

export interface PortfolioTableRow {
  cells: {
    symbol: string | undefined;
    name: string | undefined;
    price: number | undefined;
    quantity: number | undefined;
    value: number;
    wallet: string | undefined;
  };
  subData?: PortfolioTableRow[];
}

export function preparePortfolioTableData(
  pid: string,
  portfolios: PortfolioEntry[],
  assetInfo: AssetInfo[]
): PortfolioTableRow[] {
  const portfolio = getPortfolio(pid, portfolios);
  if (portfolio === null || assetInfo.length === 0) {
    return [];
  }

  const assets: Record<string, Holding[]> = {};

  for (const holding of portfolio.holdings) {
    if (!Object.keys(assets).includes(holding.symbol)) {
      assets[holding.symbol] = [];
    }
    assets[holding.symbol].push(holding);
  }

  const result: PortfolioTableRow[] = [];

  for (const [symbol, holdings] of Object.entries(assets)) {
    const asset = getAsset(symbol, assetInfo);

    const subData: PortfolioTableRow[] = holdings.map((holding) => {
      const price = asset?.value || 0;
      return {
        cells: {
          symbol: undefined,
          name: undefined,
          price: undefined,
          quantity: holding.quantity,
          value: holding.quantity * price,
          wallet: holding.account,
        },
      };
    });
    subData.sort((a, b) => b.cells.value - a.cells.value);
    const price = asset?.value;
    let value = 0;
    let quantity = 0;
    for (const row of subData) {
      value += row.cells.value;
      quantity += row.cells.quantity || 0;
    }

    const row: PortfolioTableRow = {
      cells: {
        symbol,
        name: asset?.name,
        price,
        quantity,
        value,
        wallet: undefined,
      },
    };
    if (subData.length > 1) {
      row.subData = subData;
    }
    result.push(row);
  }

  portfolio.portfolios.forEach((subPid) => {
    const subPortfolio = getPortfolio(subPid, portfolios);
    if (subPortfolio === null) {
      result.push({
        cells: {
          symbol: "",
          name: subPid,
          price: undefined,
          quantity: undefined,
          value: 0,
          wallet: undefined,
        },
      });
    } else {
      const subData = preparePortfolioTableData(subPid, portfolios, assetInfo);

      let value = 0;
      for (const row of subData) {
        value += row.cells.value;
      }

      result.push({
        cells: {
          symbol: "",
          name: subPortfolio.name,
          price: undefined,
          quantity: undefined,
          value,
          wallet: undefined,
        },
        subData,
      });
    }
  });

  result.sort((a, b) => b.cells.value - a.cells.value);
  return result;
}

export function getPortfolio(
  id: string,
  portfolios: PortfolioEntry[]
): PortfolioEntry | null {
  for (const portfolio of portfolios) {
    if (portfolio.id === id) {
      return portfolio;
    }
  }
  return null;
}
