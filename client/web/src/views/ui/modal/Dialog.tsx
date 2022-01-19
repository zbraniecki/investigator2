import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {
  SettingsDialogTitle,
  SettingsDialogContent,
  SettingsDialogActions,
} from "./Settings";

export enum DialogType {
  None,
  Settings,
  Asset,
}

export interface DialogState {
  type?: DialogType;
}

interface ResolvedDialogState {
  type: DialogType;
}

function resolveDialogState(state: DialogState): ResolvedDialogState {
  return {
    type: state.type ?? DialogType.None,
  };
}

export function mergeDialogState(
  currentState: DialogState,
  state: DialogState
): DialogState {
  return {
    type: state.type ?? currentState.type,
  };
}

interface Props {
  state: DialogState;
  updateState: any;
}

export function ModalDialog({ state, updateState }: Props) {
  const handleCloseModal = () => {
    updateState({
      type: DialogType.None,
    });
  };

  const resolvedState = resolveDialogState(state);

  let title;
  let content;
  let actions;
  switch (resolvedState.type) {
    case DialogType.Settings: {
      title = <SettingsDialogTitle />;
      content = <SettingsDialogContent />;
      actions = <SettingsDialogActions handleCloseModal={handleCloseModal} />;
    }
  }

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={resolvedState.type !== DialogType.None}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}
