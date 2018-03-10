import React, { Component } from 'react'
import DataTable from '../DataTable'
import { isAuthorised } from '../../../Lib/Helpers/Session'
import UsersConfig from '../../../Config/Admin/Users'

export default class Users extends Component {
  render() {
    const props = this.props

    return (
      <DataTable
        {...UsersConfig.dataTable}
        dataSource={process.env.REACT_APP_API_USERS_URL}
        path={props.path}
        newRecordButton={{
          title: 'New User',
          path: '/admin/users/new'
        }}
        dataTableState={props.AdminUsers}
        saveQueryState={props.saveQuery}
        showEditRow={isAuthorised('/admin/users/:userId')}
        showDeleteRow={isAuthorised('/admin/users/delete')}
        actionAccessorId="userId"
      />
    )
  }
}
