import React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { orange } from "@mui/material/colors";
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
        <Stack>
          <Typography sx={{ fontSize: "0.6em" }}>Owned: 0.4</Typography>
          <Typography sx={{ fontSize: "0.6em" }}>Value: $26431.01</Typography>
        </Stack>
      </Box>
    </>
  );
}

export function HoldingContent() {
  return (
    <>
      <Table>
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
      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <Typography>Last Updated</Typography>
        <Typography>2021-09-12 21:23 PDT</Typography>
      </Stack>
    </>
  );
}
