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
  isSufficientDataLoaded,
  DataLoadedState,
} from "../../utils/watchlist";
import { assert, loadData, verifyDataState } from "../../utils";
import { getSession } from "../../store";
import { TabInfo } from "../components/Tabs";
import { DialogType } from "../ui/modal/dialog";

const baseTableMeta: BaseTableMeta = {
  name: "watchlists",
  nested: true,
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
      minWidth: 95,
      width: "auto",
    },
    {
      key: "price",
      visible: true,
      minWidth: 115,
      width: 125,
    },
    {
      key: "price_change_percentage_1h",
      visible: true,
      minWidth: 85,
      width: 100,
    },
    {
      key: "price_change_percentage_24h",
      visible: true,
      minWidth: 85,
      width: 100,
    },
    {
      key: "price_change_percentage_7d",
      visible: true,
      minWidth: 85,
      width: 100,
    },
    {
      key: "price_change_percentage_30d",
      visible: true,
      minWidth: 85,
      width: 100,
    },
  ],
};

export function Watchlists() {
  const state = loadData([
    "accounts",
    "assets",
    "holdings",
    "portfolios",
    "publicWatchlists",
    "userWatchlists",
    "users",
  ]);

  const session = useSelector(getSession);

  state.watchlists = {
    
    ...state.publicWatchlists,
    ...state.userWatchlists
  };

  let tabs: TabInfo[] = [];

  const dataLoadedState = isSufficientDataLoaded(state);

  // We don't want to flicker. If user is logged in, don't show public
  // until user watchlists are loaded.
  const ready = session.token
    ? dataLoadedState === DataLoadedState.User
    : dataLoadedState !== DataLoadedState.None;

  if (ready) {
    assert(state.users);
    const wids: string[] = session.user_pk
      ? state.users[session.user_pk].visible_lists.watchlists
      : Object.keys(state.watchlists);

    tabs = wids
      .filter((wid) => state.watchlists && wid in state.watchlists)
      .map((wid) => {
        assert(state.watchlists);
        const watchlist = state.watchlists[wid];
        return {
          id: watchlist.pk,
          label: watchlist.name,
        };
      });
  }

  const getTableData = (id: string): StyledRowData | null => {
    const data = prepareWatchlistTableData(
      id,
      verifyDataState(state, [
        "accounts",
        "assets",
        "holdings",
        "portfolios",
        "watchlists",
      ])
    );
    if (data === null) {
      return null;
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
