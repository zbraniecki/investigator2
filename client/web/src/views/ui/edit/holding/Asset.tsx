import React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { orange } from "@mui/material/colors";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { AssetInfo } from "../../../../store/oracle";

interface HeaderProps {
  asset: AssetInfo;
}

export function AssetHeader({ asset }: HeaderProps) {
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
interface Props {
  handleHoldingClick: any;
  handleAccountClick: any;
}

export function AssetContent({
  handleHoldingClick,
  handleAccountClick,
}: Props) {
  return (
    <>
      <Stack sx={{ padding: "10px 0" }}>
        <Stack direction="row">
          <Box
            sx={{
              flex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{ marginTop: "10px", textAlign: "center" }}
            >
              $46520.21
            </Typography>
            <Stack
              direction="row"
              sx={{
                padding: "0 15px",
                marginBottom: "10px",
                width: "90%",
                alignItems: "center",
                justifyContent: "space-between",
                "&:hover": {
                  "& .MuiSlider-thumb": { color: "cyan" },
                  "& span": { color: "white" },
                  "& p": { color: "white" },
                },
              }}
            >
              <Typography
                sx={{
                  marginRight: "10px",
                  fontSize: "0.7em",
                  color: "#666666",
                }}
              >
                $41000.00
              </Typography>
              <Slider
                size="small"
                value={33}
                track={false}
                disabled
                sx={{ opacity: "0.8" }}
              />
              <Typography
                sx={{ marginLeft: "10px", fontSize: "0.7em", color: "#666666" }}
              >
                $47000.00
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                width: "100%",
                padding: "0 20px",
                justifyContent: "space-between",
              }}
            >
              {[
                {
                  label: "1h",
                  value: "3.43%",
                },
                {
                  label: "24h",
                  value: "3.43%",
                },
                {
                  label: "7d",
                  value: "3.43%",
                },
                {
                  label: "30d",
                  value: "3.43%",
                },
              ].map((chip) => (
                <Chip
                  key={chip.label}
                  label={
                    <>
                      <Box component="span" sx={{ color: "#666666" }}>
                        {chip.label}:
                      </Box>{" "}
                      {chip.value}
                    </>
                  }
                  variant="outlined"
                  size="small"
                />
              ))}
            </Stack>
          </Box>
          <Table sx={{ flex: 2, marginRight: "10px" }}>
            <TableBody
              sx={{
                "& td": { p: 0 },
                "& tr:last-of-type td": { border: "0" },
                "& td:last-of-type": { textAlign: "right" },
                "& td:first-of-type": { color: "#999999" },
              }}
            >
              <TableRow>
                <TableCell>Market Cap Δ %</TableCell>
                <TableCell>3.4%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Market Cap</TableCell>
                <TableCell sx={{ color: "#999999" }}>23131</TableCell>
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
                    sx={{ marginTop: "5px" }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Stack>
      </Stack>
      <Divider />
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
                <Chip label="L1" variant="outlined" size="small" />
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
            <TableCell sx={{ width: "40%", fontSize: "0.8em" }} colSpan={4}>
              <TextField
                id="outlined-multiline-flexible"
                label="Notes"
                multiline
                fullWidth
                value=" "
                maxRows={4}
                sx={{ "& textarea": { fontSize: "0.8em" } }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: "40%", fontSize: "0.8em" }}>
              Reminder
            </TableCell>
            <TableCell
              sx={{ width: "60%", fontSize: "0.8em" }}
              align="right"
              colSpan={3}
            >
              <TextField
                id="datetime-local"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& input": {
                    fontSize: "0.9em",
                    padding: 0,
                  },
                  "& fieldset": {
                    border: 0,
                  },
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Paper>
        <Typography
          sx={{ paddingLeft: "15px", paddingTop: "5px", fontSize: "0.9em" }}
        >
          Accounts
        </Typography>
        <Table sx={{ opacity: "0.7" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "60%" }}>Name</TableCell>
              <TableCell>APY</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Link href="#" onClick={handleAccountClick}>
                  Hodlnout Wallet
                </Link>
              </TableCell>
              <TableCell>7.25%</TableCell>
              <TableCell>
                <Link href="javascript:;" onClick={handleHoldingClick}>
                  0.1
                </Link>
              </TableCell>
              <TableCell>$10341.12</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Link href="javascript:;" onClick={handleAccountClick}>
                  Celsius Wallet
                </Link>
              </TableCell>
              <TableCell>6.25%</TableCell>
              <TableCell>
                <Link href="javascript:;" onClick={handleHoldingClick}>
                  0.01
                </Link>
              </TableCell>
              <TableCell>$1341.12</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Link href="javascript:;" onClick={handleAccountClick}>
                  BlockFi Wallet
                </Link>
              </TableCell>
              <TableCell>3.25%</TableCell>
              <TableCell />
              <TableCell />
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
