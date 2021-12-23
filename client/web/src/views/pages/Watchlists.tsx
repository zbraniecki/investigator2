import { useSelector } from "react-redux";
import { TableContainer } from "../components/table/Contrainer";
import {
  CellAlign,
  SortDirection,
  Formatter,
} from "../components/table/data/Column";
import { BaseTableMeta, TableSettings } from "../components/table/data/Table";
import { RowData } from "../components/table/data/Row";
import { prepareWatchlistTableData } from "../../utils/watchlist";
import {
  getAssetInfo,
  getWatchlists as getPublicWatchlists,
  Watchlist,
} from "../../store/oracle";
import {
  getPortfolios,
  getWatchlists as getUserWatchlists,
  getUsers,
  getSession,
} from "../../store/account";
import { TabInfo } from "../components/Tabs";

const baseTableMeta: BaseTableMeta = {
  name: "watchlists",
  nested: false,
  columns: {
    id: {
      label: "ID",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      width: "5%",
    },
    market_cap_rank: {
      label: "#",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      width: "5%",
    },
    market_cap: {
      label: "Market Cap",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      width: "5%",
    },
    name: {
      label: "Name",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      formatter: Formatter.Symbol,
      width: "10%",
    },
    symbol: {
      label: "Symbol",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      formatter: Formatter.Symbol,
      width: "10%",
    },
    price: {
      label: "Price",
      align: CellAlign.Right,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Currency,
      width: "auto",
    },
    price_change_percentage_1h: {
      label: "1h",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      width: "5%",
      formatter: Formatter.Percent,
    },
    price_change_percentage_24h: {
      label: "24h",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      width: "5%",
      formatter: Formatter.Percent,
    },
    price_change_percentage_7d: {
      label: "7d",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      width: "5%",
      formatter: Formatter.Percent,
    },
    price_change_percentage_30d: {
      label: "30d",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      width: "5%",
      formatter: Formatter.Percent,
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
    },
    {
      key: "name",
      visible: true,
    },
    {
      key: "price",
      visible: true,
    },
    {
      key: "price_change_percentage_1h",
      visible: true,
    },
    {
      key: "price_change_percentage_24h",
      visible: true,
    },
    {
      key: "price_change_percentage_7d",
      visible: true,
    },
    {
      key: "price_change_percentage_30d",
      visible: true,
    },
  ],
};

export function Watchlists() {
  const publicWatchlists: Record<string, Watchlist> =
    useSelector(getPublicWatchlists);
  const userWatchlists: Record<string, Watchlist> | undefined =
    useSelector(getUserWatchlists);
  const assetInfo = useSelector(getAssetInfo);
  const portfolios = useSelector(getPortfolios);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);

  const watchlists: Record<string, Watchlist> = {};
  for (const list of Object.values(publicWatchlists)) {
    watchlists[list.id] = list;
  }
  if (userWatchlists !== undefined) {
    for (const list of Object.values(userWatchlists)) {
      watchlists[list.id] = list;
    }
  }

  let tabs: TabInfo[] = [];

  const ready = session.token
    ? userWatchlists !== undefined && Object.keys(users).length > 0
    : Object.keys(watchlists).length > 0;

  if (ready) {
    const wids: string[] = session.username
      ? users[session.username].ui.watchlists
      : Object.keys(watchlists);

    tabs = wids
      .filter((wid) => wid in watchlists)
      .map((wid) => {
        const watchlist = watchlists[wid];
        return {
          id: watchlist.id,
          label: watchlist.name,
        };
      });
  }

  const getTableData = (id: string): RowData | undefined =>
    prepareWatchlistTableData(id, watchlists, assetInfo, portfolios);
  return (
    <TableContainer
      tabs={tabs}
      baseMeta={baseTableMeta}
      settings={tableSettings}
      getTableData={getTableData}
    />
  );
}
