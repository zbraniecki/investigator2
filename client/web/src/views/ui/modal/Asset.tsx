import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getSession, getUsers, updateUserInfoThunk } from "../../../store/user";

export function AssetDialogTitle() {
  return <Typography>Asset</Typography>;
}

interface ContentProps {}

export function AssetDialogContent({}: ContentProps) {
  return <></>;
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
