import React from 'react';
import { Input } from 'reactstrap';

export default ({column}) => {
    const {filterValue, setFilter, preFilteredRows} = column;
    const count = preFilteredRows.length
    return (
            <Input
                className='m-0'
                // maxLength={20}
                style={{height:"22px", borderRadius:0, paddingLeft: "4px", fontSize: "14px", boxShadow:"none"}}
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined) 
                }}
             placeholder={`Searchnnn...`}
            />
        
      )
}