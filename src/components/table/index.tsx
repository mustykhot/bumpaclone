import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Checkbox, IconButton, TableHead } from "@mui/material";
import Box from "@mui/material/Box";
import Table, { TableProps } from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useRef,
} from "react";
import "./style.scss";
import EmptyResponse from "components/EmptyResponse";
import { PaginationMeta } from "Models/index";
import { ErrorType } from "services/api.types";
import DropDownWrapper from "../DropDownWrapper";
import ErrorMsg from "../ErrorMsg";
import LoadingTable from "../loadingTable";
import MyPagination from "./pagination";

type Props = {
  headCells: Array<{
    key: string;
    name: string;
  }>;
  headCellChild?: any;
  isLoading?: Boolean;
  isError?: Boolean;
  showPagination?: Boolean;
  error?:
    | ErrorType
    | FetchBaseQueryError
    | SerializedError
    | undefined
    | string;
  scrollX?: Boolean;
  scrollY?: Boolean;
  maxHeight?: string;
  tableData: any;
  showHead?: boolean;
  meta?: PaginationMeta;
  page?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  tableHeader?: ReactNode;
  setSelected?: any;
  selected?: any;
  selectMultiple?: boolean;
  setDataCount?: any;
  dataCount?: any;
  selectSingle?: any;
  setSelectSingle?: any;
  selectBulk?: any;
  setSelectBulk?: any;
  emptyImg?: any;
  handleClick?: any;
  getRowIndex?: any;
  activeRowClass?: boolean;
  isInstagram?: boolean;
  tableType?: string;
  extraTableClass?: string;
  emptyMessage?: string;
};

const headCellTest = [
  {
    key: "name",
    name: "Full Name",
  },
  {
    key: "email",
    name: "Email Address",
  },
  {
    key: "number",
    name: "Phone Number",
  },
  {
    key: "links",
    name: "Links created",
  },
  {
    key: "date",
    name: "Date joined",
  },
];

