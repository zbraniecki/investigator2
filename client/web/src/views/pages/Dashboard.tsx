import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { Component as Table, Props as TableProps } from "../components/Table";
import { useSelector } from "react-redux";
import {
  WatchlistTableRow,
  prepareWatchlistTableData,
} from "../../utils/watchlist";
import {
  PortfolioTableRow,
} from "../../utils/portfolio";
import {
  assert,
} from "../../utils/helpers";
import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
import {
  getAssetInfo,
  getWatchlists as getPublicWatchlists,
  Watchlist,
} from "../../store/oracle";
import {
  getPortfolios,
  getWatchlists as getUserWatchlists,
  getUsers,
  getSession,
} from "../../store/account";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
}));

const tableMeta: TableProps["meta"] = {
  id: "watchlist",
  sort: {
    column: "market_cap_rank",
    direction: "desc",
  },
  nested: false,
  headers: [
    {
      label: "#",
      id: "market_cap_rank",
      align: "right",
      width: 0.01,
    },
    {
      label: "Name",
      id: "name",
      align: "left",
      width: 0.15,
      formatter: "symbol",
    },
    {
      label: "Price",
      id: "price",
      align: "left",
      width: "auto",
      formatter: "currency",
    },
    {
      label: "1h",
      id: "price_change_percentage_1h",
      align: "left",
      width: 0.1,
      formatter: "percent",
      colorDiff: true,
    },
    {
      label: "24h",
      id: "price_change_percentage_24h",
      align: "left",
      width: 0.1,
      formatter: "percent",
      colorDiff: true,
    },
  ],
  header: true,
};

const tableMeta2: TableProps["meta"] = {
  id: "total",
  sort: {
    column: "value",
    direction: "asc",
  },
  nested: false,
  headers: [
    {
      label: "Name",
      id: "name",
      align: "left",
      width: 0.15,
      formatter: "symbol",
    },
    {
      label: "Value",
      id: "value",
      align: "right",
      width: "auto",
      formatter: "currency",
    },
    {
      label: "1h",
      id: "price_change_percentage_1h",
      align: "left",
      width: 0.1,
      formatter: "percent",
      colorDiff: true,
    },
    {
      label: "24h",
      id: "price_change_percentage_24h",
      align: "left",
      width: 0.1,
      formatter: "percent",
      colorDiff: true,
    },
  ],
};

export function Dashboard() {
  const publicWatchlists: Record<string, Watchlist> = useSelector(getPublicWatchlists);
  const userWatchlists: Record<string, Watchlist> = useSelector(getUserWatchlists);
  const assetInfo = useSelector(getAssetInfo);
  const portfolios = useSelector(getPortfolios);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);
  const infoDisplayMode = useSelector(getInfoDisplayMode);

  let wid = Object.keys(publicWatchlists)[0];
  let watchlist = publicWatchlists[wid];

  let tableData: Array<WatchlistTableRow> = [];
  let subHeaderRow: WatchlistTableRow | undefined;
  let data = prepareWatchlistTableData(
    wid,
    publicWatchlists,
    assetInfo,
    portfolios
  );
  if (data) {
    assert(data.children);
    subHeaderRow = {
      cells: data.cells,
      type: "asset",
    };
    tableData = data.children.slice(0, 3);
  }

  let tableData2: PortfolioTableRow[] = [
    {
      "cells": {
        "id": "stock",
        "name": "Stock",
        "value": 34000,
        // "price_change_percentage_1h": 0.03,
        // "price_change_percentage_24h": -0.0219,
      },
      type: "asset",
    },
    {
      "cells": {
        "id": "crypto",
        "name": "Crypto",
        "value": 11921,
        // "price_change_percentage_1h": 0.0401,
        // "price_change_percentage_24h": 0.0919,
      },
      type: "asset",
    },
    {
      "cells": {
        "id": "cash",
        "name": "Cash",
        "value": 1833,
        // "price_change_percentage_1h": 0.0,
        // "price_change_percentage_24h": 0.0,
      },
      type: "asset",
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={7}>
        <Card>
          <CardActionArea>
            <CardContent>
              <Table
                meta={tableMeta2}
                data={tableData2}
                hideSensitive={infoDisplayMode === InfoDisplayMode.HideValues}
              />
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={5} sx={{display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card sx={{ height: "100%", width: "100%" }}>
          <CardActionArea>
            <CardContent>
              <Typography sx={{textAlign: "center"}} gutterBottom variant="h5" component="div">
                Total: $50,000
              </Typography>
              <Divider variant="middle" sx={{ margin: "20px" }} />
              <Stack direction="row" sx={{ justifyContent: "center" }}>
                <Item elevation={0} sx={{ bgcolor: "inherit" }}>
                  <Chip avatar={
                  <Typography sx={{ display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }} align="center">1h</Typography>
                  } label="0.45%" variant="outlined" />
                </Item>
                <Item elevation={0} sx={{ bgcolor: "inherit" }}>
                  <Chip avatar={
                  <Typography sx={{ display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }} align="center">24h</Typography>
                  } label="2.30%" color="success" variant="outlined" />
                </Item>
                <Item elevation={0} sx={{ bgcolor: "inherit" }}>
                  <Chip avatar={
                  <Typography sx={{ display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }} align="center">7d</Typography>
                  } label="-1.22%" variant="outlined" />
                </Item>
                <Item elevation={0} sx={{ bgcolor: "inherit" }}>
                  <Chip avatar={
                  <Typography sx={{ display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }} align="center">30d</Typography>
                  } label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography fontSize="small">0.45%</Typography>
                    <ArrowUpwardIcon fontSize="small" color="success" />
                  </Box>
                  } variant="outlined" />
                </Item>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardActionArea>
            <CardContent>
              <Item>xs=4</Item>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={8}>
        <Card>
          <CardActionArea>
            <CardContent>
              <Table
                meta={tableMeta}
                data={tableData}
                subHeaderRow={subHeaderRow}
                hideSensitive={infoDisplayMode === InfoDisplayMode.HideValues}
              />
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
}
