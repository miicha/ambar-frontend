import { injectReducer } from '../../store/reducers'

export default (store) => ({    
  path: 'dropbox',
  getComponent (nextState, cb) {   
    require.ensure([], (require) => {    
      const dropboxPage = require('./containers/DropboxPageContainer').default
      const reducer = require('./modules/DropboxPage').default
      injectReducer(store, { key: 'dropbox', reducer })
      cb(null, dropboxPage)
    }, 'dropbox')
  }
})