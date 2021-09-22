import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { makeStyles, withStyles, WithStyles } from "@mui/styles";
import axios from "axios";
import { URLS } from "../../api";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  ParsedProducts,
  requestParsedProductsAsync,
  selectParsedProducts,
} from "../../features/parsedProducts/parsedProductsSlice";
import { createTheme, Theme } from "@mui/material/styles";
import clsx from "clsx";
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from "react-virtualized";
import TableCell from "@mui/material/TableCell";
import {
  requestSellersAsync,
  selectSellers,
} from "../../features/sellers/sellersSlice";
import {
  requestStocksAsync,
  selectStocks,
} from "../../features/stocks/stocksSlice";

const useStyles = makeStyles({
  uploader: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    minWidth: 200,
  },
  container: {
    minHeight: "556px",
    padding: "16px",
  },
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: "#e2e2e2",
    paddingBottom: "8px",
  },
  fileName: {
    maxWidth: 250,
    overflowX: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

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
  onRowClick?: () => void;
  rowCount: number;
  rowGetter: (row: Row) => ParsedProducts;
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
        style={{ height: rowHeight }}
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
    const { classes, columns, rowHeight, headerHeight, ...tableProps } =
      this.props;
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

function AccountPage() {
  const parsedProducts = useAppSelector(selectParsedProducts);
  const stocks = useAppSelector(selectStocks);
  const sellers = useAppSelector(selectSellers);
  const dispatch = useAppDispatch();
  const styles = useStyles();
  const [selectedFileName, setSelectedFileName] = useState<
    string | undefined
  >();
  const [seller, setSeller] = useState("");
  const [stock, setStock] = useState("");

  const inputRef = useRef({ value: "" });

  useEffect(() => {
    dispatch(requestSellersAsync());
    dispatch(requestStocksAsync());
  }, [dispatch]);

  const handleParse = useCallback(() => {
    dispatch(requestParsedProductsAsync({ params: { seller, stock } }));
  }, [dispatch, seller, stock]);

  const uploadFile = async (file: Blob) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(URLS.getFileUpload(), formData);
    if (response.status === 200) {
      toast.success("Файл загружен!");
    }
  };

  const handleSelectFile = useCallback(
    (e: ChangeEvent<any>) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFileName(file.name);
        uploadFile(file);
      }
    },
    [setSelectedFileName, uploadFile]
  );

  const handleResetFile = useCallback(() => {
    setSelectedFileName("");
  }, [setSelectedFileName]);

  const handleSellerChange = useCallback(
    (event: SelectChangeEvent) => {
      setSeller(event.target.value);
    },
    [setSeller]
  );
  const handleStockChange = useCallback(
    (event: SelectChangeEvent) => {
      setStock(event.target.value);
    },
    [setStock]
  );

  return (
    <div style={{ position: "relative" }}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        className={styles.header}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          style={{ width: "600px" }}
        >
          {selectedFileName ? (
            <div className={styles.uploader} onClick={handleResetFile}>
              <CancelIcon color={"primary"} />
              <Typography className={styles.fileName} fontSize={12}>
                {selectedFileName}
              </Typography>
            </div>
          ) : (
            <label htmlFor="upload" className={styles.uploader}>
              <FileUploadIcon color={"primary"} />
              Выберите накладную
            </label>
          )}
          <Stack
            direction={"row"}
            justifyContent={"end"}
            alignItems={"center"}
            style={{ width: "600px" }}
          >
            <FormControl sx={{ m: 1, minWidth: 140 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Поставщик
              </InputLabel>
              <Select
                size={"small"}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={seller}
                label="Поставщик"
                onChange={handleSellerChange}
              >
                {sellers.map((s) => (
                  <MenuItem key={s.id} value={s.engName}>
                    {s.ruName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 140 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Склад
              </InputLabel>
              <Select
                size={"small"}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={stock}
                label="Склад"
                onChange={handleStockChange}
              >
                {stocks.map((s) => (
                  <MenuItem key={s.id} value={s.ruName}>
                    {s.ruName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Button
          color={"primary"}
          variant={"contained"}
          onClick={handleParse}
          style={{ height: "40px" }}
        >
          Спарсить
        </Button>
      </Stack>

      <Input
        style={{ display: "none" }}
        ref={inputRef}
        id={"upload"}
        size={"small"}
        type={"file"}
        onChange={handleSelectFile}
      />
      <Paper className={styles.container}>
        {parsedProducts.length > 0 ? (
          <VirtualizedTable
            rowCount={parsedProducts.length}
            rowGetter={({ index }) => parsedProducts[index]}
            columns={[
              {
                width: 100,
                label: "Seller",
                dataKey: "seller",
              },
              {
                width: 380,
                label: "Pattern",
                dataKey: "pattern",
              },
              {
                width: 200,
                label: "Name",
                dataKey: "name",
              },
              {
                width: 80,
                label: "Size",
                dataKey: "size",
              },
              {
                width: 80,
                label: "Color",
                dataKey: "color",
              },
              {
                width: 80,
                label: "Material",
                dataKey: "material",
              },
              {
                width: 80,
                label: "Sleeve",
                dataKey: "sleeve",
              },
              {
                width: 80,
                label: "Print",
                dataKey: "print",
              },
            ]}
          />
        ) : (
          <Box
            style={{ width: "100%", height: "100%", display: "flex" }}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {/*<CircularProgress />*/}
          </Box>
        )}
      </Paper>
    </div>
  );
}

export default AccountPage;
