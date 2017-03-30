import { connect } from 'react-redux'
import { authenticate } from '../modules/AuthLayout'
import AuthLayout from 'layouts/AuthLayout/AuthLayout'

export default (Component) => {
  const mapDispatchToProps = {
    authenticate
  }

  const mapStateToProps = (state) => {
    return ({
      fetching: state['auth'].fetching,
      isAuthenticated: state['auth'].isAuthenticated,
      allowedRoutes: state['auth'].allowedRoutes,
      Component: Component
    })
  }

  return connect(mapStateToProps, mapDispatchToProps)(AuthLayout)
}
