import { useSelector } from "react-redux";
import { TableContainer } from "../components/table/Contrainer";
import {
  prepareAccountsTableData,
  computeAccountsTableDataStyle,
} from "../../utils/service";
import { Portfolio } from "../../types";
import {
  getPortfolios,
  getUsers,
  getSession,
  getAccounts,
  getHoldings,
  getAssets,
  getServices,
} from "../../store";
import {
  CellAlign,
  SortDirection,
  Formatter,
} from "../components/table/data/Column";
import { BaseTableMeta, TableSettings } from "../components/table/data/Table";
import { StyledRowData } from "../components/table/data/Row";
import { TabInfo } from "../components/Tabs";

const baseTableMeta: BaseTableMeta = {
  name: "wallet",
  nested: true,
  showHeaders: true,
  columns: {
    account: {
      label: "Account",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      // width: "20%",
    },
    name: {
      label: "Name",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      // width: "auto",
      formatter: Formatter.Symbol,
    },
    quantity: {
      label: "Quantity",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      // width: "10%",
      formatter: Formatter.Number,
      editable: true,
      sensitive: true,
    },
    value: {
      label: "Value",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      // width: "10%",
      formatter: Formatter.Currency,
      sensitive: true,
    },
  },
  // pager: true,
  // header: true,
  // outline: true,
};

const tableSettings: TableSettings = {
  sortColumns: ["value"],
  columns: [
    {
      key: "account",
      visible: true,
    },
    {
      key: "name",
      visible: true,
    },
    {
      key: "quantity",
      visible: true,
    },
    {
      key: "value",
      visible: true,
    },
  ],
};

export function Accounts() {
  const portfolios: Record<string, Portfolio> = useSelector(getPortfolios);
  const assets = useSelector(getAssets);
  const accounts = useSelector(getAccounts);
  const services = useSelector(getServices);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);
  const holdings = useSelector(getHoldings);

  let tabs: TabInfo[] = [];

  if (Object.keys(portfolios).length > 0) {
    const currentUser = session.user_pk ? users[session.user_pk] : undefined;
    const plists: string[] = currentUser?.visible_lists.portfolios || [];

    tabs = plists
      .filter((pid) => pid in portfolios)
      .map((pid) => {
        const portfolio = portfolios[pid];
        return {
          id: portfolio.pk,
          label: portfolio.name,
        };
      });
  }
  const getTableData = (id: string): StyledRowData | undefined => {
    const data = prepareAccountsTableData(
      id,
      portfolios,
      assets,
      services,
      accounts,
      holdings
    );
    if (data === undefined) {
      return undefined;
    }
    return computeAccountsTableDataStyle(data);
  };

  return (
    <TableContainer
      tabs={tabs}
      baseMeta={baseTableMeta}
      settings={tableSettings}
      getTableData={getTableData}
    />
  );
}
