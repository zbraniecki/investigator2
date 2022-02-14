import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  getSession,
  getUsers,
  updateUserInfoThunk,
} from "../../../../../store/user";

export function SettingsDialogTitle() {
  return <Typography>Settings</Typography>;
}

interface ContentProps {}

export function SettingsDialogContent({}: ContentProps) {
  const session = useSelector(getSession);
  const users = useSelector(getUsers);
  const dispatch = useDispatch();

  const currentUser = users[session.user_pk];
  const baseAsset = currentUser?.base_asset;

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
  );
}

interface ActionProps {
  handleCloseModal: any;
}

export function SettingsDialogActions({ handleCloseModal }: ActionProps) {
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
