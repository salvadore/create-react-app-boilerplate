import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import Moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'

const INIT_DATES = { dateFrom: null, dateTo: null }
const DATE_FORMAT = 'YYYY-MM-DD HH:mm'
const DATE_TIME_PROPS = {
  selectsStart: true,
  dateFormat: DATE_FORMAT,
  showTimeSelect: true,
  timeCaption: 'Time',
  timeFormat: 'HH:mm',
  timeIntervals: 15
}

export default class DateFilters extends Component {
  constructor(props) {
    super(props)

    this.state = INIT_DATES
  }

  handleChangeDateFrom(date) {
    this.handleChangeDate({ dateFrom: date }, { dateFrom: setDate(date) })
  }

  handleChangeDateTo(date) {
    this.handleChangeDate({ dateTo: date }, { dateTo: setDate(date) })
  }

  handleChangeDate(state, parentState) {
    this.setState(state)
    this.props.setStateHandler(parentState)
  }

  componentWillReceiveProps() {
    if (this.props.resetDates) {
      this.setState(INIT_DATES)
    }
  }

  render() {
    if (!this.props.enabled) return null

    return (
      <div className="date-filters">
        <div className="form-group">
          <label className="control-label">Date From</label>
          <DatePicker
            {...DATE_TIME_PROPS}
            value={setValue(this.props.dateFrom)}
            selected={setMomentDate(this.state.dateFrom, this.props.dateFrom)}
            startDate={this.state.dateFrom}
            endDate={this.state.dateTo}
            onChange={this.handleChangeDateFrom.bind(this)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="control-label">Date To</label>
          <DatePicker
            {...DATE_TIME_PROPS}
            value={setValue(this.props.dateTo)}
            selected={setMomentDate(this.state.dateTo, this.props.dateTo)}
            startDate={this.state.dateFrom}
            endDate={this.state.dateTo}
            onChange={this.handleChangeDateTo.bind(this)}
            className="form-control"
          />
        </div>
      </div>
    )
  }
}

function setValue(date) {
  return date ? Moment(date).format(DATE_FORMAT) : ''
}

function setMomentDate(stateDate, propsDate) {
  return stateDate || (propsDate ? Moment(propsDate) : null)
}

function setDate(date) {
  return date ? date.format(DATE_FORMAT) : null
}
