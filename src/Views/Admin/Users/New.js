import React, { Component } from 'react'
import { PageTitle } from '../../../Lib/Common/Views'

export default class New extends Component {
  render() {
    return (
      <div className="users-view">
        <PageTitle title="New User" appName="Admin" />
      </div>
    )
  }
}
