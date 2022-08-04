import React from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
} from "react-table";
import { Input } from "reactstrap";
import { matchSorter } from "match-sorter";
import "../css/style.css";
import { ACTION, SUPPLIERGRID } from "../constant/FieldConstant";
import { SUPPLIERGRIDCHECKBOX } from "../constant/MessageConstant";

export default function ReactAdditionalPopup({
  columns,
  data,
  showSecondHead = true,
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
    skipPageResetRef.current = true;
    setTableData(newData);
  };
  React.useEffect(() => {
    skipPageResetRef.current = true;
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
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

  return (
    <>
      <div id="docx" className="tablecontent">
        <div
          id="WordSection1"
          className="userAccountTbl WordSection1"
          style={{ "overflow-y": "scroll", height: "300px" }}
        >
          <table
            id="UserAccountsTable"
            className="rtable table table-striped tableHover"
            {...getTableProps()}
          >
            <thead
              className="table-heading"
              style={{ position: "sticky", top: "0px", zIndex: "2000" }}
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
                        <span style={{ float: "right" }}></span>
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
                        <span style={{ float: "right" }}></span>
                      </th>
                    )
                  )}
                </tr>
              ))}
            </thead>

            {/* {showSecondHead ? (
              <>
                <thead style={{ position: 'sticky',top:'40px'}}>
                  {headerGroups.map((headerGroup) => (
                    <tr className="tableRowHover tblRowPadding ">
                      {headerGroup.headers.map((column) => (
                        <th id="secondHead" {...column.getHeaderProps()}>
                          <div>
                            {column.canFilter ? column.render('Filter') : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
              </>
            ) : (
              <></>
            )} */}
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
                            cell.column.id === "Selected"
                              ? { textAlign: "center" }
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
              {page.length < 1 && (
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
      </div>
    </>
  );
}
