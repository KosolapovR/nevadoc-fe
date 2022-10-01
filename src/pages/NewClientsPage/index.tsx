import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Box, Button, Paper, Stack, TableCell, Switch } from "@mui/material";
import axios from "axios";
import { URLS } from "../../api";
import { toast } from "react-hot-toast";
import { saveAs } from "file-saver";
import {
  NewClient,
  selectNewClients,
  uploadNewClientsAsync,
} from "../../features/newClients/newClientsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createTheme, Theme } from "@mui/material/styles";
import { withStyles, WithStyles } from "@mui/styles";
import clsx from "clsx";
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from "react-virtualized";
import {
  selectClientsLastDate,
  getLastClientDateAsync,
} from "../../features/clientsLastDate/clientsLastDateSlice";
import { requestParsedProductsAsync } from "../../features/parsedProducts/parsedProductsSlice";

const styles = (theme: Theme) =>
  ({
    flexContainer: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },
    table: {
      // temporary right-to-left patch, waiting for
      // https://github.com/bvaughn/react-virtualized/issues/454
      "& .ReactVirtualized__Table__headerRow": {
        ...(theme.direction === "rtl" && {
          paddingLeft: "0 !important",
        }),
        ...(theme.direction !== "rtl" && {
          paddingRight: undefined,
        }),
      },
    },
    tableRow: {
      cursor: "pointer",
    },
    tableRowHover: {
      "&:hover": {
        transition: "all ease-in 250ms",
        backgroundColor: theme.palette.grey[200],
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: "initial",
    },
  } as const);

interface ColumnData {
  dataKey: string;
  label: string;
  numeric?: boolean;
  width: number;
}

interface Row {
  index: number;
}

interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  columns: readonly ColumnData[];
  headerHeight?: number;
  onRowClick?: (data: any) => void;
  rowCount: number;
  rowGetter: (row: Row) => NewClient;
  rowHeight?: number;
}

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 60,
  };

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex }: any) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight, overflowX: "hidden" }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      onRowClick,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight!}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={headerHeight!}
            className={classes.table}
            onRowClick={(e: { [p: string]: any }) => {
              if (onRowClick) onRowClick(e.rowData);
            }}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps: any) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const defaultTheme = createTheme();
const VirtualizedTable = withStyles(styles, { defaultTheme })(
  MuiVirtualizedTable
);

function NewClientsPage() {
  const dispatch = useAppDispatch();

  const newClients = useAppSelector(selectNewClients);
  const lastClientsDate = useAppSelector(selectClientsLastDate);

  const handleSelectFiles = useCallback(
    (e: ChangeEvent) => {
      const { files } = e.target as HTMLInputElement;
      const formData = new FormData();
      if (files) {
        Array.from(files).forEach((file, index) => {
          formData.append(`file${index}`, file);
        });

        dispatch(uploadNewClientsAsync(formData))
          .unwrap()
          .then(() => {
            toast.success("Файлы загружены!");
          })
          .catch(() =>
            toast.error(
              `При попытке загрузки на сервер файлов произошла ошибка`
            )
          );
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(getLastClientDateAsync());
  }, [dispatch]);

  const downloadFile = async () => {
    const response = await axios.get(URLS.getClientsDownload(), {
      responseType: "blob",
      timeout: 30000,
    });
    if (response.status === 200) {
      toast.success("Файл успешно скачан!");
      await saveAs(response.data, "clients.xls");
    } else {
      toast.error(
        `При попытке скачать файл произошла ошибка ${response.statusText}`
      );
    }
  };

  const [onlyWithComments, setOnlyWithComments] = useState(false);

  const filteredClients = useMemo(
    () =>
      onlyWithComments ? newClients.filter((c) => !!c.comment) : newClients,
    [newClients, onlyWithComments]
  );

  const handleToggle = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setOnlyWithComments(checked);
  };

  return (
    <>
      <Paper sx={{ p: 3, marginBottom: 2 }}>
        <Stack direction="row">
          <Button
            sx={{ marginRight: 1 }}
            variant="contained"
            component="label"
            color={"secondary"}
          >
            Загрузить файлы
            <input
              type="file"
              name="upload"
              onChange={handleSelectFiles}
              multiple
              hidden
            />
          </Button>
          <Button
            color={"success"}
            variant={"outlined"}
            onClick={downloadFile}
            disabled={!newClients.length}
          >
            Скачать файл
          </Button>
        </Stack>
      </Paper>
      <Paper style={{ height: "526px", width: "100%" }}>
        <Stack
          paddingX={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Box>
            <Switch onChange={handleToggle} value={onlyWithComments} />
            Только с комментарием
          </Box>
          {`Дата последней загрузки: ${lastClientsDate}`}
        </Stack>
        {filteredClients.length > 0 ? (
          <VirtualizedTable
            rowCount={filteredClients.length}
            rowGetter={({ index }) => filteredClients[index]}
            columns={[
              {
                width: 200,
                label: "Номер карты",
                dataKey: "number",
              },
              {
                width: 200,
                label: "Номер телефона",
                dataKey: "phone",
              },
              {
                width: 200,
                label: "Покупатель",
                dataKey: "initials",
              },
              {
                width: 450,
                label: "Комментарий продавца",
                dataKey: "comment",
              },
            ]}
          />
        ) : (
          <Box
            style={{ width: "100%", height: "100%", display: "flex" }}
            alignItems={"center"}
            justifyContent={"center"}
          />
        )}
      </Paper>
    </>
  );
}

export default NewClientsPage;
