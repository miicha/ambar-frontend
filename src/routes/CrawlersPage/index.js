import { injectReducer } from '../../store/reducers'

export default (store) => ({    
  path: 'crawlers',
  getComponent (nextState, cb) {   
    require.ensure([], (require) => {    
      const crawlersPage = require('./containers/CrawlersPageContainer').default
      const reducer = require('./modules/CrawlersPage').default
      injectReducer(store, { key: 'crawlersPage', reducer })
      cb(null, crawlersPage)
    }, 'crawlersPage')
  }
})