import * as React from "react";
import { useCallback, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Checkbox } from "@mui/material";
import BaseModal from "../BaseModal";
import SimpleItemForm from "../SimpleItemForm";
import { CreateReq, UpdateReq } from "../../types";
import Toolbar from "@mui/material/Toolbar";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

type PropsType = {
  rows?: { id: string; [key: string]: any }[];
  columns?: string[];
  onAddItem: (data: CreateReq) => void;
  onEditItem: (data: UpdateReq | object) => void;
  onDeleteItem: (id: string) => void;
  addFormTitle?: string;
  editFormTitle?: string;
  tableHeader: string;
};

interface EnhancedTableToolbarProps {
  numSelected: number;
  onDelete: () => void;
  tableHeader: string;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, onDelete, tableHeader } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableHeader}
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Удалить">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

function SimpleTable({
  rows = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  addFormTitle,
  editFormTitle,
  columns = ["value"],
  tableHeader,
}: PropsType) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleAddItem = useCallback(() => {
    setAddModalOpen(true);
  }, [setAddModalOpen]);
  const handleAddCloseModal = useCallback(() => {
    setAddModalOpen(false);
  }, [setAddModalOpen]);

  const handleEditItem = useCallback(
    (id?: string) => {
      const curr = rows?.find((item) => item.id === id);
      if (curr) setCurrentRow(curr);
      setEditModalOpen(true);
    },
    [setEditModalOpen, setCurrentRow, rows]
  );
  const handleEditCloseModal = useCallback(() => {
    setEditModalOpen(false);
  }, [setEditModalOpen]);

  const onSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelecteds = rows.map((n) => n.id);
        setSelected(newSelecteds || []);
        return;
      }
      setSelected([]);
    },
    [rows, setSelected]
  );

  const handleClickCheckbox = useCallback(
    (event: React.MouseEvent<unknown> | any, id: string) => {
      event.stopPropagation();
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly string[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
    },
    [selected, setSelected]
  );

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <EnhancedTableToolbar
        numSelected={selected.length}
        onDelete={() => {
          selected.forEach(onDeleteItem);
          setSelected([]);
        }}
        tableHeader={tableHeader}
      />
      <TableContainer component={Paper} sx={{ minHeight: 562, maxHeight: 562 }}>
        <BaseModal onClose={handleAddCloseModal} open={addModalOpen}>
          <SimpleItemForm
            formTitle={addFormTitle}
            onSubmit={onAddItem}
            simple={columns[0] === "value"}
          />
        </BaseModal>
        <BaseModal onClose={handleEditCloseModal} open={editModalOpen}>
          <SimpleItemForm
            formTitle={editFormTitle}
            onSubmit={onEditItem}
            initialValues={currentRow}
            simple={columns[0] === "value"}
          />
        </BaseModal>
        <Table sx={{ minWidth: 200 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={onSelectAllClick}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </TableCell>
              <TableCell width={50}>ID</TableCell>
              {columns.map((c, i) => (
                <TableCell key={i} align="left">
                  {c}
                </TableCell>
              ))}
              <TableCell align="right">
                <Button onClick={handleAddItem} variant={"contained"}>
                  Добавить
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `table-checkbox-${index}`;
              return (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => handleEditItem(row.id)}
                  hover
                >
                  <TableCell
                    width={50}
                    component="th"
                    scope="row"
                    padding="checkbox"
                  >
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onClick={(event) => handleClickCheckbox(event, row.id)}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    width={50}
                    component="th"
                    scope="row"
                    style={{ color: "#999999" }}
                  >
                    {row.id}
                  </TableCell>

                  {columns.map((c, i) => (
                    <TableCell key={i} align="left">
                      {row[c]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default SimpleTable;
