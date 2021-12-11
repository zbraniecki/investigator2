import Box from "@mui/material/Box";
import { useTheme, Palette } from "@mui/material/styles";
import { AppBarColors } from "../ui/AppBar";

function SwitchRoot({ children }: any) {
  return <Box
    sx={{
      display: "flex",
      alignItems: "center",
      position: "relative",
      width: "62px",
      height: "34px",
      padding: "7px",
    }}
  >
    {children}
  </Box>
}

function SwitchInput({ onChange }: { onChange: any }) {
  return <Box
    sx={{
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      opacity: 0,
      zIndex: "1",
      margin: 0,
      cursor: "pointer",
    }}
    onClick={onChange}
  />
}

function SwitchThumb({
  colors,
  checked,
}: {
  colors: AppBarColors;
  checked: boolean;
}) {
  const className = checked ? "checked" : "";
  const theme = useTheme();
  const [a, b] = colors.accent.split(".");
  const primary: any = theme.palette[a as keyof Palette];
  const color = primary[b as keyof Palette];

  return (
    <Box
      sx={{
        position: "absolute",
        display: "block",
        backgroundColor: colors.button,
        width: "32px",
        height: "32px",
        borderRadius: "16px",
        top: "1px",
        left: "5px",
        transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:before": {
          display: "block",
          content: '""',
          width: "100%",
          height: "100%",
          background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 23 23"><path fill="${encodeURIComponent(
            color
          )}" d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"/></svg>') center center no-repeat;`,
        },
        "&.checked": {
          transform: "translateX(22px)",
        },
      }}
      className={className}
    />
  );
}

function SwitchTrack(props: { children: any; colors: AppBarColors }) {
  return <Box
    sx={{
      backgroundColor: props.colors.dent,
      borderRadius: "10px",
      width: "100%",
      height: "100%",
      display: "block",
    }}
  >
    {props.children}
  </Box>
}

interface Props {
  checked: boolean;
  onChange: any;
  colors: AppBarColors;
}

export function Switch({ onChange, checked, colors }: Props) {
  return (
    <SwitchRoot>
      <SwitchTrack colors={colors}>
        <SwitchThumb checked={checked} colors={colors} />
      </SwitchTrack>
      <SwitchInput onChange={onChange} />
    </SwitchRoot>
  );
}
