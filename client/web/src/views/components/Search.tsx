import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  transition: theme.transitions.create("width"),
  width: "80px",
  height: "24px",
  "&:focus-within": {
    width: "120px",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    fontSize: "10px",
    paddingLeft: "6px",
    "&::placeholder": {
      color: alpha(theme.palette.common.white, 0.5),
    },
  },
}));

export function SearchInput({ handleChange }: { handleChange: any }) {
  return (
    <Search
      sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <SearchIcon
        fontSize="small"
        sx={{
          paddingLeft: "2px",
          color: "rgba(100, 100, 100)",
        }}
      />
      <StyledInputBase placeholder="Search" onChange={handleChange} />
    </Search>
  );
}
