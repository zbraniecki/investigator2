import React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";

interface Props {
  open: boolean;
  setOpen: any;
}

const steps = ["Tutorial", "Add Holdings", "Add Targets", "Customize Views"];

export function TutorialPage() {
  return <Typography>Welcome to Istar Alma!</Typography>;
}

export function HoldingsPage() {
  return <Typography>Add Some Holdings</Typography>;
}

export function TutorialDialog({ open, setOpen }: Props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(
    {} as Record<string, boolean>
  );

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted: Record<string, boolean> = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const handleOk = () => {
    setOpen(false);
  };

  let currentPage = <TutorialPage />;
  switch (activeStep) {
    case 1: {
      currentPage = <HoldingsPage />;
      break;
    }
    default: {
    }
  }

  return (
    <Dialog
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxWidth: "60%" } }}
      open={open}
    >
      <DialogTitle>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent dividers sx={{ width: "100%", minHeight: "40vh" }}>
        {currentPage}
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
