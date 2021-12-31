import React from "react";
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
import { AssetInfo } from "../../../../store/oracle";
import { Account } from "../../../../store/user";

interface Props {
  asset: AssetInfo;
  account?: Account;
}

export function HoldingHeader({ asset, account }: Props) {
  return (
    <>
      <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>
        {asset.symbol[0].toUpperCase()}
      </Avatar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography>{asset.symbol.toUpperCase()}</Typography>
        <Typography>{asset.name}</Typography>
        <Typography>{account?.name}</Typography>
      </Box>
      <Box sx={{ flex: 1 }} />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Chip
          avatar={<Avatar>#1</Avatar>}
          label="crypto"
          variant="outlined"
          size="small"
        />
      </Box>
    </>
  );
}

export function HoldingContent() {
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
              0.1
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
              $3212.39
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Paper>
        <Typography
          sx={{ paddingLeft: "15px", paddingTop: "5px", fontSize: "0.9em" }}
        >
          Transactions
        </Typography>
        <Table size="small" sx={{ "& *": { color: "#666666" } }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Target</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>2021-09-12 13:45 PDT</TableCell>
              <TableCell>SELL</TableCell>
              <TableCell>0.2</TableCell>
              <TableCell>Coinbase Wallet</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <Stack
        direction="row"
        sx={{
          justifyContent: "flex-end",
          marginTop: "10px",
          color: "#666666",
          marginRight: "10px",
          marginBottom: "10px",
        }}
      >
        <Typography display="inline" sx={{ fontSize: "0.8em" }}>
          Last Updated:{" "}
        </Typography>
        <Typography
          display="inline"
          sx={{ paddingLeft: "5px", fontSize: "0.8em" }}
        >
          2021-09-12 21:23 PDT
        </Typography>
      </Stack>
    </>
  );
}
