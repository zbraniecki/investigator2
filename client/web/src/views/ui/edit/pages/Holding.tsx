import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { orange } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { QuestionAnswerTwoTone } from "@mui/icons-material";
import { AssetInfo } from "../../../../store/oracle";
import { ResolvedDialogState } from "../Dialog";
import {
  createHoldingThunk,
  createTransactionThunk,
  updateHoldingThunk,
  Account,
  Session,
  User,
  Transaction,
} from "../../../../store/user";
import { currency } from "../../../../utils/formatters";
import { assert } from "../../../../utils/helpers";
import { AssetHeader } from "./Asset";

interface HeaderProps {
  state: ResolvedDialogState;
  assetInfo: Record<string, AssetInfo>;
  accounts: Record<string, Account>;
  updateDialogState: any;
}

export function HoldingHeader({
  state,
  assetInfo,
  accounts,
  updateDialogState,
}: HeaderProps) {
  let assetDOM;
  let accountDOM;
  if (!state.editable.asset) {
    assetDOM = (
      <>
        <Typography>{state.asset?.symbol.toUpperCase()}</Typography>
        <Typography>{state.asset?.name}</Typography>
      </>
    );
  } else {
    const assetList = Object.values(assetInfo);

    const handleAssetSelect = (event: any, newValue: AssetInfo | null) => {
      if (newValue) {
        updateDialogState({
          value: {
            asset: newValue.pk,
          },
        });
      } else {
        updateDialogState({
          value: {
            asset: null,
          },
        });
      }
    };

    assetDOM = (
      <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={assetList}
          sx={{ width: 300 }}
          onChange={handleAssetSelect}
          isOptionEqualToValue={(option, value) => option.pk === value.pk}
          getOptionLabel={(option) =>
            `${option.name} (${option.symbol.toUpperCase()})`
          }
          renderInput={(params) => <TextField {...params} />}
        />
    );
  }

  if (!state.editable.account) {
    accountDOM = (
      <Typography>{state.account?.name}</Typography>
    );
  } else {
    const accountList = Object.values(accounts);

    const handleAccountSelect = (event: any, newValue: Account | null) => {
      if (newValue) {
        updateDialogState({
          value: {
            account: newValue.pk,
          },
        });
      } else {
        updateDialogState({
          value: {
            account: null,
          },
        });
      }
    };

    accountDOM = (
      <Autocomplete
          disablePortal
          id="account-select"
          options={accountList}
          sx={{ width: 300 }}
          onChange={handleAccountSelect}
          isOptionEqualToValue={(option, value) => option.pk === value.pk}
          getOptionLabel={(option) => `${option.name}`}
          renderInput={(params) => <TextField {...params} />}
        />
    );
  }

  let assetClassRank;
  if (state.assetClass?.slug === "crypto") {
    assetClassRank = <Avatar>#1</Avatar>;
  }

  return (
    <>
      <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>
        {state.asset?.symbol[0].toUpperCase()}
      </Avatar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {assetDOM}
        {accountDOM}
      </Box>
      <Box sx={{ flex: 1 }} />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {state.assetClass && (
          <Chip
            avatar={assetClassRank}
            label={state.assetClass?.name}
            variant="outlined"
            size="small"
          />
        )}
      </Box>
    </>
  );
}

interface ContentProps {
  state: ResolvedDialogState;
  updateDialogState: any;
  accounts: Record<string, Account>;
}

