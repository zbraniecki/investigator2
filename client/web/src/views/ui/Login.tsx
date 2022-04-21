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
import { useAppDispatch } from "../../store";
import { AuthenticateState } from "../../types";
import { setAuthenticateState, authenticateThunk } from "../../store/user";
import { assert } from "../../utils/helpers";

interface Props {
  open: any;
  handleClose: any;
  authenticateState: AuthenticateState;
}

export function LoginModal({ open, handleClose, authenticateState }: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOk = () => {
    if (authenticateState === AuthenticateState.None) {
      const emailField = document.getElementById("email");
      assert(emailField instanceof HTMLInputElement);
      const passwordField = document.getElementById("password");
      assert(passwordField instanceof HTMLInputElement);
      dispatch(
        authenticateThunk({
          email: emailField.value,
          password: passwordField.value,
          handleClose,
        })
      );
    }
  };

  const onFieldFocus = () => {
    if (authenticateState === AuthenticateState.Error) {
      dispatch(setAuthenticateState(AuthenticateState.None));
    }
  };

  const onKeyUp = (event: any) => {
    if (event.keyCode === 13) {
      handleOk();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter email and password.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email"
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
