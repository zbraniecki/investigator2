import { useSelector } from "react-redux";
import { TableContainer } from "../components/table/Contrainer";
import {
  CellAlign,
  SortDirection,
  Formatter,
} from "../components/table/data/Column";
import { BaseTableMeta, TableSettings } from "../components/table/data/Table";
import { RowData } from "../components/table/data/Row";
import { preparePortfolioTableData } from "../../utils/portfolio";
import {
  Portfolio,
  getPortfolios,
  getUsers,
  getSession,
} from "../../store/account";
import { getAssetInfo, getWallets } from "../../store/oracle";
import { TabInfo } from "../components/Tabs";

const baseTableMeta: BaseTableMeta = {
  name: "portfolios",
  nested: true,
  columns: {
    id: {
      label: "ID",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      width: "5%",
    },
    name: {
      label: "Name",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      width: "15%",
      formatter: Formatter.Symbol,
    },
    price: {
      label: "Price",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      width: "auto",
      formatter: Formatter.Currency,
    },
    wallet: {
      label: "Wallet",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      width: "20%",
    },
    quantity: {
      label: "Quantity",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Number,
      editable: true,
      sensitive: true,
    },
    yield: {
      label: "Yield",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Percent,
      sensitive: true,
    },
    value: {
      label: "Value",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Currency,
      sensitive: true,
    },
  },
  //   pager: true,
  //   header: true,
  //   outline: true,
};

const tableSettings: TableSettings = {
  sortColumns: ["value"],
  columns: [
    {
      key: "name",
      visible: true,
    },
    {
      key: "price",
      visible: true,
    },
    {
      key: "wallet",
      visible: true,
    },
    {
      key: "quantity",
      visible: true,
    },
    {
      key: "yield",
      visible: true,
    },
    {
      key: "value",
      visible: true,
    },
  ],
};

export function Portfolios() {
  const portfolios: Record<string, Portfolio> = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);
  const wallets = useSelector(getWallets);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);

  let tabs: TabInfo[] = [];

  if (Object.keys(portfolios).length > 0) {
    const currentUser = session.username ? users[session.username] : undefined;
    const plists: string[] = currentUser?.ui.portfolios || [];

    tabs = plists
      .filter((pid) => pid in portfolios)
      .map((pid) => {
        const portfolio = portfolios[pid];
        return {
          id: portfolio.id,
          label: portfolio.name,
        };
      });
  }
  const getTableData = (id: string): RowData | undefined =>
    preparePortfolioTableData(id, portfolios, assetInfo, wallets);
  return (
    <TableContainer
      tabs={tabs}
      baseMeta={baseTableMeta}
      settings={tableSettings}
      getTableData={getTableData}
    />
  );
}
