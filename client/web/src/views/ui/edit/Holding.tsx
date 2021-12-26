import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {
  getSession,
  getUsers,
  updateUserInfoThunk,
} from "../../../store/account";

interface Props {
  open: boolean;
  setOpen: any;
}

export function HoldingDialog({ open, setOpen }: Props) {
  const [assetClass, setAssetClass] = React.useState("fiat");
  const [asset, setAsset] = React.useState("fiat_usd");

  const session = useSelector(getSession);
  const users = useSelector(getUsers);
  const dispatch = useDispatch();

  const currentUser = users[session.user_pk];

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleAssetClassChange = (event: any) => {};

  const handleAssetChange = (event: any) => {
    const { value } = event.target;
    setAsset(value);
    // dispatch(
    //   updateUserInfoThunk({
    //     token: session.token,
    //     pk: session.user_pk,
    //     baseAsset: value,
    //   })
    // );
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
    >
      <DialogTitle>Add Holding</DialogTitle>
      <DialogContent dividers>
        <Box>
          <FormControl variant="standard">
            <InputLabel id="holding-asset-class-label">Class</InputLabel>
            <Select
              labelId="holding-asset-class-label"
              id="holding-asset-class"
              value={assetClass}
              onChange={handleAssetClassChange}
              label="Class"
            >
              <MenuItem value="fiat">Fiat</MenuItem>
              <MenuItem value="crypto">Crypto</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard">
            <InputLabel id="holding-asset-label">Asset</InputLabel>
            <Select
              labelId="holding-asset-label"
              id="holding-asset"
              value={asset}
              onChange={handleAssetChange}
              label="Asset"
            >
              <MenuItem value="fiat_usd">US Dollar</MenuItem>
              <MenuItem value="fiat_eur">Euro</MenuItem>
              <MenuItem value="fiat_pln">Polish Złoty</MenuItem>
              <MenuItem value="crypto_bitcoin">Bitcoin</MenuItem>
              <MenuItem value="crypto_nano">Nano</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            id="outlined-number"
            label="Quantity"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
