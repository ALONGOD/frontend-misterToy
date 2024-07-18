import { isEqual } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { toyService } from '../services/toy.service'
import { utilService } from '../services/util.service'
import { ToySort } from './ToySort'
import { TextField, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material'

const toyLabels = toyService.getToyLabels()

export function ToyFilter({ filterBy, onSetFilter, sortBy, onSetSort }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

  const debouncedOnSetFilter = useRef(utilService.debounce(onSetFilter, 300))

  useEffect(() => {
    debouncedOnSetFilter.current(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    let { value, name: field, type } = target
    if (type === 'select-multiple') {
      value = Array.from(target.selectedOptions, option => option.value || [])
    }

    value = (type === 'number') ? +value || '' : value
    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  function handleLabelChange(event) {
    const { target: { value } } = event
    setFilterByToEdit(prevFilter => ({
      ...prevFilter,
      labels: typeof value === 'string' ? value.split(',') : value
    }))
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }

  const { txt, inStock, labels } = filterByToEdit

  return (
    <section className="toy-filter">
      <form onSubmit={onSubmitFilter}>
        <div className="filter-input-wrapper">
          <TextField
            label="Search"
            variant="outlined"
            name="txt"
            value={txt}
            onChange={handleChange}
            fullWidth
          />
        </div>

        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Stock Status</InputLabel>
          <Select
            name="inStock"
            value={inStock || ''}
            onChange={handleChange}
            label="Stock Status"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="true">In Stock</MenuItem>
            <MenuItem value="false">Not in stock</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Labels</InputLabel>
          <Select
            name="labels"
            multiple
            value={labels || []}
            onChange={handleLabelChange}
            renderValue={(selected) => selected.join(', ')}
            label="Labels"
          >
            {toyLabels.map(label => (
              <MenuItem key={label} value={label}>
                <Checkbox checked={labels.indexOf(label) > -1} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
      <ToySort sortBy={sortBy} onSetSort={onSetSort} />
    </section>
  )
}
