import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Component as Table, Props as TableProps } from "../components/Table";
import { prepareWatchlistTableData } from "../../utils/watchlist";
import { getAssetInfo, getWatchlists } from "../../store/oracle";
// import { currency, percent } from "../../utils/formatters";

const tableMeta: TableProps["meta"] = {
  id: "watchlist",
  headers: [
    {
      label: "#",
      id: "market_cap_rank",
      align: "left",
      width: 0.1,
    },
    {
      label: "Symbol",
      id: "symbol",
      align: "left",
      width: 0.1,
      formatter: "symbol",
    },
    {
      label: "Name",
      id: "name",
      align: "left",
      width: 0.2,
    },
    {
      label: "Price",
      id: "price",
      align: "left",
      width: "auto",
      formatter: "currency",
    },
    {
      label: "1h",
      id: "price_change_percentage_1h",
      align: "left",
      width: 0.1,
      formatter: "percent",
    },
    {
      label: "24h",
      id: "price_change_percentage_24h",
      align: "left",
      width: 0.1,
      formatter: "percent",
    },
    {
      label: "7d",
      id: "price_change_percentage_7d",
      align: "left",
      width: 0.1,
      formatter: "percent",
    },
    {
      label: "30d",
      id: "price_change_percentage_30d",
      align: "left",
      width: 0.1,
      formatter: "percent",
    },
  ],
};

export function Watchlists() {
  const assetInfo = useSelector(getAssetInfo);
  const watchlists = useSelector(getWatchlists);

  let wid = "uuid";
  if (watchlists.length > 0) {
    wid = watchlists[0].id;
  }
  const tableData = prepareWatchlistTableData(wid, watchlists, assetInfo);

  const value = "$--.-- | 24h: -.-% | yield: -.-%";
  // const pMeta = portfolioMeta[pid];
  // if (pMeta !== undefined) {
  //   value = `${currency(pMeta.value)} | 24h: ${percent(
  //     pMeta.price_change_percentage_24h
  //   )} | yield: ${percent(pMeta.yield)}`;
  // }

  return (
    <>
      <Typography align="right">Value: {value}</Typography>
      <Table meta={tableMeta} data={tableData} />
    </>
  );
}
