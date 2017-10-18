import React, { Component } from 'react'
import { FullScreenLoader } from 'components/BasicComponents'
import classes from './AuthLayout.scss'

class AuthLayout extends Component {
  componentDidMount() {
    const { authenticate } = this.props

    authenticate()
  }

  render() {
    const { fetching, Component, isAuthenticated, allowedRoutes, setPageTitle, children, ...otherProps } = this.props

    return (
      <div style={{ height: '100%' }}>
        {!(isAuthenticated && !fetching) && <FullScreenLoader />}
        {isAuthenticated && !fetching && <Component children={children} isAuthenticated={isAuthenticated} allowedRoutes={allowedRoutes} setPageTitle={setPageTitle} {...otherProps} />}
      </div>)
  }
}

AuthLayout.propTypes = {
  children: React.PropTypes.element,
  fetching: React.PropTypes.bool.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired,
  allowedRoutes: React.PropTypes.array.isRequired,
  authenticate: React.PropTypes.func.isRequired
}

export default AuthLayout
