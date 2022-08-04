import React from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
} from "react-table";
import { Button, Input } from "reactstrap";
import { matchSorter } from "match-sorter";
import "../css/style.css";
import { ACTION, SUPPLIERGRID } from "../constant/FieldConstant";
import { SUPPLIERGRIDCHECKBOX } from "../constant/MessageConstant";
import "../css/EndOfPeriodTableView.css";
import { BsSortUpAlt, BsSortUp } from "react-icons/bs";
import "../css/EndOfPeriodTableView.css";

const defaultPropGetter = () => ({});
export default function EOPTable({
  columns,
  data,
  tableName,
  showSecondHead = true,
  customTableWidth = false,
  isFinalisedInvoice,
  getCellProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
}) {
  const [tabledata, setTableData] = React.useState(data);

  React.useEffect(() => {
    updateData(data);
  }, [data]);

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  }
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
      <Input
        className="m-0"
        maxLength={50}
        style={{
          height: "22px",
          borderRadius: 0,
          paddingLeft: "4px",
          fontSize: "14px",
          boxShadow: "none",
        }}
        value={filterValue || ""}
        onChange={(e) => {
          skipPageResetRef.current = false;
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search...`}
      />
    );
  };

  const defaultColumn = React.useMemo(
    () => ({
      Filter: ColumnFilter,
    }),
    []
  );

  const skipPageResetRef = React.useRef();

  const updateData = (newData) => {
    // When data gets updated with this function, set a flag
    // to disable all of the auto resetting
    skipPageResetRef.current = true;
    setTableData(newData);
  };
  React.useEffect(() => {
    // After the table has updated, always remove the flag
    skipPageResetRef.current = true;
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      sortTypes: {
        alphanumeric: (row1, row2, columnName) => {
          let rowOneColumn = row1.values[columnName];
          let rowTwoColumn = row2.values[columnName];

          if (columnName == "template_file") {
            rowOneColumn = row1.values["template_desc"];
            rowTwoColumn = row2.values["template_desc"];
          }
          if (
            rowOneColumn &&
            rowTwoColumn &&
            isNaN(rowOneColumn) &&
            isNaN(rowTwoColumn)
          ) {
            return String(rowOneColumn).toUpperCase() >=
              String(rowTwoColumn).toUpperCase()
              ? 1
              : -1;
          } else if (rowOneColumn && rowTwoColumn) {
            if (isNaN(rowOneColumn) && !isNaN(rowTwoColumn)) {
              return 1;
            }
            if (!isNaN(rowOneColumn) && isNaN(rowTwoColumn)) {
              return -1;
            }
          } else if (rowOneColumn == "" && rowTwoColumn != "") {
            return -1;
          } else if (rowOneColumn != "" && rowTwoColumn == "") {
            return 1;
          }
          return Number(rowOneColumn) > Number(rowTwoColumn) ? 1 : -1;
        },
        sortMethod: (a, b) => {
          a = new Date(a).getDate();
          b = new Date(b).getDate();
          return b > a ? 1 : -1;
        },
      },
      columns,
      data,
      defaultColumn,
      filterTypes,
      autoResetPage: !skipPageResetRef.current,
      autoResetExpanded: !skipPageResetRef.current,
      autoResetGroupBy: !skipPageResetRef.current,
      autoResetSelectedRows: !skipPageResetRef.current,
      autoResetSortBy: !skipPageResetRef.current,
      autoResetFilters: !skipPageResetRef.current,
      autoResetRowState: !skipPageResetRef.current,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  //const { globalFilter } = state;
  //const [pagination,setPagination]=useState(pageIndex)

  return (
    <>
      <div
        id="docx"
        className={
          customTableWidth ? "customTableWidth tablecontent" : "tablecontent"
        }
      >
        <div className="pagination mt-2">
          <div className="pagination-left">
            <div className="ps-2">
              Show
              <select
                className="pagination__buttons rounded"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  //  localStorage.setItem(tableName+'pageSize',Number(e.target.value));
                  window.sessionStorage.setItem(
                    tableName + "pageSize",
                    Number(e.target.value)
                  );
                }}
              >
                {[10, 20, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              entries
            </div>
          </div>
          <li className="page-item ">
            <Button
              className="page-link btn-sm"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Previous
            </Button>{" "}
          </li>
          <li className="page-item active">
            <a className="page-link" id="SrNo">
              {pageIndex + 1} <span className="sr-only"></span>
            </a>
          </li>
          <li className="page-item">
            <Button
              className="page-link btn-sm"
              onClick={() => {
                skipPageResetRef.current = true;
                nextPage();
              }}
              disabled={!canNextPage}
            >
              Next
            </Button>
          </li>
        </div>
        <div
          id="WordSection1"
          className="userAccountTbl WordSection1"
          style={{
            "overflow-y": "scroll",
            maxHeight: "480px",
            height: "auto",
            marginTop: "0px",
          }}
        >
          <table
            id="UserAccountsTable"
            className="rtable table  tableHover mb-0"
            {...getTableProps()}
          >
            <thead
              className="table-heading-eop"
              style={{
                position: "sticky",
                top: "1px",
                zIndex: "2",
              }}
            >
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="table-header-width"
                >
                  {headerGroup.headers.map((column) =>
                    column.width ? (
                      <th
                        id="firstHead"
                        className="text-start"
                        width={column.width}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                        <span style={{ marginLeft: "10px" }}>
                          {column.Header === SUPPLIERGRID ? (
                            <i
                              className="fa fa-info-circle fs-6"
                              style={{
                                color: "blue !important",
                                cursor: "pointer",
                              }}
                              aria-hidden="true"
                              data-toggle="tooltip"
                              data-placement="top"
                              title={SUPPLIERGRIDCHECKBOX}
                            ></i>
                          ) : (
                            ""
                          )}
                        </span>
                        <span style={{ float: "right" }}>
                          {column.disableSortBy ? (
                            ""
                          ) : (
                            <span style={{ float: "right" }}>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <BsSortUpAlt />
                                ) : (
                                  <BsSortUp />
                                )
                              ) : (
                                <BsSortUpAlt />
                              )}
                            </span>
                          )}

                          {/*column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ''} */}
                          {/* {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ImportExportIcon />
                          ) : (
                            <ImportExportIcon />
                          )
                        ) : (
                          ""
                        )} */}
                        </span>
                      </th>
                    ) : (
                      <th id="firstHead" className="text-start">
                        {column.render("Header")}

                        <span style={{ marginLeft: "10px" }}>
                          {column.Header === SUPPLIERGRID ? (
                            <i
                              className="fa fa-info-circle fs-6"
                              style={{
                                color: "blue !important",
                                cursor: "pointer",
                              }}
                              aria-hidden="true"
                              data-toggle="tooltip"
                              data-placement="top"
                              title={SUPPLIERGRIDCHECKBOX}
                            ></i>
                          ) : (
                            ""
                          )}
                        </span>

                        <span style={{ float: "right" }}>
                          {/*column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ''} */}
                          {/* {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ImportExportIcon />
                          ) : (
                            <ImportExportIcon />
                          )
                        ) : (
                          ""
                        )} */}
                        </span>
                      </th>
                    )
                  )}
                </tr>
              ))}
            </thead>

            {showSecondHead ? (
              <>
                <thead
                  className={`${
                    isFinalisedInvoice ? "EOPsecondhead" : "EOPsecondheadfinal"
                  }`}
                >
                  {headerGroups.map((headerGroup) => (
                    <tr className="tableRowHover tblRowPadding ">
                      {headerGroup.headers.map((column) => (
                        <th id="secondHead" {...column.getHeaderProps()}>
                          <div>
                            {column.canFilter ? column.render("Filter") : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
              </>
            ) : (
              <></>
            )}
            <tbody {...getTableBodyProps()} style={{ color: "black" }}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <>
                    <tr
                      style={{ textAlign: "left" }}
                      className=" tblRowPadding "
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td
                            key={cell.guidId}
                            className={
                              cell.column.id === ACTION
                                ? "tblRowPaddingWithPadding5"
                                : "tblRowPadding "
                            }
                            // style={{
                            //   backgroundColor:
                            //     cell.row.original.updateConfirmed &&
                            //     cell.row.original.isFinalised == false
                            //       ? "white"
                            //       : cell.row.original.isFinalised
                            //       ? "#c7dbc9"
                            //       : "#fec0cb",
                            // }}
                            id={cell.render("Header")}
                            //{...cell.getCellProps()}
                            {...cell.getCellProps([
                              {
                                className: cell.column.className,
                                style: cell.column.style,
                              },
                              getColumnProps(cell.column),
                              getCellProps(cell),
                            ])}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </>
                );
              })}
              {page.length < 1 && (
                <>
                  <tr>
                    <td
                      colSpan="12"
                      className="text-center noRecords"
                      style={{ border: "none !important" }}
                    >
                      No record found
                    </td>
                  </tr>
                </>
              )}
            </tbody>
            {/* <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <>
                    <tr
                      style={{ textAlign: "left" }}
                      className=" tblRowPadding "
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell, key) => {
                        console.log(
                          "cell in map",
                          cell.row.original.isFinalised
                        );
                        return (
                          <td
                            key={key}
                            className={
                              cell.column.id === ACTION
                                ? "tblRowPaddingWithPadding5"
                                : "tblRowPadding "
                            }
                            style={{
                              backgroundColor:
                                !cell.row.original.isFinalised &&
                                isFinalisedInvoice &&
                                "#fec0cb",
                            }}
                            id={cell.render("Header")}
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </>
                );
              })}
              {page.length < 1 && (
                <>
                  <tr>
                    <td colSpan="11" className="text-center">
                      No record found
                    </td>
                  </tr>
                </>
              )}
            </tbody> */}
          </table>
        </div>
        <br />

        <div className="pagination mt-2">
          <div className="pagination-left d-flex align-items-center">
            Showing{" "}
            {pageIndex * pageSize + page.length !== 0
              ? pageIndex * pageSize + 1
              : 0}{" "}
            to {pageIndex * pageSize + page.length} of {tabledata.length}{" "}
            entries
          </div>
          <li className="page-item ">
            <Button
              className="page-link"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Previous
            </Button>{" "}
          </li>
          <li className="page-item active">
            <a className="page-link" id="SrNo">
              {pageIndex + 1} <span className="sr-only"></span>
            </a>
          </li>
          <li className="page-item">
            <Button
              className="page-link"
              onClick={() => {
                skipPageResetRef.current = true;
                nextPage();
              }}
              disabled={!canNextPage}
            >
              Next
            </Button>{" "}
          </li>
        </div>
      </div>
    </>
  );
}
