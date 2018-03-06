import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { AuthNavLink } from '../../../Lib/Common/Views'
import SignOutButton from '../../../Redux/Containers/Sessions/SignOut'

class Sidebar extends Component {
  render() {
    const path = this.props.match.path

    return (
      <nav className="sidebar">
        <ul className="nav nav-sidebar">
          <AuthNavLink title="Dashboard" to="/admin/dashboard" path={path} />
          <AuthNavLink title="Settings" to="/admin/settings" path={path} />
          <SignOutButton referrer={path} />
        </ul>
      </nav>
    )
  }
}

export default withRouter(Sidebar)
