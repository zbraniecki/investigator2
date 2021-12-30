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

interface Props {
  asset: AssetInfo;
}

export function AssetHeader({ asset }: Props) {
  return (
    <>
      <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>
        {asset?.symbol[0].toUpperCase()}
      </Avatar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography>{asset?.symbol.toUpperCase()}</Typography>
        <Typography>{asset?.name}</Typography>
        <Typography />
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

export function AssetContent() {
  return (
    <>
      <Stack>
        <Stack direction="row">
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">$46520.21</Typography>
            <Slider
              size="small"
              value={33}
              track={false}
              disabled
              sx={{ opacity: "0.8", "& .MuiSlider-thumb": { color: "cyan" } }}
            />
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.7em", color: "#ffffff" }}>
                $41000.00
              </Typography>
              <Typography sx={{ fontSize: "0.7em", color: "#ffffff" }}>
                $47000.00
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Chip label="3.43%" variant="outlined" size="small" />
              <Chip label="3.43%" variant="outlined" size="small" />
              <Chip label="3.43%" variant="outlined" size="small" />
              <Chip label="3.43%" variant="outlined" size="small" />
            </Stack>
          </Box>
          <Table sx={{ flex: 1 }}>
            <TableBody sx={{ "& td": { p: 0 } }}>
              <TableRow>
                <TableCell>Market Cap %</TableCell>
                <TableCell>3.4%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Market Cap</TableCell>
                <TableCell>23131</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Inflation</TableCell>
                <TableCell>6.9%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Supply</TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={33}
                    color="inherit"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Stack>
      </Stack>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sx={{ width: "40%", fontSize: "0.8em" }}>Tags</TableCell>
            <TableCell
              sx={{ width: "60%", fontSize: "0.8em" }}
              align="right"
              colSpan={3}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: "flex-end" }}
              >
                <Chip label="defi" variant="outlined" size="small" />
                <Chip label="cosmos" variant="outlined" size="small" />
                <Chip label="l1" variant="outlined" size="small" />
              </Stack>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: "40%", fontSize: "0.8em" }}>
              Competitors
            </TableCell>
            <TableCell
              sx={{ width: "60%", fontSize: "0.8em" }}
              align="right"
              colSpan={3}
            >
              ALGO, ONE, DOT
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: "40%", fontSize: "0.8em" }}>
              Notes
            </TableCell>
            <TableCell
              sx={{ width: "60%", fontSize: "0.8em" }}
              align="right"
              colSpan={3}
             />
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: "40%", fontSize: "0.8em" }}>
              Reminder
            </TableCell>
            <TableCell
              sx={{ width: "60%", fontSize: "0.8em" }}
              align="right"
              colSpan={3}
             />
          </TableRow>
        </TableBody>
      </Table>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Hodlnout Wallet</TableCell>
            <TableCell>7.25%</TableCell>
            <TableCell>0.1</TableCell>
            <TableCell>$10341.12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Celsius Wallet</TableCell>
            <TableCell>6.25%</TableCell>
            <TableCell>0.01</TableCell>
            <TableCell>$1121.01</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>BlockFi Wallet</TableCell>
            <TableCell>3.25%</TableCell>
            <TableCell />
            <TableCell />
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
