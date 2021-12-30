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

export function AccountHeader() {
  return (
    <>
      <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>H</Avatar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography>Hodlnout</Typography>
        <Typography>Wallet</Typography>
        <Typography />
      </Box>
    </>
  );
}

export function AccountContent() {
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