export function HoldingContent({
  state,
  accounts,
  updateDialogState,
}: ContentProps) {
  const handleQuantityChange = (event: any) => {
    updateDialogState({
      value: {
        quantity: event.target.value,
      },
    });
  };

  let price;
  if (state.value.quantity && state.asset?.info.value) {
    const q = parseInt(state.value.quantity, 10);
    price = q * state.asset.info.value;
  }
  let quantity: string = " ";
  if (state.value.quantity) {
    quantity = state.value.quantity;
  }

  let transactions: Transaction[] = [];
  if (state.account && state.asset) {
    transactions = state.account.transactions.filter((transaction) => {
      assert(state.asset);
      return transaction.asset === state.asset.pk;
    });
    transactions.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  }

  return (
    <>
      <Table sx={{ "& tr:last-of-type td": { border: 0 } }}>
        <TableBody>
          <TableRow>
            <TableCell sx={{ width: "40%", fontSize: "0.8em" }}>
              Quantity
            </TableCell>
            <TableCell
              sx={{ width: "60%", fontSize: "0.8em" }}
              align="right"
              colSpan={3}
            >
              {state.editable.quantity ? (
                <TextField
                  id="standard-basic"
                  variant="standard"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  sx={{ textAlign: "right" }}
                />
              ) : (
                <>{state.quantity}</>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: "40%", fontSize: "0.8em" }}>
              Value
            </TableCell>
            <TableCell
              sx={{ width: "60%", fontSize: "0.8em" }}
              align="right"
              colSpan={3}
            >
              {price}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {state.holding && (
        <Paper>
          <Typography
            sx={{ paddingLeft: "15px", paddingTop: "5px", fontSize: "0.9em" }}
          >
            Transactions
          </Typography>
          <Table
            size="small"
            sx={{ opacity: "0.8", "& *": { color: "#999999" } }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Target</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => {
                const account = accounts[transaction.account];
                assert(account);
                return (
                  <TableRow key={transaction.pk}>
                    <TableCell>{transaction.timestamp}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{account.name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </>
  );
}

interface ActionsProps {
  state: ResolvedDialogState;
  session: Session;
  users: Record<string, User>;
  updateDialogState: any;
}

export function HoldingActions({
  state,
  session,
  users,
  updateDialogState,
}: ActionsProps) {
  const dispatch = useDispatch();

  const handleClose = (event: any) => {
    updateDialogState({
      open: false,
    });
  };

  const handleEdit = (event: any) => {
    assert(session.token);
    assert(state.value.quantity);
    assert(state.holding);
    const q = parseFloat(state.value.quantity);
    const change = q - parseFloat(state.holding.quantity.toString());
    const p = dispatch(
      updateHoldingThunk({
        token: session.token,
        pk: state.holding.pk,
        quantity: q,
      })
    ) as unknown as Promise<any>;
    p.then(() => {
      assert(session.token);
      assert(state.value.quantity);
      assert(state.account);
      assert(state.asset);
      dispatch(
        createTransactionThunk({
          token: session.token,
          accountPk: state.account.pk,
          assetPk: state.asset.pk,
          type: change > 0 ? "BY" : "SL",
          quantity: Math.abs(change),
          timestamp: new Date(),
        })
      );
    });
  };

  const handleAdd = (event: any) => {
    assert(session.user_pk);
    const currentUser = users[session.user_pk];

    assert(state.asset);
    assert(state.account);
    assert(session.token);
    assert(state.value.quantity);

    const q = parseFloat(state.value.quantity);
    const p = dispatch(
      createHoldingThunk({
        token: session.token,
        assetPk: state.asset.pk,
        accountPk: state.account.pk,
        ownerPk: currentUser.pk,
        quantity: q,
      }) as unknown as Promise<any>
    );
    p.then((resp: any) => {
      if (resp.payload.pk) {
        updateDialogState({
          value: {
            holding: resp.payload.pk,
          },
          editable: {
            asset: false,
            account: false,
          },
        });
      } else {
        throw new Error("Eror case - could not add a holding!");
      }
      assert(state.asset);
      assert(state.account);
      assert(session.token);
      assert(state.value.quantity);
      dispatch(
        createTransactionThunk({
          token: session.token,
          accountPk: state.account.pk,
          assetPk: state.asset.pk,
          type: "BY",
          quantity: parseFloat(state.value.quantity),
          timestamp: new Date(),
        })
      );
    });
  };

  const editMode = Boolean(state.holding);
  return (
    <>
      <Button onClick={handleClose}>Cancel</Button>
      {editMode ? (
        <Button onClick={handleEdit}>Edit</Button>
      ) : (
        <Button onClick={handleAdd}>Add</Button>
      )}
    </>
  );
}
