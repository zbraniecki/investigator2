import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import {
  AuthenticateState,
  setAuthenticateState,
  authenticateThunk,
} from "../../../store/account";
import { assert } from "../../../utils/helpers";

interface Props {
  open: any;
  handleClose: any;
  authenticateState: AuthenticateState;
}

export function LoginModal({ open, handleClose, authenticateState }: Props) {
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch();

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function handleOk() {
    if (authenticateState === AuthenticateState.None) {
      const userField = document.getElementById("username");
      assert(userField instanceof HTMLInputElement);
      const passwordField = document.getElementById("password");
      assert(passwordField instanceof HTMLInputElement);
      dispatch(
        authenticateThunk({
          username: userField.value,
          password: passwordField.value,
          handleClose,
        })
      );
    }
  }

  function onFieldFocus() {
    if (authenticateState === AuthenticateState.Error) {
      dispatch(setAuthenticateState(AuthenticateState.None));
    }
  }

  function onKeyUp(event: any) {
    if (event.keyCode === 13) {
      handleOk();
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter username and password.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          type="email"
          fullWidth
          error={authenticateState === AuthenticateState.Error}
          onFocus={onFieldFocus}
          variant="standard"
        />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          onFocus={onFieldFocus}
          onKeyDown={onKeyUp}
          error={authenticateState === AuthenticateState.Error}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleOk}>Login</Button>
      </DialogActions>
    </Dialog>
  );
}
