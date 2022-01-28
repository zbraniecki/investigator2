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
  getTargets,
  updateHoldingThunk,
  updateTargetThunk,
  createTransactionThunk,
  createTargetChangeThunk,
  getPortfolioInlineQuantityTransactionType,
} from "../../../store";
import { Holding, TransactionType, Strategy, Target } from "../../../types";
import { Table } from "./Table";
import { Cell, EditableCell } from "./Cell";
import { getOutletContext } from "../../ui/Content";
import { DialogTab } from "../../ui/modal/edit/Dialog";
import { assert } from "../../../utils/helpers";

const handleQuantityUpdate = (
  dispatch: any,
  token: string,
  holding: Holding,
  quantity: number,
  inlineQuantityTransactionType: TransactionType
): Promise<any> => {
  const diffQuantity = quantity - holding.quantity;

  let type = inlineQuantityTransactionType;
  if (type === TransactionType.Buy && diffQuantity < 0) {
    type = TransactionType.Sell;
  }
  assert(holding.account);
  return Promise.all([
    dispatch(
      createTransactionThunk({
        token,
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
        token,
        pk: holding.pk,
        quantity,
      })
    ),
  ]);
};

const handleTargetUpdate = (
  dispatch: any,
  token: string,
  target: Target,
  percent: number
): Promise<any> => {
  const diffPercent = percent - target.percent;

  return Promise.all([
    dispatch(
      createTargetChangeThunk({
        token,
        input: {
          strategy: target.strategy,
          asset: target.asset,
          change: diffPercent,
          timestamp: new Date(),
        },
      })
    ),
    dispatch(
      updateTargetThunk({
        token,
        pk: target.pk,
        percent,
      })
    ),
  ]);
};

export interface Props {
  id: string;
  data: StyledRowData;
  tableMeta: TableMeta;
}
export function Row({ id, data, tableMeta }: Props) {
  const [open, setOpen] = React.useState(false);
  const session = useSelector(getSession);
  const holdings = useSelector(getHoldings);
  const targets = useSelector(getTargets);
  const portfolioInlineQuantityTransactionType = useSelector(
    getPortfolioInlineQuantityTransactionType
  );
  const outletContext = getOutletContext();

  const dispatch = useDispatch();

  const handleCellUpdate = async (cid: string, value: number) => {
    console.log(`handling cell update: ${cid}`);
    switch (cid) {
      case "quantity": {
        const hid = data.cells.id.value;
        const holding = holdings[hid];
        return handleQuantityUpdate(
          dispatch,
          session.token,
          holding,
          value,
          portfolioInlineQuantityTransactionType
        );
      }
      case "target": {
        const tid = data.cells.id.value;
        const target = targets[tid];
        return handleTargetUpdate(dispatch, session.token, target, value);
      }
      default: {
        return Promise.resolve();
      }
    }
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
