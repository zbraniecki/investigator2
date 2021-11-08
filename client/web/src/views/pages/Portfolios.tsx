import { useSelector } from "react-redux";
import { Component as Table, Props as TableProps } from "../components/Table";
import { preparePortfolioTableData } from "../../utils/portfolio";
import { getPortfolios } from "../../store/account";
import { getAssetInfo } from "../../store/oracle";

const tableMeta: TableProps["meta"] = {
  id: "portfolio",
  headers: [
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
      width: 0.15,
    },
    {
      label: "Price",
      id: "price",
      align: "left",
      width: "auto",
      formatter: "currency",
    },
    {
      label: "Wallet",
      id: "wallet",
      align: "right",
      width: 0.2,
    },
    {
      label: "Quantity",
      id: "quantity",
      align: "right",
      width: 0.1,
      formatter: "number",
    },
    {
      label: "Value",
      id: "value",
      align: "right",
      width: 0.1,
      formatter: "currency",
    },
  ],
};

export function Portfolios() {
  const portfolios = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);

  let pid = "uuid";
  if (portfolios.length > 0) {
    pid = portfolios[0].id;
  }
  const tableData = preparePortfolioTableData(pid, portfolios, assetInfo);

  return <Table meta={tableMeta} data={tableData} />;
}
