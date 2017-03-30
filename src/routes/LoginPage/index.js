import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'login',  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const loginPage = require('./containers/LoginPageContainer').default
      const reducer = require('./modules/LoginPage').default
      injectReducer(store, { key: 'login', reducer })
      cb(null, loginPage)
    }, 'loginPage')
  }
})