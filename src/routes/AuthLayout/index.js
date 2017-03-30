import { injectReducer } from '../../store/reducers'
import AuthLayout from './containers/AuthLayoutContainer'
import reducer from './modules/AuthLayout'
import { auth } from 'utils'

export default (Component, store) => {
      injectReducer(store, { key: 'auth', reducer })
      return AuthLayout(Component)
}