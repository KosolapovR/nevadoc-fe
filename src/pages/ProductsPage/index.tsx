import React, { useEffect } from "react";
import clsx from "clsx";
import { withStyles, WithStyles } from "@mui/styles";
import { Theme, createTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from "react-virtualized";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  Product,
  requestProductsAsync,
  selectProducts,
} from "../../features/products/productsSlice";
import { Box, CircularProgress } from "@mui/material";

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
  rowGetter: (row: Row) => Product;
  rowHeight?: number;
}

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
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

function ProductsPage() {
  const products = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestProductsAsync());
  }, []);

  return (
    <Paper style={{ height: "100%", width: "100%" }}>
      {products.length > 0 ? (
        <VirtualizedTable
          rowCount={products.length}
          rowGetter={({ index }) => products[index]}
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
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
}

export default ProductsPage;
