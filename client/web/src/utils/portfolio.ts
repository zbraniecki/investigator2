import { PortfolioEntry } from "../store/account";
import { AssetInfo } from "../store/oracle";
import { getAsset } from "./asset";

export interface PortfolioTableRow {
  cells: {
    symbol: string;
    name: string;
    price: number;
    quantity: number;
    value: number;
  };
  subData?: PortfolioTableRow[];
}

export function preparePortfolioTableData(
  portfolios: PortfolioEntry[],
  idx: number,
  assetInfo: AssetInfo[]
): PortfolioTableRow[] {
  if (portfolios.length === 0 || assetInfo.length === 0) {
    return [];
  }
  const portfolio = portfolios[0];
  const result = portfolio.holdings.map((holding) => {
    const asset = getAsset(holding.symbol, assetInfo);
    if (asset === null) {
      return {
        cells: {
          symbol: "?",
          name: "?",
          price: 0.0,
          value: 0.0,
          quantity: 0.0,
        },
      };
    }
    return {
      cells: {
        symbol: holding.symbol,
        name: asset.name,
        price: asset.value,
        quantity: holding.quantity,
        value: holding.quantity * asset.value,
      },
    };
  });
  result.sort((a, b) => b.cells.value - a.cells.value);
  return result;
}
