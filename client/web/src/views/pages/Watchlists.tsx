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
  prepareWatchlistTableData,
  computeWatchlistTableDataStyle,
} from "../../utils/watchlist";
import { Watchlist } from "../../types";
import {
  getPortfolios,
  getWatchlists as getUserWatchlists,
  getUsers,
  getSession,
  getHoldings,
  getAssets,
  getPublicWatchlists,
  getAccounts,
} from "../../store";
import { TabInfo } from "../components/Tabs";
import { DialogType } from "../ui/modal/dialog";

const baseTableMeta: BaseTableMeta = {
  name: "watchlists",
  nested: false,
  showHeaders: true,
  columns: {
    id: {
      label: "ID",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
    },
    market_cap_rank: {
      label: "#",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      priority: 4,
    },
    market_cap: {
      label: "Market Cap",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
    },
    name: {
      label: "Name",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      formatter: Formatter.Symbol,
      priority: 0,
      modal: (cells: Record<string, any>, updateDialogState: any) => {
        updateDialogState({
          type: DialogType.Asset,
          meta: {
            asset: cells.id.value,
          },
        });
      },
    },
    symbol: {
      label: "Symbol",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      formatter: Formatter.Symbol,
    },
    price: {
      label: "Price",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Currency,
      priority: 0,
    },
    price_change_percentage_1h: {
      label: "1h",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Percent,
      priority: 3,
    },
    price_change_percentage_24h: {
      label: "24h",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Percent,
      priority: 1,
    },
    price_change_percentage_7d: {
      label: "7d",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Percent,
      priority: 2,
    },
    price_change_percentage_30d: {
      label: "30d",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Percent,
      priority: 3,
    },
  },
  // pager: true,
  // header: true,
  // outline: true,
};

const tableSettings: TableSettings = {
  sortColumns: ["market_cap_rank", "market_cap"],
  columns: [
    {
      key: "market_cap_rank",
      visible: true,
      minWidth: 75,
      width: 75,
    },
    {
      key: "name",
      visible: true,
      minWidth: 100,
      width: "auto",
    },
    {
      key: "price",
      visible: true,
      minWidth: 75,
      width: 75,
    },
    {
      key: "price_change_percentage_1h",
      visible: true,
      minWidth: 50,
      width: 100,
    },
    {
      key: "price_change_percentage_24h",
      visible: true,
      minWidth: 50,
      width: 100,
    },
    {
      key: "price_change_percentage_7d",
      visible: true,
      minWidth: 50,
      width: 100,
    },
    {
      key: "price_change_percentage_30d",
      visible: true,
      minWidth: 50,
      width: 100,
    },
  ],
};

export function Watchlists() {
  const publicWatchlists: Record<string, Watchlist> =
    useSelector(getPublicWatchlists);
  const userWatchlists: Record<string, Watchlist> | undefined =
    useSelector(getUserWatchlists);
  const assets = useSelector(getAssets);
  const portfolios = useSelector(getPortfolios);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);
  const holdings = useSelector(getHoldings);
  const accounts = useSelector(getAccounts);

  const watchlists: Record<string, Watchlist> = {};
  for (const list of Object.values(publicWatchlists)) {
    watchlists[list.pk] = list;
  }
  if (userWatchlists !== undefined) {
    for (const list of Object.values(userWatchlists)) {
      watchlists[list.pk] = list;
    }
  }

  let tabs: TabInfo[] = [];

  const ready = session.token
    ? userWatchlists !== undefined && Object.keys(users).length > 0
    : Object.keys(watchlists).length > 0;

  if (ready) {
    const wids: string[] = session.user_pk
      ? users[session.user_pk].visible_lists.watchlists
      : Object.keys(watchlists);

    tabs = wids
      .filter((wid) => wid in watchlists)
      .map((wid) => {
        const watchlist = watchlists[wid];
        return {
          id: watchlist.pk,
          label: watchlist.name,
        };
      });
  }

  const getTableData = (id: string): StyledRowData | undefined => {
    const data = prepareWatchlistTableData(
      id,
      watchlists,
      assets,
      portfolios,
      holdings,
      accounts
    );
    if (data === undefined) {
      return undefined;
    }
    return computeWatchlistTableDataStyle(data);
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
