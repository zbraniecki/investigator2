import React, { useEffect, useState, useRef } from "react";
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
  width: "100px",
  height: "28px",
  "&:focus-within": {
    width: "120px",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    fontSize: "14px",
    paddingLeft: "6px",
    "&::placeholder": {
      color: alpha(theme.palette.common.white, 0.5),
    },
  },
}));



export function SearchInput({ handleChange }: { handleChange: any }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event: any) => {
    if (event.shiftKey === true || event.metaKey === true || event.ctrlKey === true) {
      return;
    }
    if (!focused && (event.keyCode >= 65 && event.keyCode <= 90)) { // a-z
      setFocused(true);
    } else if (event.key === "Backspace") {
      setInputValue('');
    }
  };

  const handleInputKeyDown = (event: any) => {
    if (event.shiftKey === true || event.metaKey === true || event.ctrlKey === true) {
      return;
    }
    if (event.key === "Escape") {
      setFocused(false);
      setInputValue('');
      event.stopPropagation();
    }
    event.stopPropagation();
  };

  useEffect(() => {
    handleChange(inputValue);
  }, [inputValue]);

  useEffect(() => {
    let input: HTMLInputElement = inputRef.current?.children[0] as HTMLInputElement;

    if (focused) {
      document.body.removeEventListener("keydown", handleKeyDown);
      input.addEventListener("keydown", handleInputKeyDown);
      input.focus();
    } else {
      document.body.addEventListener("keydown", handleKeyDown);
      input.removeEventListener("keydown", handleInputKeyDown);
      input.blur();
    }
  }, [focused]);

  const updateInputValue = (event: any) => {
    const query = event.target.value.trim();
    setInputValue(query);
  };

  return (
    <Search
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "100px",
        width: "auto",
        flex: 1,
        flexShrink: 2,
      }}
    >
      <SearchIcon
        fontSize="small"
        sx={{
          paddingLeft: "2px",
          color: "rgba(100, 100, 100)",
        }}
      />
      <StyledInputBase
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        ref={inputRef} placeholder="Search" value={inputValue} onChange={updateInputValue} />
    </Search>
  );
}
