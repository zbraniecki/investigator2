import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import { Watchlist } from "../../../types";

interface Props {
  anchorEl: any;
  handleClose: any;
  publicWatchlists?: Record<string, Watchlist>;
  handleAddTab: any;
}

export function AddTabMenu({
  anchorEl,
  handleClose,
  publicWatchlists,
  handleAddTab,
}: Props) {
  const [wId, setWId] = React.useState("");

  const open = Boolean(anchorEl);

  const handleSetWid = (event: SelectChangeEvent) => {
    setWId(event.target.value as string);
  };

  const handleAddPublicWatchlist = () => {
    handleAddTab(wId);
  };

  return (
    <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem disableRipple>
        <Typography
          component="span"
          sx={{
            paddingRight: "0.5em",
          }}
        >
          Public Watchlists:
        </Typography>
        <Select
          size="small"
          value={wId}
          sx={{ m: 1, width: 220 }}
          onChange={handleSetWid}
        >
          {publicWatchlists &&
            Object.values(publicWatchlists).map((watchlist) => (
              <MenuItem
                key={`add-public-watchlist-item-${watchlist.pk}`}
                value={watchlist.pk}
              >
                {watchlist.name}
              </MenuItem>
            ))}
        </Select>
        <Button
          variant="text"
          sx={{
            marginLeft: "0.5em",
          }}
          onClick={handleAddPublicWatchlist}
        >
          Add
        </Button>
      </MenuItem>
      <MenuItem>New Watchlist</MenuItem>
    </Menu>
  );
}
