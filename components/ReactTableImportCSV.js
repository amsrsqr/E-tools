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
import { BsSortUpAlt, BsSortUp } from "react-icons/bs";
const defaultPropGetter = () => ({});
export default function ReactTableImportCSV({
  columns,
  data,
  tableName,
  showSecondHead = true,
  customTableWidth = false,
  isFinalized,
  getTrProps,
  updateMyData,
  skipPageReset,
  callBackCellStyle,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) {
  const [tabledata, setTableData] = React.useState(data);
  const [selectedId, setSelectedId] = React.useState(-1);
  const [column, setColumn] = React.useState(-1);
  React.useEffect(() => {
    //setTableData(data);
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

  const getCellValue = (e, j) => {
    //alert("On click of cell");
    console.log(e);
    // setCellValue((cellvalue) =>
    //   cellvalue === "blue" ? (cellvalue = "red") : (cellvalue = "blue")
    // );
    // setSelectedId(e.row.id);
    // setColumn(j);
    callBackCellStyle(e.row.id, j);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
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
      //autoResetPage: !skipPageReset,
      autoResetPage: !skipPageResetRef.current,
      autoResetExpanded: !skipPageResetRef.current,
      autoResetGroupBy: !skipPageResetRef.current,
      autoResetSelectedRows: !skipPageResetRef.current,
      autoResetSortBy: !skipPageResetRef.current,
      autoResetFilters: !skipPageResetRef.current,
      autoResetRowState: !skipPageResetRef.current,
      initialState: { pageIndex: 0 },
      updateMyData,
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
        <div
          id="WordSection1"
          className="userAccountTbl WordSection1"
          style={{ width: "7270px" }}
        >
          <table
            id="UserAccountsTable"
            className="rtable table tableHover"
            {...getTableProps()}
          >
            <thead
              className="table-heading"
              style={{ position: "sticky", top: "-1px", height: "20px" }}
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
                        className=" tblRowPadding"
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
                              <BsSortUpAlt />
                            )}
                          </span>
                        )}
                      </th>
                    ) : (
                      <th id="firstHead">
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
              </>
            ) : (
              <></>
            )}
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    style={{ textAlign: "left", height: "60px" }}
                    className=" tblRowPadding "
                    {...row.getRowProps(getRowProps(row))}
                    //{...row.getRowProps()}
                  >
                    {row.cells.map((cell, key) => {
                      return (
                        <td
                          key={key}
                          className={
                            cell.column.id === ACTION
                              ? "tblRowPaddingWithPadding5"
                              : "tblRowPadding "
                          }
                          onClick={() => getCellValue(cell, cell.column.id)}
                          //     style={{
                          //   padding: "10px",
                          //   border: "solid 1px gray",
                          //   background: selectedId === row.id && column === j ? 'red' : 'blue'
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
                          // style={
                          //   cell.column.id === ACTION
                          //     ? {
                          //         paddingLeft: 5,
                          //         paddingRight: 5,
                          //         border:
                          //           selectedId === row.id && column === key
                          //             ? "3px solid blue"
                          //             : "",
                          //       }
                          //     : {
                          //         border:
                          //           selectedId === row.id && column === key
                          //             ? "3px solid blue"
                          //             : "",
                          //       }
                          //   // isFinalized
                          //   //     ? { backgroundColor: "green" }
                          //   //     : { backgroundColor: "pink" }
                          // }
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
