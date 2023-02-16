import React from "react";
import { useSelector } from "react-redux";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Asset,
  Watchlist,
  WatchlistType,
  Holding,
  Service,
  Portfolio,
  getTransactionTypeLabel,
} from "../../../../../types";
import {
  useAppDispatch,
  getSession,
  addUserWatchlistThunk,
} from "../../../../../store";
import { assert } from "../../../../../utils/helpers";
import { currency, percent, datetime } from "../../../../../utils/formatters";
import { DialogType } from "../Dialog";

interface TitleProps {
  watchlist: Partial<Watchlist>;
  setWatchlist: any;
  onClose: any;
}

export function WatchlistDialogTitle({
  watchlist,
  setWatchlist,
  onClose,
}: TitleProps) {
  const firstLetter = watchlist.name ? watchlist.name[0].toUpperCase() : "";

  const handleNameChange = (event: any) => {
    const newWatchlist = Object.fromEntries(Object.entries(watchlist));
    newWatchlist.name = event.target.value;
    setWatchlist(newWatchlist);
  };

  return (
    <Stack direction="row">
      <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>{firstLetter}</Avatar>
      <Stack>
        <TextField
          id="watchlist-name"
          label="Name"
          value={watchlist.name || ""}
          onChange={handleNameChange}
          variant="standard"
        />
      </Stack>
      <Box sx={{ flex: 1 }} />
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}

interface ContentProps {
  watchlist: Partial<Watchlist>;
  setWatchlist: any;
  publicWatchlists: Record<string, Watchlist>;
  userWatchlists: Record<string, Watchlist>;
  portfolios: Record<string, Portfolio>;
}

export function WatchlistDialogContent({
  watchlist,
  setWatchlist,
  publicWatchlists,
  userWatchlists,
  portfolios,
}: ContentProps) {
  const handleSetWType = (event: SelectChangeEvent) => {
    const newWatchlist = Object.fromEntries(Object.entries(watchlist));
    newWatchlist.type = event.target.value as WatchlistType;
    setWatchlist(newWatchlist);
  };

  const handleSetWPortfolio = (event: SelectChangeEvent) => {
    const newWatchlist = Object.fromEntries(Object.entries(watchlist));
    newWatchlist.portfolio = event.target.value;
    setWatchlist(newWatchlist);
  };

  return (
    <Stack>
      <Box>
        <FormControl sx={{ m: 1, minWidth: 180 }}>
          <InputLabel id="watchlist-type-select">Watchlist Type</InputLabel>
          <Select
            labelId="watchlist-type-select"
            value={watchlist.type || ""}
            autoWidth
            label="Watchlist Type"
            onChange={handleSetWType}
          >
            <MenuItem value={WatchlistType.Assets}>Assets</MenuItem>
            <MenuItem value={WatchlistType.Portfolio}>Portfolio</MenuItem>
            <MenuItem value={WatchlistType.Tag}>Tag</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 180 }}>
          <InputLabel id="watchlist-type-select">Portfolio</InputLabel>
          <Select
            labelId="watchlist-portfolio-select"
            value={watchlist.portfolio || ""}
            autoWidth
            label="Portfolio"
            onChange={handleSetWPortfolio}
          >
            {Object.values(portfolios).map((portfolio) => (
              <MenuItem
                key={`watchlist-add-portfolio-${portfolio.pk}`}
                value={portfolio.pk}
              >
                {portfolio.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Stack>
  );
}

interface ActionProps {
  watchlist: any;
  handleCloseModal: any;
}

export function WatchlistDialogActions({
  watchlist,
  handleCloseModal,
}: ActionProps) {
  const dispatch = useAppDispatch();

  const session = useSelector(getSession);

  const handleOk = (event: any) => {
    dispatch(
      addUserWatchlistThunk({
        token: session.token,
        watchlist,
      })
    );
    handleCloseModal();
  };

  return (
    <>
      <Button autoFocus onClick={handleCloseModal}>
        Cancel
      </Button>
      <Button onClick={handleOk}>Ok</Button>
    </>
  );
}
