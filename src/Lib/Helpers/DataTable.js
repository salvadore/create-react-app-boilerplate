import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import QueryString from 'query-string'
import { queryParamsList } from './Routes'
import DeleteRow from '../../Components/DataTable/DeleteRow'

export const HEIGHT = '790px'

export function initColumns(props, refreshDataHandler) {
  const { path, columns, showEditRow, showDeleteRow } = props

  let { editRowUrl } = props
  let clonedColumns = _.clone(columns)

  if (!editRowUrl) editRowUrl = path

  if (showEditRow || showDeleteRow) {
    clonedColumns.push({
      Header: 'Action',
      accessor: props.actionAccessorId,
      Cell: ({ value }) => (
        <div className="datatable-actions">
          {editRowUrl && <Link to={[editRowUrl, value].join('/')}>Edit</Link>}
          {showDeleteRow && <DeleteRow {...props} refreshDataHandler={refreshDataHandler} id={value} />}
        </div>
      ),
      resizable: false,
      width: 100
    })
  }

  return clonedColumns
}

export function hasQuerySearch() {
  return Object.keys(parseQuerySearch()).length > 0
}

export function parseQueryObjects() {
  const querySearch = parseQuerySearch()
  const dateFrom = querySearch.dateFrom
  const dateTo = querySearch.dateTo
  const filtered = querySearch.filtered ? queryParamsList(querySearch.filtered) : {}

  return { dateFrom, dateTo, filtered }
}

export function setHeight(pageSize) {
  return pageSize > 20 ? HEIGHT : null
}

export function parseSorted(columns) {
  let sorted = {}

  columns.map(column => { return sorted[column.id] = column.desc ? 'desc' : 'asc' })

  return sorted
}

export function shouldPushHistory(axiosData, queryObjects) {
  if (!axiosData.filtered && JSON.stringify(queryObjects.filtered) === '{}')
    return false

  return JSON.stringify(axiosData.filtered) !== JSON.stringify(queryObjects.filtered)
}

function parseQuerySearch() {
  return _.pick(QueryString.parse(window.location.search), 'dateFrom', 'dateTo', 'filtered')
}
