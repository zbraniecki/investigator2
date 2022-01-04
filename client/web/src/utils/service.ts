import { Portfolio, Holding } from "../store/user";
import { AssetInfo, Service, ServiceAsset } from "../store/oracle";
import { createPortfolioTableData } from "./portfolio";
import { assert, groupTableDataByColumn, GroupingStrategy } from "./helpers";
import { TableMeta } from "../views/components/table/data/Table";
import { CellAlign } from "../views/components/table/data/Column";
import { RowData, RowType } from "../views/components/table/data/Row";

export function getServiceAsset(
  serviceId: string,
  assetId: string,
  services: Record<string, Service>
): ServiceAsset | null {
  const service = services[serviceId];
  if (!service) {
    return null;
  }
  for (const asset of service.assets) {
    if (asset.id === assetId) {
      return asset;
    }
  }
  return null;
}

export interface WalletTableRow extends RowData {
  cells: {
    id: string;
    wallet?: string;
    name?: string;
    symbol?: string;
    quantity?: number;
    yield?: number;
    value?: number;
  };
  children?: WalletTableRow[];
  type: RowType;
}

export function prepareWalletTableData(
  pid: string,
  portfolios: Record<string, Portfolio>,
  assetInfo: Record<string, AssetInfo>,
  services: Record<string, Service>,
  holdings: Record<string, Holding>,
): WalletTableRow | undefined {
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
    {}, // XXX: This is really accounts, not services
    holdings,
    true
  ) as WalletTableRow;

  // if (data.children !== undefined) {
  //   data.children = groupTableDataByColumn(
  //     data.children,
  //     "wallet",
  //     [
  //       { key: "name", strategy: GroupingStrategy.IfSame },
  //       { key: "wallet", strategy: GroupingStrategy.IfSame },
  //     ],
  //     true
  //   ) as WalletTableRow[];
  // }

  return data;
}
