import React, { useContext, useState } from "react";
import { LanguageContext } from "@contexts/translator"
import { LocationsContext } from "@contexts/locations"

import styles from './style.module.css'

// Duplicating this list all over the place right now - need to put in central location (also not sure about count yet)
const statuses = [
  {
    id: 0,
    name: "receiving",
    label: "filter_by_receiving",
    accessibleColor: "#2c7bb6",
    count: 0,
  },
  {
    id: 1 ,
    name: "distributing",
    label: "filter_by_distributing",
    accessibleColor: "#abd9e9",
    count: 0,
  },
  {
    id: 2,
    name: "both",
    label: "filter_by_both",
    accessibleColor: "#fdae61",
    count: 0,
  },
  {
    id: 3,
    name: "closed",
    label: "filter_by_closed",
    accessibleColor: "#d7191c",
    count: 0,
  }
]

// TODO: Sort not working correctly yet - also will likely become its own component
const Filter = ({handleFilters}) => {
  const { getTranslation } = useContext(LanguageContext)
  const { sortOption, updateSortOption } = useContext(LocationsContext)
  // const [ sortOption, setSortOption ] = useState('')
  // const [ sortOptions, setSortOptions ] = useState(['Alphabetical (name)', 'Alphabetical (neighborhood)', 'Locations status', 'Needs money', 'Needs volunteers', 'No ID needed', 'Urgent requests', 'Warming site'])
  const [ sortOptions, setSortOptions ] = useState([{name: "name", label: "sort_by_name"}, { name: "neighborhood", label: 'sort_by_neighborhood'}, { name: "status", label: 'sort_by_status'}, { name: "money", label: 'sort_by_seeking_money'}, { name: "volunteers", label: 'sort_by_seeking_volunteers_badge'}, { name: "noIdNeeded", label: 'no_id_needed'}, { name: "urgent" , label: 'sort_by_urgent_need'}, { name: "warm", label: 'sort_by_warming_site'}])

  const [ checkedStatuses, setCheckedStatuses ] = useState(statuses)

  const handleToggle = (status) => {
    const currentIndex = checkedStatuses.indexOf(status)
    const newChecked = [...checkedStatuses]

    if(currentIndex !== -1) {
      newChecked.splice(currentIndex, 1)
    } else {
      newChecked.push(status)
    }

    setCheckedStatuses(newChecked)
    handleFilters(newChecked)
  }

  const renderCheckboxList = () => statuses.map((status) => (
    <div key={status.id}>
        <div>
          <div >
          <input
            type="checkbox"
            id={status.id}
            onChange={() => handleToggle(status)}
            checked={checkedStatuses.indexOf(status) === -1 ? false : true}
          />
          {/* TODO: Still need to get the color in here */}
          <label htmlFor={status.id}>
            {getTranslation(status.label)}
          </label>
        </div>
      </div>
    </div>
  ))

    return (
      <div>
        <form noValidate>
          <div>
            {renderCheckboxList()}
            <div>
              <label htmlFor="sortorder">
                {getTranslation("sort_by")}:
              </label>
                <select
                  id="sortorder"
                  value={sortOption}
                  onChange={event => updateSortOption(event.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.name} value={option.name}>
                    {getTranslation(option.label)}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </form>
      </div>
    )
}

export default Filter