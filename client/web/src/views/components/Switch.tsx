import clsx from "clsx";
import { styled } from "@mui/system";
import { useSwitch } from "@mui/base/SwitchUnstyled";

const SwitchRoot = styled("span")`
  display: inline-block;
  position: relative;
  width: 62px;
  height: 34px;
  padding: 7px;
`;

const SwitchInput = styled("input")`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  cursor: pointer;
`;

const SwitchThumb = styled("span")(
  ({ theme }) => `
  position: absolute;
  display: block;
  background-color: ${
    theme.palette.mode === "dark" ? "#333333" : theme.palette.primary[50]
  };
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 1px solid ${
    theme.palette.mode === "dark" ? "#333333" : theme.palette.primary[200]
  };
  top: 1px;
  left: 7px;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:before {
    display: block;
    content: "";
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="1 0 23 23"><path fill="${encodeURIComponent(
      theme.palette.mode === "dark"
        ? theme.palette.action.active
        : theme.palette.primary[900]
    )}" d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"/></svg>') center center no-repeat;
  }

  &.focusVisible {
    background-color: #79B;
  }

  &.checked {
    transform: translateX(18px);
  }
`
);

const SwitchTrack = styled("span")(
  ({ theme }) => `
  background-color: ${
    theme.palette.mode === "dark"
      ? theme.palette.divider
      : theme.palette.primary[50]
  };
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: block;
`
);

export function Switch(props: any) {
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props);

  const stateClasses = {
    checked,
    disabled,
    focusVisible,
  };

  return (
    <SwitchRoot className={clsx(stateClasses)}>
      <SwitchTrack>
        <SwitchThumb className={clsx(stateClasses)} />
      </SwitchTrack>
      <SwitchInput {...getInputProps()} />
    </SwitchRoot>
  );
}
