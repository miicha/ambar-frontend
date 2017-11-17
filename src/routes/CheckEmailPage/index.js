import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'check-email',  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const checkEmailPage = require('./containers/CheckEmailPageContainer').default
      const reducer = require('./modules/CheckEmailPage').default
      injectReducer(store, { key: 'checkEmail', reducer })
      cb(null, checkEmailPage)
    }, 'checkEmailPage')
  }
})