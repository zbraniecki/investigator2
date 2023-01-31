import { useSelector } from "react-redux";
import { TableContainer } from "../components/table/Contrainer";
import {
  prepareAccountsTableData,
  computeAccountsTableDataStyle,
  isSufficientDataLoaded,
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
  name: "accounts",
  nested: true,
  showHeaders: true,
  columns: {
    account: {
      label: "Account",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      priority: 0,
    },
    name: {
      label: "Name",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      formatter: Formatter.Symbol,
      priority: 1,
    },
    quantity: {
      label: "Quantity",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Number,
      editable: true,
      sensitive: true,
      priority: 2,
    },
    value: {
      label: "Value",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Currency,
      sensitive: true,
      priority: 0,
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
      minWidth: 157,
      width: "auto",
    },
    {
      key: "name",
      visible: true,
      minWidth: 95,
      width: 100,
    },
    {
      key: "quantity",
      visible: true,
      minWidth: 85,
      width: 100,
    },
    {
      key: "value",
      visible: true,
      minWidth: 115,
      width: 115,
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

  const ready = isSufficientDataLoaded({
    accounts,
    assets,
    holdings,
    portfolios,
  });

  if (ready && session.user_pk) {
    const plists: string[] = users[session.user_pk].visible_lists.portfolios;

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
  const getTableData = (id: string): StyledRowData | null => {
    const data = prepareAccountsTableData(id, {
      accounts,
      assets,
      holdings,
      portfolios,
      services,
    });
    if (data === null) {
      return null;
    }
    return computeAccountsTableDataStyle(data);
  };

  return (
    <TableContainer
      tabs={tabs}
      baseMeta={baseTableMeta}
      settings={tableSettings}
      getTableData={getTableData}
      handleAddTab={null}
      handleModifyTab={null}
    />
  );
}
