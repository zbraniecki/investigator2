import { useSelector } from "react-redux";
import { TableContainer } from "../components/table/Contrainer";
import {
  CellAlign,
  SortDirection,
  Formatter,
} from "../components/table/data/Column";
import { BaseTableMeta, TableSettings } from "../components/table/data/Table";
import { StyledRowData } from "../components/table/data/Row";
import {
  preparePortfolioTableData,
  computePortfolioTableDataStyle,
} from "../../utils/portfolio";
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
import { TabInfo } from "../components/Tabs";
import { DialogType } from "../ui/modal/dialog";

const baseTableMeta: BaseTableMeta = {
  name: "portfolios",
  nested: true,
  showHeaders: true,
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
      modal: (cells: Record<string, any>, updateDialogState: any) => {
        updateDialogState({
          type: DialogType.Holding,
          meta: {
            holding: cells.id.value,
          },
        });
      },
    },
    price: {
      label: "Price",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      width: "auto",
      formatter: Formatter.Currency,
    },
    account: {
      label: "Account",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      width: "20%",
      modal: (cells: Record<string, any>, updateDialogState: any) => {
        updateDialogState({
          type: DialogType.Account,
          meta: {
            account: cells.account_id.value,
          },
        });
      },
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
    mcap: {
      label: "Market Cap",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Currency,
    },
    mcap_share: {
      label: "Mcap Share",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Fraction,
      sensitive: true,
    },
    minted_perc: {
      label: "Minted %",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Percent,
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
      key: "account",
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
    {
      key: "mcap_share",
      visible: false,
    },
    {
      key: "minted_perc",
      visible: false,
    },
  ],
};

export function Portfolios() {
  const portfolios: Record<string, Portfolio> = useSelector(getPortfolios);
  const assets = useSelector(getAssets);
  const services = useSelector(getServices);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);
  const accounts = useSelector(getAccounts);
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
    const data = preparePortfolioTableData(
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
    return computePortfolioTableDataStyle(data);
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
