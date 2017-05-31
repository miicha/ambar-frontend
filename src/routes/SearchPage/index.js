import { injectReducer } from '../../store/reducers'

export default (store) => ({   
  getComponent (nextState, cb) {   
    require.ensure([], (require) => {    
      const searchPage = require('./containers/SearchPageContainer').default

      const searchPageReducer = require('./modules/PageReducer').default
      injectReducer(store, { key: 'searchPage', reducer: searchPageReducer })

      cb(null, searchPage)
    }, 'searchPage')
  }
})