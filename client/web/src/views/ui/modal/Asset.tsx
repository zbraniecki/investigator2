import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { orange } from "@mui/material/colors";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import {
  Asset,
  Tag,
  Account,
  Holding,
  Service,
  ServiceAsset,
} from "../../../types";
import { assert } from "../../../utils/helpers";
import { currency, percent } from "../../../utils/formatters";

interface TitleProps {
  asset: Asset;
}

export function AssetDialogTitle({ asset }: TitleProps) {
  return (
    <Stack direction="row">
      <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>
        {asset.symbol[0].toUpperCase()}
      </Avatar>
      <Stack>
        <Typography>{asset.symbol.toUpperCase()}</Typography>
        <Typography>{asset.name}</Typography>
      </Stack>
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
    </Stack>
  );
}

interface ContentProps {
  asset: Asset;
  tags: Array<Tag>;
  holdings: Array<Holding>;
  accounts: Record<string, Account>;
  services: Record<string, Service>;
}

export function AssetDialogContent({
  asset,
  tags,
  holdings,
  accounts,
  services,
}: ContentProps) {
  const [notesContent, setNotesContent] = React.useState("");

  const handleAccountClick = () => {};
  const handleHoldingClick = () => {};

  const highLowPerc = Math.round(
    ((asset.info.value - asset.info.low_24h) /
      (asset.info.high_24h - asset.info.low_24h)) *
      100
  );

  const supply =
    asset.info.circulating_supply && asset.info.max_supply
      ? Math.round(
          (asset.info.circulating_supply / asset.info.max_supply) * 100
        )
      : undefined;

  const inflation = undefined;

  const lastUpdated = new Date(asset.info.last_updated);

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
              {currency(asset.info.value)}
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
                {currency(asset.info.low_24h)}
              </Typography>
              <Slider
                size="small"
                value={highLowPerc}
                track={false}
                disabled
                sx={{ opacity: "0.8" }}
              />
              <Typography
                sx={{ marginLeft: "10px", fontSize: "0.7em", color: "#666666" }}
              >
                {currency(asset.info.high_24h)}
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
                  value: percent(asset.info.price_change_percentage_1h),
                },
                {
                  label: "24h",
                  value: percent(asset.info.price_change_percentage_24h),
                },
                {
                  label: "7d",
                  value: percent(asset.info.price_change_percentage_7d),
                },
                {
                  label: "30d",
                  value: percent(asset.info.price_change_percentage_30d),
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
                <TableCell>
                  {percent(asset.info.market_cap_change_percentage_24h)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Market Cap</TableCell>
                <TableCell sx={{ color: "#999999" }}>
                  {currency(asset.info.market_cap)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Inflation</TableCell>
                <TableCell>{inflation}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Supply</TableCell>
                <TableCell>
                  {supply !== undefined && (
                    <Tooltip title={percent(supply / 100)}>
                      <LinearProgress
                        variant="determinate"
                        value={supply}
                        color="inherit"
                        sx={{ marginTop: "5px" }}
                      />
                    </Tooltip>
                  )}
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
                {tags.map((tag) => (
                    <Chip label={tag.name} variant="outlined" size="small" />
                  ))}
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
                value={notesContent.length > 0 ? notesContent : " "}
                onChange={(event: any) => setNotesContent(event.target.value)}
                maxRows={4}
                variant="standard"
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
        <Table sx={{ opacity: "0.8" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "60%" }}>Name</TableCell>
              <TableCell>APY</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holdings.map((holding) => {
              assert(holding.account);
              const account = accounts[holding.account];
              const accountName = account.name;
              const service = services[account.service];
              const serviceAsset: ServiceAsset | undefined = service.assets.find(
                (a) => a.asset_pk === asset.pk
              );
              const apy = serviceAsset ? percent(serviceAsset.apy) : "";
              return (
                <TableRow>
                  <TableCell>
                    <Link href="#" onClick={handleAccountClick}>
                      {accountName}
                    </Link>
                  </TableCell>
                  <TableCell>{apy}</TableCell>
                  <TableCell>
                    <Link href="javascript:;" onClick={handleHoldingClick}>
                      {holding.quantity}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {currency(holding.quantity * asset.info.value)}
                  </TableCell>
                </TableRow>
              );
            })}
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
          {lastUpdated.toLocaleString(undefined, {
            dateStyle: "long",
            timeStyle: "long",
          })}
        </Typography>
      </Stack>
    </>
  );
}

interface ActionProps {
  handleCloseModal: any;
}

export function AssetDialogActions({ handleCloseModal }: ActionProps) {
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
