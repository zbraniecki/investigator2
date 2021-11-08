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
      width: 0.15,
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
      width: 0.45,
    },
    {
      label: "Quantity",
      id: "quantity",
      align: "right",
      width: 0.1,
    },
    {
      label: "Value",
      id: "value",
      align: "right",
      width: 0.1,
    },
  ],
};

export function Portfolios() {
  const portfolios = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);

  const tableData = preparePortfolioTableData(portfolios, 0, assetInfo);

  return <Table meta={tableMeta} data={tableData} />;
}
