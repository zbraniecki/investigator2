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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Asset,
  Watchlist,
  Holding,
  Service,
  getTransactionTypeLabel,
} from "../../../../../types";
import { assert } from "../../../../../utils/helpers";
import { currency, percent, datetime } from "../../../../../utils/formatters";
import { DialogType } from "../Dialog";

interface TitleProps {
  watchlist: Watchlist | null;
  onClose: any;
}

export function WatchlistDialogTitle({ watchlist, onClose }: TitleProps) {
  if (watchlist) {
    return (
      <Stack direction="row">
        <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>
          {watchlist.name.toUpperCase().slice(0, 1)}
        </Avatar>
        <Stack>
          <Typography>{watchlist.name}</Typography>
        </Stack>
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
    );
  }
  return (
    <Stack direction="row">
      <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>N</Avatar>
      <Stack>
        <Typography>New Watchlist</Typography>
      </Stack>
      <Box sx={{ flex: 1 }} />
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}

enum WatchlistType {
  User = "user",
  Public = "public",
}

interface ContentProps {
  watchlist: Watchlist | null;
  publicWatchlists: Record<string, Watchlist>;
  userWatchlists: Record<string, Watchlist>;
}

export function WatchlistDialogContent({
  watchlist,
  publicWatchlists,
  userWatchlists,
}: ContentProps) {
  const [wType, setWType] = React.useState(WatchlistType.User);
  const [wId, setWId] = React.useState("");

  const handleSetWType = (event: SelectChangeEvent) => {
    setWId("");
    setWType(event.target.value as WatchlistType);
  };

  const handleSetWId = (event: SelectChangeEvent) => {
    setWId(event.target.value as string);
  };

  const watchlists =
    wType == WatchlistType.Public ? publicWatchlists : userWatchlists;

  return (
    <Stack>
      <Box>
        <FormControl sx={{ m: 1, minWidth: 180 }}>
          <InputLabel id="watchlist-type-select">Watchlist Type</InputLabel>
          <Select
            labelId="watchlist-type-select"
            value={wType}
            autoWidth
            label="Watchlist Type"
            onChange={handleSetWType}
          >
            <MenuItem value={WatchlistType.User}>Your</MenuItem>
            <MenuItem value={WatchlistType.Public}>Public</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 300 }}>
          <InputLabel id="watchlist-name-select">Name</InputLabel>
          <Select
            labelId="watchlist-name-select"
            value={wId}
            autoWidth
            label="Name"
            onChange={handleSetWId}
          >
            {Object.values(watchlists).map((watchlist) => (
              <MenuItem
                key={`watchlist-select-${watchlist.pk}`}
                value={watchlist.pk}
              >
                {watchlist.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Stack>
  );
}

interface ActionProps {
  handleCloseModal: any;
}

export function WatchlistDialogActions({ handleCloseModal }: ActionProps) {
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
