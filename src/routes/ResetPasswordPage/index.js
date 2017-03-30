import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'reset-password',  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const setPasswordPage = require('./containers/ResetPasswordPageContainer').default
      const reducer = require('./modules/ResetPasswordPage').default
      injectReducer(store, { key: 'resetPassword', reducer })
      cb(null, setPasswordPage)
    }, 'resetPasswordPage')
  }
})