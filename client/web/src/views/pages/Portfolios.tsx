import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { TableContainer } from "../components/table/Contrainer";
import {
  TableData,
  Formatter,
  CellAlign,
  SortDirection,
} from "../components/table/Data";
import { preparePortfolioTableData } from "../../utils/portfolio";
import {
  Portfolio,
  getPortfolios,
  getUsers,
  getSession,
} from "../../store/account";
import { getAssetInfo, getWallets } from "../../store/oracle";
// import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
import { TabRow, TabInfo } from "../components/Tabs";

const tableMeta: TableData = {
  name: "portfolio",
  sortColumns: ["value"],
  //   nested: true,
  headers: [
    {
      label: "Name",
      key: "name",
      align: CellAlign.Left,
      sort: SortDirection.Asc,
      width: "15%",
      formatter: Formatter.Symbol,
      visible: true,
    },
    {
      label: "Price",
      key: "price",
      align: CellAlign.Left,
      sort: SortDirection.Desc,
      width: "auto",
      formatter: Formatter.Currency,
      visible: true,
    },
    {
      label: "Wallet",
      key: "wallet",
      align: CellAlign.Right,
      sort: SortDirection.Asc,
      width: "20%",
      visible: true,
    },
    {
      label: "Quantity",
      key: "quantity",
      align: CellAlign.Right,
      sort: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Number,
      editable: true,
      visible: true,
      /* sensitive: true, */
    },
    {
      label: "Yield",
      key: "yield",
      align: CellAlign.Right,
      sort: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Percent,
      visible: true,
      /* sensitive: true, */
    },
    {
      label: "Value",
      key: "value",
      align: CellAlign.Right,
      sort: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Currency,
      visible: true,
      /* sensitive: true, */
    },
  ],
  //   pager: true,
  //   header: true,
  //   outline: true,
};

export function Portfolios() {
  const { id } = useParams();

  const portfolios: Record<string, Portfolio> = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);
  const wallets = useSelector(getWallets);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);

  const tableData = {
    rows: [],
    ...tableMeta,
  };
  let tabs: TabInfo[] = [];
  let tabIdx = 0;

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

    if (id) {
      const idx = tabs.findIndex((tab) => tab.id === id);
      tabIdx = idx === -1 ? 0 : idx;
    }
    const pid = tabs[tabIdx].id;

    const data = preparePortfolioTableData(pid, portfolios, assetInfo, wallets);

    if (data?.children) {
      tableData.rows = data.children;
    }
  }

  return (
    <>
      <TabRow page="portfolios" tabs={tabs} idx={tabIdx} />
      <TableContainer data={tableData} />
    </>
  );
}
