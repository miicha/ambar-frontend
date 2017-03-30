import { injectReducer } from '../../store/reducers'

export default (store) => ({    
  path: 'account',
  getComponent (nextState, cb) {   
    require.ensure([], (require) => {    
      const accountPage = require('./containers/AccountPageContainer').default
      const reducer = require('./modules/AccountPage').default
      injectReducer(store, { key: 'accountPage', reducer })
      cb(null, accountPage)
    }, 'accountPage')
  }
})