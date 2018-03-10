import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import axios from 'axios'
import Axios from '../../Lib/Common/Axios'
import { queryParams } from '../../Lib/Helpers/Routes'
import * as DataTableHelper from '../../Lib/Helpers/DataTable'
import { isAuthorised } from '../../Lib/Helpers/Session'
import Alert from '../../Components/Alert'
import ColumnFilters from './ColumnFilters'

import 'react-table/react-table.css'

const SHOW_FILTERS_STATE = { showFilters: true }
const HIDE_FILTERS_STATE = { showFilters: false }

class DataTable extends Component {
  constructor(props) {
    super(props)

    const columns = DataTableHelper.initColumns(props, this.refreshData.bind(this))

    this.state = {
      columns,
      data: [],
      dateFrom: null,
      dateTo: null,
      filtered: {},
      resetFiltersBtnDisabled: true,
      page: 0,
      pages: 1,
      pageSize: 20,
      sorted: {},
      height: DataTableHelper.HEIGHT,
      loading: true,
      refreshData: false,
      axiosData: {},
      axiosCancelToken: null,
      error: false,
      ...HIDE_FILTERS_STATE
    }
    this.handleFetchDataTO = 0
  }

  refreshData() {
    this.handleFetchData({ refreshData: true })
  }

  initData() {
    const { dateFrom, dateTo, filtered } = DataTableHelper.parseQueryObjects()
    const resetFiltersBtnDisabled = !(!!dateFrom || !!dateTo || Object.keys(filtered).length > 0)

    this.handleFetchData({ filtered, dateFrom, dateTo, resetFiltersBtnDisabled }, false)
  }

  retrieveFilters() {
    if (DataTableHelper.hasQuerySearch()) {
      this.setState(SHOW_FILTERS_STATE)
      return this.props.saveQueryState({ queryString: queryParams(DataTableHelper.parseQueryObjects()) })
    }

    this.props.history.push([this.props.path, this.props.dataTableState.queryString].join('?'))
  }

  saveFilters() {
    const queryString = queryParams(DataTableHelper.parseQueryObjects())

    if (queryString !== this.props.dataTableState.queryString) this.props.saveQueryState({ queryString })
  }

  setStateHandler(state, reset=false) {
    this.handleFetchData(state)
  }

  cancelPostRequest() {
    if (typeof(this.state.axiosCancelToken) === 'function') this.state.axiosCancelToken()
  }

  handleFetchData(state, historyPush=true) {
    this.setState({ ...state, loading: true })

    clearTimeout(this.handleFetchDataTO)

    this.handleFetchDataTO = setTimeout(() => {
      const pagination = {
        page: this.state.page + 1,
        limit: this.state.pageSize,
        sorted: this.state.sorted
      }
      const queryObjects = { filtered: this.state.filtered }
      const axiosData = { ...pagination, ...queryObjects }

      if (this.props.dataTableState.queryString) this.setState(SHOW_FILTERS_STATE)

      if (DataTableHelper.shouldPushHistory(this.state.axiosData, queryObjects) && historyPush) {
        this.props.saveQueryState({ queryString: queryParams(queryObjects) })

        return this.props.history.push([this.props.path, queryParams(queryObjects)].join('?'))
      }

      return this.handlePostRequest(axiosData)
    }, 50)
  }

  handlePostRequest(axiosData) {
    const _this = this
    const CancelToken = axios.CancelToken
    const cancelTokenCallback = {
      cancelToken: new CancelToken(function executor(cancel) {
        _this.setState({ axiosCancelToken: cancel })
      })
    }

    this.setState({ axiosData })

    Axios
      .post(this.props.dataSource, axiosData, cancelTokenCallback)
      .then(response => {
        this.saveFilters()
        this.setState({
          data: response.data.rows,
          pages: response.data.pages,
          loading: false,
          refreshData: false,
          error: false
        })
      })
      .catch(error => {
        if (axios.isCancel(error)) return true

        console.log('Error: ', error)

        this.setState({ data: [], loading: false, error: true })
      })
  }

  handleOnSortedChange(sorted) {
    this.handleFetchData({ sorted: DataTableHelper.parseSorted(sorted) })
  }

  handleOnPageChange(pageIndex) {
    this.handleFetchData({ page: pageIndex })
  }

  handleOnPageSizeChange(pageSize, pageIndex) {
    this.handleFetchData({ pageSize: pageSize, page: pageIndex, height: DataTableHelper.setHeight(pageSize) })
  }

  handleToggleFilters() {
    let filtersState = SHOW_FILTERS_STATE

    if (this.state.showFilters) filtersState = HIDE_FILTERS_STATE

    this.setState(filtersState)
  }

  componentWillReceiveProps() {
    if (this.props.dataTableState.queryString) this.setState(SHOW_FILTERS_STATE)

    this.cancelPostRequest()
    this.setState({ error: false })
    this.initData()
  }

  componentDidMount() {
    this.retrieveFilters()
    this.initData()
  }

  componentWillUnmount() {
    this.cancelPostRequest()
  }

  render() {
    const props = this.props
    const state = this.state

    return (
      <div className="datatable">
        {state.error &&
          <Alert type="danger">
            <p>Unable to process your request. Please check your internet connection. If problem persists, contact support.</p>
          </Alert>
        }
        {(props.displayDateFilters || props.columnFilters) &&
          <div className="form-group datatable-header">
            <NewRecordButton {...props} />
            <button
              className="btn btn-primary datatable-header-filters-toggle-btn"
              onClick={this.handleToggleFilters.bind(this)}
            >
              Toggle Filters
            </button>
          </div>
        }
        {(props.displayDateFilters || props.columnFilters) && this.state.showFilters &&
          <div className="datatable-filters">
            <ColumnFilters
              filters={props.columnFilters}
              filtered={state.filtered}
              queryString={this.props.dataTableState.queryString}
              btnEnabled={state.resetFiltersBtnDisabled}
              setStateHandler={this.setStateHandler.bind(this)}
            />
          </div>
        }
        <ReactTable
          manual
          data={state.data}
          columns={this.state.columns}
          noDataText={false}
          pages={state.pages}
          pageSize={state.pageSize}
          loading={state.loading}
          loadingText="Loading data..."
          style={{ height: state.height }}
          onSortedChange={this.handleOnSortedChange.bind(this)}
          onPageChange={this.handleOnPageChange.bind(this)}
          onPageSizeChange={this.handleOnPageSizeChange.bind(this)}
          className="-highlight"
        />
      </div>
    )
  }
}

function showPopup() {
  window.history.pushState(null, null, '/admin/users/new')
}

const NewRecordButton = ({ path, newRecordButton }) => {
  if (!isAuthorised(newRecordButton.path)) return null

  return (
    <button
      className="btn btn-success"
      onClick={showPopup.bind(this)}
    >
      {newRecordButton.title}
    </button>
  )
}

export default withRouter(DataTable)
