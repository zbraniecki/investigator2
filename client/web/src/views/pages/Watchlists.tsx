import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import Typography from "@mui/material/Typography";
// import { Component as Table, Props as TableProps } from "../components/Table";
import { TableContainer } from "../components/table/Contrainer";
import { TableData, Formatter, CellAlign } from "../components/table/Data";
import {
  prepareWatchlistTableData,
} from "../../utils/watchlist";
import {
  getAssetInfo,
  getWatchlists as getPublicWatchlists,
  Watchlist,
} from "../../store/oracle";
import {
  getPortfolios,
  getWatchlists as getUserWatchlists,
  //   getUsers,
  //   getSession,
} from "../../store/account";
// import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
// import { percent } from "../../utils/formatters";
import { TabRow, TabInfo } from "../components/Tabs";

const tableMeta: TableData = {
  name: "watchlist",
  // sort: {
  //   column: "market_cap",
  //   direction: "desc",
  // },
  // nested: false,
  headers: [
    {
      label: "#",
      key: "market_cap_rank",
      align: CellAlign.Right,
      width: "80px",
    },
    {
      label: "Name",
      key: "name",
      align: CellAlign.Left,
      width: "15%",
      formatter: Formatter.Symbol,
    },
    {
      label: "Price",
      key: "price",
      align: CellAlign.Left,
      width: "auto",
      formatter: Formatter.Currency,
      editable: true,
    },
    {
      label: "1h",
      key: "price_change_percentage_1h",
      align: CellAlign.Left,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
    },
    {
      label: "24h",
      key: "price_change_percentage_24h",
      align: CellAlign.Left,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
    },
    {
      label: "7d",
      key: "price_change_percentage_7d",
      align: CellAlign.Left,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
    },
    {
      label: "30d",
      key: "price_change_percentage_30d",
      align: CellAlign.Left,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
    },
  ],
  // pager: true,
  // header: true,
  // outline: true,
};

export function Watchlists() {
  const { id } = useParams();

  const publicWatchlists: Record<string, Watchlist> =
    useSelector(getPublicWatchlists);
  const userWatchlists: Record<string, Watchlist> =
    useSelector(getUserWatchlists);
  const assetInfo = useSelector(getAssetInfo);
  const portfolios = useSelector(getPortfolios);
  //   const users = useSelector(getUsers);
  //   const session = useSelector(getSession);
  //   const infoDisplayMode = useSelector(getInfoDisplayMode);

  //   const [wIdx, setwIdx] = React.useState(0);
  //   const [searchQuery, setSearchQuery] = React.useState("");
  //   const handleChange = (event: any, newValue: any) => {
  //     setwIdx(newValue);
  //   };

  const watchlists: Record<string, Watchlist> = {};
  for (const list of Object.values(publicWatchlists)) {
    watchlists[list.id] = list;
  }
  for (const list of Object.values(userWatchlists)) {
    watchlists[list.id] = list;
  }

  const tableData = {
    rows: [],
    ...tableMeta,
  };
  let tabs: TabInfo[] = [];
  let tabIdx = 0;

  if (Object.keys(watchlists).length > 0) {
    tabs = Object.values(watchlists).map((watchlist) => ({
      id: watchlist.id,
      label: watchlist.name,
    }));

    if (id) {
      const idx = tabs.findIndex((tab) => tab.id === id);
      tabIdx = idx === -1 ? 0 : idx;
    }
    const wid = tabs[tabIdx].id;

    const data = prepareWatchlistTableData(
      wid,
      watchlists,
      assetInfo,
      portfolios
    );

    if (data?.children) {
      tableData.rows = data.children;
    }
  }
  return (
    <>
      <TabRow tabs={tabs} idx={tabIdx} />
      <TableContainer data={tableData} />
    </>
  );
}
