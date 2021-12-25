import React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";

import { IntroPage } from "./pages/Intro";
import { HoldingsPage } from "./pages/Holdings";
import { AccumulatingPage } from "./pages/Accumulating";
import { InvestingPage } from "./pages/Investing";
import { RiskPage } from "./pages/Risk";
import { StrategyPage } from "./pages/Strategy";
import { DCAPage } from "./pages/DCA";
import { MPTPage } from "./pages/MPT";
import { SummaryPage } from "./pages/Summary";

interface Props {
  open: boolean;
  setOpen: any;
}

const steps = [
  {
    label: "Tutorial",
    index: 0,
    children: [
      <AccumulatingPage />,
      <InvestingPage />,
      <RiskPage />,
      <StrategyPage />,
      <DCAPage />,
      <MPTPage />,
      <SummaryPage />,
    ],
  },
  {
    label: "Add Holdings",
    index: 2,
    children: [],
  },
  {
    label: "Add Targets",
    index: 3,
    children: [],
  },
  {
    label: "Customize",
    index: 4,
    children: [],
  },
];

export function TutorialDialog({ open, setOpen }: Props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [subStep, setSubStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(
    {} as Record<string, boolean>
  );

  const subSteps = steps[0].children.length + 1;

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    let lastSubStep = false;
    if (activeStep === 0 && subStep < subSteps) {
      const newSubStep = subStep + 1;
      setSubStep(newSubStep);
      if (newSubStep == subSteps) {
        lastSubStep = true;
      }
    }
    if (subStep == subSteps || lastSubStep) {
      const newActiveStep = activeStep + 1;
      setActiveStep(newActiveStep);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setSubStep(0);
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

  let currentPage = <IntroPage />;
  switch (activeStep) {
    case 0: {
      if (subStep > 0) {
        currentPage = steps[0].children[subStep - 1];
      }
      break;
    }
    case 1: {
      currentPage = <HoldingsPage />;
      break;
    }
    default: {
    }
  }

  const subStepPerc = Math.round((subStep / subSteps) * 100);
  const subStepGradient = `linear-gradient(to right, #00bcd4 ${subStepPerc}%, #757575 ${subStepPerc}% 100%)`;

  const sx: Record<string, any> = {
    "& > div.MuiStepConnector-root:nth-child(2) > span": {
      background: subStepGradient,
      height: "1px",
      border: "none",
    },
  };

  for (let i = 1; i < activeStep; i++) {
    sx[`& > div.MuiStepConnector-root:nth-child(${2 * (i + 1)}) > span`] = {
      backgroundColor: "#00bcd4",
      height: "1px",
      border: "none",
    };
  }

  return (
    <Dialog
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxWidth: "60%" } }}
      open={open}
    >
      <DialogTitle>
        <Stepper nonLinear activeStep={activeStep} sx={sx}>
          {steps.map((step, index) => (
            <Step key={step.label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {step.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          width: "100%",
          minHeight: "40vh",
          "& strong": {
            fontWeight: "500",
            fontStyle: "italic",
            bgcolor: "rgba(255, 255, 237, 0.1)",
            paddingLeft: "2px",
            paddingRight: "5px",
          },
          "& .MuiTypography-body1": { p: 1 },
        }}
      >
        {currentPage}
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", flexDirection: "row", justifyContent: "start" }}
      >
        <Button onClick={handleCancel}>Cancel</Button>
        <Box sx={{ flex: 1 }} />
        <Button autoFocus onClick={handleNext}>
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
}
