import { connect } from 'react-redux'
import { postConfigRequest, checkIfAllowed, toggleSideMenu, changeLocation, setQuery, toggleRefineSearchModal, toggleSourceSelected } from '../modules/MainLayout'
import { performSearch } from 'routes/SearchPage/modules/SearchPage'

import MainLayout from 'layouts/MainLayout/MainLayout'

const mapDispatchToProps = {
  postConfigRequest,
  toggleSideMenu,
  changeLocation,
  setQuery,
  performSearch,  
  toggleRefineSearchModal,
  toggleSourceSelected
}

const mapStateToProps = (state, ownProps) => {
  return ({
    fetching: state['global'].fetching,
    children: ownProps.children,
    location: state['router'].locationBeforeTransitions.pathname,
    isSideMenuOpen: state['global'].isSideMenuOpen,
    title: state['global'].title,
    
    showSearchInput: state['global'].showSearchInput,
    query: state['global'].query,
    
    sources: state['global'].sources,
    isRefineSearchModalOpen: state['global'].isRefineSearchModalOpen,

    mode: state['core'].mode
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)