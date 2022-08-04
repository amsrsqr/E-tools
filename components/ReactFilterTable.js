import React, { useEffect, useMemo, useState } from "react";
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
import { BsSortUpAlt, BsSortUp } from "react-icons/bs";
export default function ReactFilterTable({
  columns,
  data,
  tableName,
  handlePageChange,
  pageNumber,
  pageLimit,
  totalEntries,
  searchFieldsCallback,
  totalPages,
  setPageLimit,
  pageSizeChangeCallBack,
}) {
  const [tabledata, setTableData] = useState(data);

  useEffect(() => {
    //setTableData(data);
    updateData(data);
  }, [data, pageLimit]);

  function fuzzyTextFilterFn(rows, id, filterValue) {
    console.log("rows", rows);
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  }
  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          console.log("filterValue", filterValue);
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
          setFilter(
            // e.target.value || ""
            (e.target.value || "").replace(/\s+/gi, " ").trimLeft() || undefined
          );
        }}
        placeholder={`Search...`}
      />
    );
  };

  const defaultColumn = useMemo(
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
  // console.log("column", columns);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
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
      data: tabledata,
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
  useEffect(() => {
    if (state.filters && state.filters.length > 0) {
      const data = Object.assign(
        {},
        ...state.filters.map((obj) => ({
          [obj.id]: obj.value,
        }))
      );

      // console.log("data", data);
      if (Object.values(data)[0].length > 2) {
        searchFieldsCallback({
          pageNumber: 1,
          pageLimit: pageLimit,
          First_Name: data["First Name"],
          Last_Name: data["Last Name"],
          DOB: data["D.O.B"],
          recordId: data["Resident ID"],
          Admission_Date: data["Admission Date"],
          typeSearch: data["Type"],
          paymentDecisionSearch: data["Payment Decision"],
          Lumpsum_Equivalent: data["Lump Sum Equivalent"],
          Facility_Name: data["Facility Name"],
        });
      }
    } else {
      // console.log("backplace ");
      searchFieldsCallback({}, "noSearch");
    }
  }, [state.filters]);

  return (
    <>
      <div id="docx" className="tablecontent">
        <div className="pagination mt-2">
          <div className="pagination-left">
            <div className="ps-2">
              Show
              <select
                className="pagination__buttons rounded"
                value={pageLimit}
                onChange={(e) => {
                  skipPageResetRef.current = false;
                  setPageSize(Number(e.target.value));
                  //  localStorage.setItem(tableName+'pageSize',Number(e.target.value));
                  window.sessionStorage.setItem(
                    tableName + "pageSize",
                    Number(e.target.value)
                  );
                  pageSizeChangeCallBack(Number(e.target.value), true);
                  setPageLimit(Number(e.target.value));
                }}
              >
                {[10, 20, 50, 100].map((pageLimit) => (
                  <option
                    key={pageLimit}
                    value={pageLimit}
                    onClick={(e) => {
                      skipPageResetRef.current = false;
                      setPageSize(Number(e.target.value));
                      //  localStorage.setItem(tableName+'pageSize',Number(e.target.value));
                      window.sessionStorage.setItem(
                        tableName + "pageSize",
                        Number(e.target.value)
                      );
                      pageSizeChangeCallBack(Number(e.target.value), true);
                      setPageLimit(Number(e.target.value));
                    }}
                  >
                    {pageLimit}
                  </option>
                ))}
              </select>
              entries
            </div>
          </div>
          <li className="page-item ">
            <Button
              className="page-link btn-sm"
              onClick={
                // () => previousPage()
                () => handlePageChange(false)
              }
              // disabled={!canPreviousPage}
              disabled={pageNumber === 1}
            >
              Previous
            </Button>{" "}
          </li>
          <li className="page-item active">
            <a className="page-link" id="SrNo">
              {/* {pageIndex + 1}  */}
              {pageNumber}
              <span className="sr-only"></span>
            </a>
          </li>
          <li className="page-item">
            <Button
              className="page-link btn-sm"
              onClick={
                // () => {skipPageResetRef.current = true;nextPage();   }
                () => handlePageChange(true)
              }
              // disabled={!canNextPage}
              disabled={totalPages === 0 || totalPages === pageNumber}
            >
              Next
            </Button>{" "}
          </li>
        </div>
        <div id="WordSection1" className="userAccountTbl WordSection1">
          <table
            id="UserAccountsTable"
            className="rtable table table-striped tableHover"
            {...getTableProps()}
          >
            <thead className="table-heading">
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
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <BsSortUpAlt />
                            ) : (
                              <BsSortUpAlt />
                            )
                          ) : (
                            ""
                          )}
                        </span>
                      </th>
                    )
                  )}
                </tr>
              ))}
            </thead>

            <thead>
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
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    style={{ textAlign: "left" }}
                    className=" tblRowPadding"
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell, key) => {
                      return (
                        <td
                          key={key}
                          className={
                            cell.column.id === ACTION
                              ? "tblRowPaddingWithPadding5"
                              : "tblRowPadding"
                          }
                          style={
                            cell.column.id === ACTION
                              ? { paddingLeft: 5, paddingRight: 5 }
                              : {}
                          }
                          id={cell.render("Header")}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {rows.length < 1 && (
                <>
                  <tr>
                    <td colSpan="11" className="text-center">
                      No record found
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        <br />
        <div className="pagination mt-2">
          <div className="pagination-left d-flex align-items-center">
            Showing {totalEntries > 0 ? (pageNumber - 1) * pageLimit + 1 : 0} to{" "}
            {rows.length + (pageNumber - 1) * pageLimit} of {totalEntries}{" "}
            entries
          </div>

          <li className="page-item ">
            <Button
              className="page-link"
              onClick={
                // () => previousPage()
                () => handlePageChange(false)
              }
              // disabled={!canPreviousPage}
              disabled={pageNumber === 1}
            >
              Previous
            </Button>{" "}
          </li>
          <li className="page-item active">
            <a className="page-link" id="SrNo">
              {/* {pageIndex + 1}  */}
              {pageNumber}
              <span className="sr-only"></span>
            </a>
          </li>
          <li className="page-item">
            <Button
              className="page-link"
              onClick={
                // () => {skipPageResetRef.current = true;nextPage()}
                () => handlePageChange(true)
              }
              // disabled={!canNextPage}
              disabled={totalPages === 0 || totalPages === pageNumber}
            >
              Next
            </Button>{" "}
          </li>
        </div>
      </div>
    </>
  );
}
