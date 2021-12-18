import { useSelector } from "react-redux";
import { TableContainer } from "../components/table/Contrainer";
import {
  RowData,
  TableMeta,
  Formatter,
  CellAlign,
  SortDirection,
} from "../components/table/Data";
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
// import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
import { TabInfo } from "../components/Tabs";

const tableMeta: TableMeta = {
  name: "watchlists",
  sortColumns: ["market_cap_rank", "market_cap"],
  headers: [
    {
      label: "#",
      key: "market_cap_rank",
      align: CellAlign.Right,
      sort: SortDirection.Asc,
      width: "80px",
      visible: true,
    },
    {
      label: "Market Cap",
      key: "market_cap",
      align: CellAlign.Right,
      sort: SortDirection.Asc,
      width: "80px",
      visible: false,
    },
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
      editable: true,
      visible: true,
    },
    {
      label: "1h",
      key: "price_change_percentage_1h",
      align: CellAlign.Left,
      sort: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
      visible: true,
    },
    {
      label: "24h",
      key: "price_change_percentage_24h",
      align: CellAlign.Left,
      sort: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
      visible: true,
    },
    {
      label: "7d",
      key: "price_change_percentage_7d",
      align: CellAlign.Left,
      sort: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
      visible: true,
    },
    {
      label: "30d",
      key: "price_change_percentage_30d",
      align: CellAlign.Left,
      sort: SortDirection.Desc,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
      visible: true,
    },
  ],
  // pager: true,
  // header: true,
  // outline: true,
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
    <TableContainer tabs={tabs} meta={tableMeta} getTableData={getTableData} />
  );
}
