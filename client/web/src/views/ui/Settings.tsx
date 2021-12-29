import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getSession, getUsers, updateUserInfoThunk } from "../../store/user";

interface Props {
  open: boolean;
  setOpen: any;
  onOk: any;
}

export function SettingsDialog({ open, setOpen, onOk }: Props) {
  const session = useSelector(getSession);
  const users = useSelector(getUsers);
  const dispatch = useDispatch();

  const currentUser = users[session.user_pk];
  const baseAsset = currentUser?.base_asset;

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleBaseAssetChange = (event: any) => {
    const { value } = event.target;
    dispatch(
      updateUserInfoThunk({
        token: session.token,
        pk: session.user_pk,
        baseAsset: value,
      })
    );
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent dividers>
        <FormControl variant="standard">
          <InputLabel id="settings-base-asset-label">Base Asset</InputLabel>
          <Select
            labelId="settings-base-asset-label"
            id="settings-base-asset"
            value={baseAsset}
            onChange={handleBaseAssetChange}
            label="Base Asset"
          >
            <MenuItem value="fiat_usd">US Dollar</MenuItem>
            <MenuItem value="crypto_bitcoin">Bitcoin</MenuItem>
          </Select>
        </FormControl>
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
