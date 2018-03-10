import React, { Component } from 'react'
import axios from 'axios'
import Axios from '../../Lib/Common/Axios'

export default class DeleteRow extends Component {
  handleDeleteRow() {
    let result = window.confirm('Delete row?')

    if (!result) return

    Axios
      .delete([this.props.dataSource, this.props.id].join('/'))
      .then(response => {
        this.props.refreshDataHandler()
      })
      .catch(error => {
        if (axios.isCancel(error)) return true

        console.log('Error: ', error)
      })
  }

  render() {
    return <button
      className="datatable-actions-delete-btn"
      onClick={this.handleDeleteRow.bind(this)}
    >Delete</button>
  }
}
