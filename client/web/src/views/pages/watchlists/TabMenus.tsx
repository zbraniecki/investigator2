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
  watchlists: Record<string, Watchlist>;
  handleClose: any;
  handleRemoveTab: any;
  handleDeleteTab: any;
}

export function ModifyTabMenu({
  anchor,
  watchlists,
  handleClose,
  handleRemoveTab,
  handleDeleteTab,
}: ModifyProps) {
  const open = Boolean(anchor);
  const {watchlist, anchorEl} = anchor ? { watchlist: watchlists[anchor[0]], anchorEl: anchor[1] } : { watchlist: null, anchorEl: null};

  const handleRemove = () => {
    assert(anchor);
    handleRemoveTab(anchor[0]);
  };

  const handleDelete = () => {
    assert(anchor);
    handleDeleteTab(anchor[0]);
  };

  let items: React.ReactNode[] = [];
  if (watchlist) {
    if (watchlist.owner) {
      items.push((<MenuItem key="tab-menu-delete" onClick={handleDelete}>Delete</MenuItem>));
    } else {
      items.push((<MenuItem key="tab-menu-remove" onClick={handleRemove}>Remove</MenuItem>));
    }
  }

  return (
    <Menu
      id="watchlist-modify-tab-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      {items.map(item => (
        item
      ))}
    </Menu>
  );
}
