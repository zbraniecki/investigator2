import { Portfolio } from "../store/account";
import { AssetInfo, Wallet, WalletAsset } from "../store/oracle";
import { createPortfolioTableData } from "./portfolio";
import { assert, groupTableDataByColumn, GroupingStrategy } from "./helpers";
import { TableMeta } from "../views/components/table/data/Table";
import { CellAlign } from "../views/components/table/data/Column";
import { RowData, RowType } from "../views/components/table/data/Row";

export function getWalletAsset(
  walletId: string,
  assetId: string,
  wallets: Record<string, Wallet>
): WalletAsset | null {
  const wallet = wallets[walletId];
  if (!wallet) {
    return null;
  }
  for (const asset of wallet.assets) {
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
  wallets: Record<string, Wallet>
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
    wallets,
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
