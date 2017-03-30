import { injectReducer } from '../../store/reducers'

export default (store) => ({   
  getComponent (nextState, cb) {   
    require.ensure([], (require) => {    
      const searchPage = require('./containers/SearchPageContainer').default
      const reducer = require('./modules/SearchPage').default
      injectReducer(store, { key: 'searchPage', reducer })
      cb(null, searchPage)
    }, 'searchPage')
  }
})