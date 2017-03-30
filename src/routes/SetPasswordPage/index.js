import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'set-password',  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const setPasswordPage = require('./containers/SetPasswordPageContainer').default
      const reducer = require('./modules/SetPasswordPage').default
      injectReducer(store, { key: 'setPassword', reducer })
      cb(null, setPasswordPage)
    }, 'setPasswordPage')
  }
})