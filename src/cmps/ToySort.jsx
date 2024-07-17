import { useEffect, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select, Checkbox, FormControlLabel } from '@mui/material'

export function ToySort({ sortBy, onSetSort }) {
  const [sortByToEdit, setSortByToEdit] = useState({ ...sortBy })

  useEffect(() => {
    onSetSort(sortByToEdit)
  }, [sortByToEdit])

  function handleChange({ target }) {
    const field = target.name
    const value = target.type === 'number' ? +target.value : target.value
    setSortByToEdit(prevSort => ({
      ...prevSort,
      [field]: field === 'desc' ? -prevSort.desc : value,
    }))
  }

  function handleCheckboxChange(event) {
    const { checked } = event.target
    setSortByToEdit(prevSort => ({
      ...prevSort,
      desc: checked ? -1 : 1,
    }))
  }

  return (
    <form className="toy-sort">
      <FormControl fullWidth margin="normal">
        <InputLabel>Sort by</InputLabel>
        <Select
          name="type"
          value={sortByToEdit.type}
          onChange={handleChange}
          label="Sort by"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="createdAt">Date</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            name="desc"
            checked={sortByToEdit.desc < 0}
            onChange={handleCheckboxChange}
          />
        }
        label="Descending"
      />
    </form>
  )
}