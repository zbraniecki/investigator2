import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AbcIcon from "@mui/icons-material/Abc";
import SubjectIcon from "@mui/icons-material/Subject";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import { BaseTableMeta, TableMeta } from "./data/Table";

export interface Props {
  anchorEl: any;
  handleMenuClose: any;
  baseMeta: BaseTableMeta;
  tableMeta: TableMeta;
  handleColumnVisibilityChange: any;
}

export function TableMenu({
  anchorEl,
  handleMenuClose,
  baseMeta,
  tableMeta,
  handleColumnVisibilityChange,
}: Props) {
  const handleCheckedChange = (columnId: string) => {
    handleColumnVisibilityChange(columnId);
  };

  return (
    <Menu
      id="table-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      MenuListProps={{ dense: true }}
    >
      <MenuItem
        sx={{
          display: "flex",
        }}
      >
        <ListItemText sx={{ minWidth: "100px", flex: 1 }}>Name</ListItemText>
        <ListItemIcon
          sx={{
            marginRight: "-6px",
            marginLeft: "20px",
            width: "100px",
          }}
        >
          <ToggleButtonGroup size="small" value={["symbol", "name"]}>
            <ToggleButton value="icon">
              <MonetizationOnIcon />
            </ToggleButton>
            <ToggleButton value="symbol">
              <AbcIcon />
            </ToggleButton>
            <ToggleButton value="name">
              <SubjectIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItemIcon>
      </MenuItem>
      <Divider />
      {Object.entries(baseMeta.columns).map(([key, column]) => {
        const current = tableMeta.columns.find((c) => c.key === key);
        const visible = Boolean(current?.visible);
        const disabled = key === "name";

        return (
          <MenuItem
            key={`table-menu-visibility-${key}`}
            sx={{
              display: "flex",
            }}
            onClick={() => handleCheckedChange(key)}
          >
            <ListItemText sx={{ minWidth: "100px", flex: 1 }}>
              {column.label}
            </ListItemText>
            <ListItemIcon
              sx={{
                marginRight: "-10px",
                marginLeft: "20px",
                width: "100px",
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              <Checkbox checked={visible} disabled={disabled} />
            </ListItemIcon>
          </MenuItem>
        );
      })}
    </Menu>
  );
}
