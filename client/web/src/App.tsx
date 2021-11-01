import Button from "@mui/material/Button";

function test(input: String) {
  return input;
}

export function App() {
  return <Button variant="contained">{test("Hello World")}</Button>;
}