export default function TableComponent({
  tableData = Array(7)
    .fill("")
    .map((_, i) => ({
      name: "Jacob Jones",
      number: "(405) 555-0128",
      email: "deanna.curtis@example.com",
      role: "01/01/2020",
      action: "",
      id: `row_${i}`,
    })),
  isLoading,
  isError,
  showHead = true,
  error,
  headCells = headCellTest,
  showPagination = false,
  dataCount,
  setDataCount,
  handleClick,
  getRowIndex,
  activeRowClass,
  isInstagram = false,
  meta = {
    totalPage: 1,
    current: 1,
    perPage: 10,
  },
  page,
  setPage,
  scrollX = true,
  scrollY = false,
  maxHeight = "350px",
  tableHeader,
  setSelected,
  selected,
  selectMultiple = false,
  selectSingle,
  setSelectSingle,
  selectBulk,
  setSelectBulk,
  emptyImg,
  tableType,
  extraTableClass,
  headCellChild,
  emptyMessage,
  ...props
}: Props & TableProps) {
  const tableRef = useRef() as MutableRefObject<HTMLDivElement>;

  const toggleSelectAll = () => {
    if (selected?.length !== tableData.length) {
      setSelected(tableData.map((row: any) => row.id));
      setSelectSingle && setSelectSingle([]);
    } else {
      setSelected([]);
      setSelectSingle && setSelectSingle([]);
    }
  };

  const toggleSelect = (id: number | string, rowIndex: number) => {
    if (!selected.includes(id)) {
      setSelected([...selected, id]);
      setSelectSingle && setSelectSingle([...selected, rowIndex]);
    } else {
      setSelected((prev: any) => prev.filter((item: any) => item !== id));
      setSelectSingle &&
        setSelectSingle((prev: any) =>
          prev.filter((item: any) => item !== rowIndex)
        );
    }
  };

  const toggleSelectBulkAll = () => {
    if (selectBulk?.length !== tableData?.length)
      setSelectBulk(tableData.map((row: any) => row));
    else setSelectBulk([]);
  };

  // const toggleSelectBulk = (id: number | string) => {
  //   if (!selected.includes(id)) setSelected([...selected, id]);
  //   else setSelected((prev: any) => prev.filter((item: any) => item !== id));
  // };

  const toggleSelectBulk = (bulk: any) => {
    if (selectBulk.some((item: any) => item.id === bulk.id)) {
      setSelectBulk((prev: any) =>
        prev.filter((obj: any) => obj.id !== bulk.id)
      );
    } else {
      setSelectBulk([...selectBulk, bulk]);
    }
  };

  if (isLoading) {
    return <LoadingTable />;
  }
  if (isError) {
    return <ErrorMsg error={error} />;
  }

  return (
    <Box
      className="table-box"
      sx={{
        width: "100%",
        overflow: scrollY && !scrollX ? "hidden" : "auto",
      }}
    >
      <TableContainer
        className={`scrollbar-style my-table ${extraTableClass}`}
        sx={{
          maxHeight: scrollY ? maxHeight : "unset",
          minWidth: tableData?.length > 0 && scrollX ? 1000 : "unset",
        }}
        ref={tableRef}
      >
        {tableHeader}
        <Table {...props} aria-labelledby="tableTitle">
          {showHead && (
            <TableHead
              className="rounded-xl"
              sx={{
                "& th:first-of-type": {
                  borderRadius: "4px 0 0 4px",
                },
                "& th:last-of-type": {
                  borderRadius: "0 4px 4px 0",
                  textAlign: "right",
                },
                "& th": {
                  border: "none",
                },
              }}
            >
              <TableRow hover={false}>
                {selectMultiple && selected && (
                  <TableCell
                    align={"center"}
                    className="td-checkbox"
                    padding={"checkbox"}
                  >
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected?.length > 0 &&
                        selected?.length < tableData?.length
                      }
                      checked={
                        tableData?.length > 0 &&
                        selected?.length === tableData?.length
                      }
                      onChange={() => {
                        toggleSelectAll();
                        selectBulk && toggleSelectBulkAll();
                      }}
                      inputProps={{
                        "aria-label": "select all rows",
                      }}
                    />
                  </TableCell>
                )}
                {headCellChild
                  ? headCellChild
                  : headCells.map((headCell, i) => (
                      <TableCell
                        className="truncate"
                        key={headCell.key}
                        align={"left"}
                        padding={"normal"}
                      >
                        {headCell.name}
                      </TableCell>
                    ))}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {tableData?.length <= 0 && (
              <TableRow hover={false}>
                <TableCell colSpan={headCells?.length + 1}>
                  <EmptyResponse
                    message={emptyMessage ? emptyMessage : "No record found"}
                    image={emptyImg}
                  />
                </TableCell>
              </TableRow>
            )}
            {tableData?.map((row: any, rowIndex: number) => {
              return (
                <TableRow
                  sx={{
                    "& td:last-child": {
                      textAlign: "right",
                    },
                  }}
                  tabIndex={-1}
                  className={`${
                    !selectMultiple && isInstagram
                      ? row?.id === selected?.id
                        ? "active-cell"
                        : ""
                      : ""
                  }  ${
                    tableType === "staff" && row.is_disabled ? "deactivate" : ""
                  } ${
                    tableType === "location" && row.reason_for_deletion !== null
                      ? "deactivate"
                      : ""
                  }`}
                  key={`table-row-${rowIndex}`}
                  onClick={(e: any) => {
                    if (handleClick) {
                      if (e.target.tagName === "INPUT") {
                      } else {
                        handleClick(row, rowIndex);
                      }
                    }
                  }}
                >
                  {selectMultiple && selected && (
                    <TableCell padding="normal" className="td-checkbox">
                      <Checkbox
                        checked={selected.indexOf(row.id) !== -1}
                        color="primary"
                        className="input_box"
                        value={selected.includes(rowIndex) ? true : false}
                        onChange={() => {
                          toggleSelect(row.id, rowIndex);
                          selectBulk && toggleSelectBulk(row);
                        }}
                        inputProps={{
                          "aria-labelledby": `enhanced-table-checkbox-${rowIndex}`,
                        }}
                      />
                    </TableCell>
                  )}

                  {headCells
                    .filter((col) => col.key !== "actions")
                    .map((col, colIndex) => (
                      <TableCell
                        className={`${colIndex === 0 ? "pd-checkbox" : ""} ${
                          col.key === "action" ? "td-checkbox" : ""
                        } truncate`}
                        sx={{ fontWeight: 600, color: "inherit" }}
                        align="left"
                        key={`-row_${rowIndex}-col_${colIndex}`}
                      >
                        {row[col.key]}
                      </TableCell>
                    ))}

                  {row?.actions && (
                    <TableCell
                      sx={{
                        "& .MuiButton-root": {
                          color: "inherit",
                        },
                      }}
                      className="td-checkbox"
                    >
                      <DropDownWrapper
                        className="more-actions"
                        extraClick={() => {
                          setTimeout(() => {
                            tableRef.current.scroll({
                              top: tableRef.current.scrollHeight + 500,
                              left: tableRef.current.scrollWidth + 500,
                              behavior: "smooth",
                            });
                          }, 300);
                        }}
                        action={
                          <IconButton
                            className="more-action-btn"
                            aria-label="actions"
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        }
                      >
                        {row?.actions}
                      </DropDownWrapper>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {showPagination && (
          <MyPagination
            dataCount={dataCount}
            setDataCount={setDataCount}
            data={tableData}
            page={page}
            setPage={setPage}
            totalPage={meta.totalPage}
          />
        )}
      </TableContainer>
    </Box>
  );
}
