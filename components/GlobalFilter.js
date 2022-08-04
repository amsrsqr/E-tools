import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'
import { Input, Label } from 'reactstrap'

export default function GlobalFilter({ filter, setFilter }) {
  const [value, setValue] = useState(filter)
  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined)
  }, 1000)
    return (
      <>
        <Label> Search </Label>
        <Input value={value || ''} onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }} />
      </>
    );
  }