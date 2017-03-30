import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'signup',  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const signupPage = require('./containers/SignupPageContainer').default
      const reducer = require('./modules/SignupPage').default
      injectReducer(store, { key: 'signup', reducer })
      cb(null, signupPage)
    }, 'signupPage')
  }
})