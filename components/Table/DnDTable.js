import React, { useEffect } from "react";
import styled from "styled-components";
import { useTable, usePagination, useFilters } from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {matchSorter} from 'match-sorter';
import "../../css/style.css";
import { Button, Input } from "reactstrap";
 
import Loader from "../Loader";
import { ACTION } from "../../constant/FieldConstant";


export default function DnDTable({
  columns, data ,parentKey,callBackOrderUpdateData }) { 
  const [loading, setLoading] = React.useState(false);
  const skipPageResetRef = React.useRef()
  const [tabledata, setTableData] = React.useState(data);
  useEffect(() => { 
      //setTableData(data);
      updateData(data); 
    }, [data]);

    const updateData = newData => {  
      // When data gets updated with this function, set a flag
      // to disable all of the auto resetting
      skipPageResetRef.current = true  
      setTableData(newData)
    }
    React.useEffect(() => { 
      // After the table has updated, always remove the flag
      skipPageResetRef.current = true
    },[])

    
  const reorderData = (startIndex, endIndex) => {
    
      const newData = [...tabledata];
      const [movedRow] = newData.splice(startIndex, 1);
      newData.splice(endIndex, 0, movedRow);
      updateData(newData);
      let sourceIndex= startIndex<endIndex?startIndex:endIndex;
      let destinationIndex=startIndex<endIndex?endIndex:startIndex;
      const provisionOrderLists=[];
      newData.map((item,index) => {
        if(index >=sourceIndex && index <=destinationIndex)
        {
          provisionOrderLists.push({id:item.id,provisionOrderId:index+1});
        }});
        skipPageResetRef.current = true;  
      
      // setLoading(true);
      // if(parentKey===GLOBALPROVISIONS)
      // {
      //   globalProvision
      //   .updateGlobalProvisionDragAndDrop(provisionOrderLists)
      //   .then((response) => { 
      //     setLoading(false);
      //   })
      //   .catch(() => { setLoading(false); });
      // } 
      // else
      // {
      //   setLoading(false);
      // }
    };

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
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
   
 
const Tr = styled.tr`
background-color: white;
display: ${({ isDragging }) => (isDragging ? "table" : "")};
`;

  const ColumnFilter=({column}) =>{
    const { filterValue, preFilteredRows, setFilter} = column; 
    return (
            <Input
                className='m-0'
                maxLength={50}
                style={{height:"22px", borderRadius:0, paddingLeft: "4px", fontSize: "14px", boxShadow:"none"}}
                value={filterValue || ''}
                onChange={e => {
                  skipPageResetRef.current=false;  
                  setFilter(e.target.value || undefined)  
                }}
                placeholder={`Search...`}
            />
        
      )
  }

  const defaultColumn = React.useMemo(
    () => ({
      Filter: ColumnFilter,
    }),
    []
  ); 
  


  const table = useTable(
    {
      columns,
      data:tabledata,
      reorderData,
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
    usePagination
  );
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
    state: { pageIndex, pageSize }
  } = table;

  const handleDragEnd = (result) => {  
    const { source, destination } = result;
    if (!destination) return;
    let destinationIndex = destination.index;
    if (pageIndex + 1 !== 1) {
      let pageStartIndex = pageSize * pageIndex; 
      if(destinationIndex<pageStartIndex)
      destinationIndex = destinationIndex + pageStartIndex;
    } 
    reorderData(source.index, destinationIndex);
  };

   
  return (
    <>
     
    <div id="docx" className="tablecontent">
    {loading ? (
        <Loader></Loader>
      ):<div></div>} 
    <div className="pagination mt-2">
          <div className="pagination-left">
          <div className="ps-2">
          Show
          <select className="pagination__buttons rounded"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
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
              onClick={() => {skipPageResetRef.current = true;nextPage();   }}
              disabled={!canNextPage}
            >
              Next
            </Button>{" "}
          </li>
        </div>
        <div id="tableDnd" className="userAccountTbl WordSection1">
        <table  id="UserAccountsTable"
            className="rtable table table-striped tableHover" {...getTableProps()}>
        <thead className="table-heading">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="table-header-width">
              {headerGroup.headers.map((column) =>
                column.width ? (
                  <th
                    {...column.getHeaderProps()}
                    width={column.width}
                    className="text-start"
                  >
                    {column.render("Header")}
                  </th>
                ) : (
                  <th {...column.getHeaderProps()} className="text-start">
                    {column.render("Header")} 
                  </th>
                )
              )}
            </tr>
          ))} 
        {headerGroups.map((headerGroup) => (  
               headerGroup.headers.filter(m=>m.Filter==false).length===headerGroup.headers.length?(<div></div>):
             <tr className="tableRowHover tblRowPadding" >
             {headerGroup.headers.map((column) => (
               <th {...column.getHeaderProps()} className="tablesecondHead" >
                 <div>
                   {column.canFilter ? column.render("Filter") : null}
                 </div>
               </th>
             ))}
           </tr> 
              ))}
        </thead>
         <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="table-body">
            {(provided) => (
              <tbody
                {...getTableBodyProps()}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {page.map((row) => { 
                  prepareRow(row);
                  return (
                    <Draggable
                      draggableId={row.original.id.toString()}
                      key={row.original.id}
                      index={row.index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <Tr
                            {...row.getRowProps()}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            isDragging={snapshot.isDragging}
                          > 
                            {row.cells.map((cell) => ( 
                              
                              <td {...cell.getCellProps()}
                              className={(cell.column.id===ACTION||cell.column.id==="id")?"tblRowPaddingWithPadding5":"tblRowPadding"}
                              style={(cell.column.id===ACTION)?{paddingLeft:5 , paddingRight:5 }:{}}>
                                {  (cell.render("Cell", {
                                  dragHandleProps: provided.dragHandleProps,
                                  isSomethingDragging: snapshot.isDraggingOver
                                }))}
                                 {(cell.column.id=="id")?(
                                <span style={{paddingLeft:25}}>{row.index+1}</span>)
                                :
                                (<span> </span>)
                                }
                              </td>
                            ))}
                          </Tr>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                 
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
        </table>
        </div>
    </div>
    <div className="pagination mt-2">
          <div className="pagination-left">
            Showing{" "}
            {pageIndex * pageSize + page.length !== 0 ? pageIndex * pageSize + 1 : 0} to{" "}
            {pageIndex * pageSize + page.length} of {tabledata.length} entries
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
              onClick={() => {skipPageResetRef.current = true;nextPage();   }}
              disabled={!canNextPage}
            >
              Next
            </Button>{" "}
          </li>
        </div>

       
    </>
  );
} 

   

      // return (  
      //     <Table columns={columns} data={tabledata} reorderData={reorderData} /> 
      // );
  //  }