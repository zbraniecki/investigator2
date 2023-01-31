import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import { assert } from "../../../utils";
import { Watchlist } from "../../../types";
import { DialogType } from "../../ui/modal/dialog";
import { getOutletContext } from "../../ui/Content";

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
  const outletContext = getOutletContext();

  const open = Boolean(anchorEl);

  const handleSetWid = (event: SelectChangeEvent) => {
    setWId(event.target.value as string);
  };

  const handleAddPublicWatchlist = () => {
    handleAddTab(wId);
    setWId("");
  };
  const handleAddNewWatchlist = () => {
    handleClose();
    outletContext.updateDialogState({
      type: DialogType.Watchlist,
      meta: {},
    });
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
      <MenuItem onClick={handleAddNewWatchlist}>New Watchlist</MenuItem>
    </Menu>
  );
}

interface ModifyProps {
  anchor: any;
  handleClose: any;
  handleRemoveTab: any;
}

export function ModifyTabMenu({
  anchor,
  handleClose,
  handleRemoveTab,
}: ModifyProps) {
  const open = Boolean(anchor);

  const handleRemove = () => {
    assert(anchor);
    handleRemoveTab(anchor[0]);
  };
  const anchorEl = anchor ? anchor[1] : null;

  return (
    <Menu
      id="watchlist-modify-tab-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <MenuItem onClick={handleRemove}>Remove</MenuItem>
    </Menu>
  );
}
