import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { orange } from "@mui/material/colors";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Asset,
  Account,
  Holding,
  Service,
  getTransactionTypeLabel,
} from "../../../../../types";
import { assert } from "../../../../../utils/helpers";
import { currency, percent, datetime } from "../../../../../utils/formatters";
import { DialogType } from "../Dialog";

interface TitleProps {
  account: Account;
  onClose: any;
}

export function AccountDialogTitle({ account, onClose }: TitleProps) {
  return (
    <Stack direction="row">
      <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>
        {account.name.toUpperCase().slice(0, 1)}
      </Avatar>
      <Stack>
        <Typography>{account.name}</Typography>
      </Stack>
      <Box sx={{ flex: 1 }} />
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}

interface ContentProps {
  account: Account;
  assets: Record<string, Asset>;
  holdings: Record<string, Holding>;
  services: Record<string, Service>;
}

export function AccountDialogContent({
  account,
  assets,
  holdings,
  services,
}: ContentProps) {
  const accountHoldings = account.holdings.map((hid) => {
    const holding = holdings[hid];
    const asset = assets[holding.asset];
    const service = services[account.service];
    return {
      pk: holding.pk,
      symbol: asset.symbol.toUpperCase(),
      quantity: holding.quantity,
      value: holding.quantity * asset.info.value,
      apy: service.assets.find((as) => as.asset_pk === asset.pk)?.apy,
    };
  });
  accountHoldings.sort((a, b) => (a.value > b.value ? -1 : 1));

  const transactions = account.transactions.map((transaction) => ({
    pk: transaction.pk,
    timestamp: transaction.timestamp,
    type: transaction.type,
    quantity: transaction.quantity,
    asset: assets[transaction.asset],
    value: assets[transaction.asset].info.value * transaction.quantity,
    source: null,
  }));
  transactions.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  return (
    <Stack>
        <Paper sx={{ marginTop: "20px" }}>
          <Table sx={{ opacity: "0.8" }}>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>APY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accountHoldings.map((holding) => (
                <TableRow key={holding.pk}>
                  <TableCell>{holding.symbol}</TableCell>
                  <TableCell>{holding.quantity}</TableCell>
                  <TableCell>{currency(holding.value)}</TableCell>
                  <TableCell>{percent(holding.apy)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Divider />
        <Paper sx={{ marginTop: "20px" }}>
          <Typography
            sx={{ paddingLeft: "15px", paddingTop: "5px", fontSize: "0.9em" }}
          >
            Transactions
          </Typography>
          <Table sx={{ opacity: "0.8" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Date</TableCell>
                <TableCell sx={{ width: "20%" }}>Type</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Source</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.pk}>
                  <TableCell>{datetime(transaction.timestamp)}</TableCell>
                  <TableCell>
                    {getTransactionTypeLabel(transaction.type)}
                  </TableCell>
                  <TableCell>
                    {transaction.asset.symbol.toUpperCase()}
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{currency(transaction.value)}</TableCell>
                  <TableCell>{transaction.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
  );
}

interface ActionProps {
  handleCloseModal: any;
}

export function AccountDialogActions({ handleCloseModal }: ActionProps) {
  const handleCancel = () => {
    handleCloseModal();
  };

  const handleOk = () => {};

  return (
    <>
      <Button autoFocus onClick={handleCancel}>
        Cancel
      </Button>
      <Button onClick={handleOk}>Ok</Button>
    </>
  );
}
