import React from "react";
import { Button } from "reactstrap";
import { useTable, usePagination, useSortBy, useFilters } from "react-table";

import { matchSorter } from "match-sorter";

import "../css/style.css";

import { BsSortUpAlt, BsSortUp } from "react-icons/bs";

export default ({ columns, data, tableName }) => {
  var centerColumn = columns.length / 2;
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

  const TextColumnFilter = () => ({
    column: { filterValue, preFilteredRows, setFilter },
  }) => {
    const count = preFilteredRows.length;

    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  };

  const defaultColumn = React.useMemo(
    () => ({
      Filter: TextColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    prepareRow,
  } = useTable(
    {
      sortTypes: {
        alphanumeric: (row1, row2, columnName) => {
          const format1 = "DD-MMM-YYYY hh:mm A";
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
      initialState: {
        pageIndex: 0,
        pageSize: window.sessionStorage.getItem(tableName + "pageSize")
          ? window.sessionStorage.getItem(tableName + "pageSize")
          : 10,
        // initialState: { pageIndex: 0, pageSize:localStorage.getItem(tableName+'pageSize')?localStorage.getItem(tableName+'pageSize'): 5,
        // sortBy: [
        //       {
        //         id : 'username'
        //       }
        // ]
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );
  return (
    <div id="docx" className="">
      <div id="WordSection1" className="userAccountTbl WordSection1">
        <table
          id="UserAccountsTable"
          className="table table-striped tableHover  fs-6"
          {...getTableProps()}
        >
          <thead className="table-heading">
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="table-header-width"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(
                      column.getSortByToggleProps({
                        title: "Sort by " + column.render("Header"),
                      })
                    )}
                    style={{ textAlign: "left", fontSize: 15 }}
                    id={column
                      .render("Header")
                      .replace(" ", "_")
                      .replace(" ", "_")
                      .replace(" ", "_")}
                  >
                    {column.render("Header")}

                    <span style={{ float: "right" }}>
                      {/*column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ''} */}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <BsSortUpAlt />
                        ) : (
                          <BsSortUp />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {(tableName === "UserAccount" ||
            tableName === "Roles" ||
            tableName == "Tenants" ||
            tableName == "Configuration") &&
            headerGroups.map((headerGroup) => (
              <tr
                style={{
                  backgroundColor: "#e6eeff",
                  textAlign: "left",
                  margin: 0,
                  padding: 0,
                }}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <th style={{ padding: 2 }} {...column.getHeaderProps()}>
                    <div style={{}}>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}

          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  style={{ textAlign: "left" }}
                  className="tableRowHover tblRowPadding"
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell, key) => {
                    return (
                      <td
                        key={key}
                        className="tblRowPadding"
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
            {page.length < 1 && (
              <>
                {/* <td style={{height:50}}></td> */}
                <tr>
                  <td colSpan="9" className="text-center">
                    No record found
                  </td>
                </tr>
              </>
            )}

            {/* Last row same as header for reference on scroll */}
            <>
              {headerGroups.map((headerGroup) => (
                <tr
                  style={{ backgroundColor: "#e6eeff", textAlign: "center" }}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column) => (
                    <td
                      style={{ width: 5, color: "#3973ac", textAlign: "left" }}
                      {...column.getHeaderProps()}
                      id={column.render("Header").replace(" ", "_")}
                    >
                      {column.render("Header")}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          </tbody>
        </table>
      </div>

      <div className="text-center">
        {/* <FadeLoader className='text-center justify-content-center' loading={loader? loader:false} color={'#4080bf'}/> */}
        {/* <Loader/> */}
      </div>

      {data && data.length > 5 && (
        <div
          className="pagination justify-content-center p-1 pagination-table mb-5 "
          style={{ minWidth: "600px" }}
        >
          <Button
            className="Button__blueColor pagination__buttons"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </Button>{" "}
          <Button
            className="Button__blueColor ml-1 pagination__buttons"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"Previous"}
          </Button>{" "}
          <span className="m-1 mt-2">
            Page{" "}
            <strong>
              {pageIndex + 1} of{" "}
              {pageOptions.length > 0 ? pageOptions.length : 1}
            </strong>{" "}
          </span>
          <span className="mr-1">
            | Go to page:{" "}
            <input
              className="pagination__buttons"
              type="number"
              max={pageCount}
              min={1}
              maxLength={pageCount}
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                let page = e.target.value ? Number(e.target.value) - 1 : 0;
                page = e.target.value > pageCount ? pageCount - 1 : page;
                gotoPage(page);
                const val = page <= pageCount ? page : pageCount;
              }}
              style={{ width: "60px" }}
            />
          </span>{" "}
          <select
            className="pagination__buttons"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              // localStorage.setItem(tableName+'pageSize',Number(e.target.value));
              window.sessionStorage.setItem(
                tableName + "pageSize",
                Number(e.target.value)
              );
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <Button
            className=" Button__blueColor mr-1 ml-1 pagination__buttons"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {"Next"}
          </Button>{" "}
          <Button
            className="Button__blueColor pagination__buttons"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </Button>{" "}
        </div>
      )}
    </div>
  );
};
