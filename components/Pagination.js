import React,{useState, useEffect} from 'react';
// import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import Pagination from 'react-js-pagination';


export default() => {
    const [pageSize, setPageSize] = useState(50);
    const [pageCount, setPageCount] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [dataset, setDataset] = useState([1,2,2,3,4,5])

    useEffect(() => {
       setPageCount(Math.ceil(dataset.length / pageSize))
    }, [])

    const onClick = (event, index) => {
        event.preventDefault();
        setCurrentPage(index);
    }

    return (
        // <div className='float-right mr-2'>

            <Pagination 
                itemClass="page-item"
                linkClass="page-link"
                itemsCountPerPage={50}
                totalItemsCount={450}
                pageRangeDisplayed={2}
                prevPageText='Previous'
                nextPageText='Next'
                hideFirstLastPages={true}
             />
        // </div>
    )
}

