import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import { useSelector, useDispatch } from "react-redux";
import { TableMeta } from "./data/Table";
import { StyledRowData } from "./data/Row";
import {
  getSession,
  getHoldings,
  updateHoldingThunk,
  createTransactionThunk,
  getPortfolioInlineQuantityTransactionType,
} from "../../../store";
import { TransactionType } from "../../../types";
import { Table } from "./Table";
import { Cell, EditableCell } from "./Cell";
import { getOutletContext } from "../../ui/Content";
import { DialogTab } from "../../ui/modal/edit/Dialog";

export interface Props {
  id: string;
  data: StyledRowData;
  tableMeta: TableMeta;
}
export function Row({ id, data, tableMeta }: Props) {
  const [open, setOpen] = React.useState(false);
  const session = useSelector(getSession);
  const holdings = useSelector(getHoldings);
  const portfolioInlineQuantityTransactionType = useSelector(getPortfolioInlineQuantityTransactionType);
  const outletContext = getOutletContext();

  const dispatch = useDispatch();

  const handleCellUpdate = async (cid: string, quantity: number) => {
    console.log("handling cell update");
    const { value } = data.cells.id;
    const holding = holdings[value];
    const diffQuantity = quantity - holding.quantity;

    let type = portfolioInlineQuantityTransactionType;
    if (type === TransactionType.Buy && diffQuantity < 0) {
      type = TransactionType.Sell;
    }
    return Promise.all([
      dispatch(
        createTransactionThunk({
          token: session.token,
          input: {
            account: holding.account,
            asset: holding.asset,
            type,
            quantity: diffQuantity,
            timestamp: new Date(),
          },
        })
      ),
      dispatch(
        updateHoldingThunk({
          token: session.token,
          pk: value as string,
          quantity,
        })
      ),
    ]);
  };

  const handleAssetOpen = () => {
    const { value } = data.cells.id;
    outletContext.updateDialogState({
      open: true,
      selectedTab: DialogTab.Asset,
      value: {
        holding: value,
      },
    });
  };

  const handleHoldingOpen = () => {
    const { value } = data.cells.id;
    outletContext.updateDialogState({
      open: true,
      selectedTab: DialogTab.Holding,
      value: {
        holding: value,
      },
      editable: {
        quantity: true,
      },
    });
  };

  return (
    <>
      <TableRow key={id}>
        {tableMeta.nested && (
          <TableCell sx={{ width: "66px" }}>
            {data.children && (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        )}
        {tableMeta.columns
          .filter((columns) => columns.visible)
          .map((column) => {
            const key = `${id}-${column.key}`;
            const cell = data.cells[column.key];
            const hideValue = column.sensitive && tableMeta.hideSensitive;
            if (column.editable && !hideValue && cell && data.cells.id) {
              return (
                <EditableCell
                  key={key}
                  column={column.key}
                  id={key}
                  data={cell}
                  align={column.align}
                  width={column.width}
                  formatter={column.formatter}
                  onCellUpdate={handleCellUpdate}
                />
              );
            }
            return (
              <Cell
                key={key}
                column={column.key}
                rowId={data.cells.id?.value as string}
                id={key}
                data={cell}
                align={column.align}
                width={column.width}
                formatter={column.formatter}
                showValue={!hideValue}
                onClick={
                  column.key === "name"
                    ? handleAssetOpen
                    : column.key === "account"
                      ? handleHoldingOpen
                      : undefined
                }
              />
            );
          })}
      </TableRow>
      {data.children && (
        <TableRow>
          <TableCell
            style={{ padding: 0 }}
            colSpan={tableMeta.columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table
                rows={data.children}
                meta={{
                  name: `${id}-sub`,
                  columns: tableMeta.columns,
                  sortColumns: tableMeta.sortColumns,
                  nested: tableMeta.nested,
                  showHeaders: false,
                  filter: null,
                  hideSensitive: tableMeta.hideSensitive,
                }}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
