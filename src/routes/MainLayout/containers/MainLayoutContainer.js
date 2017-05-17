import { connect } from 'react-redux'
import { 
  postConfigRequest,
  checkIfAllowed,
  toggleSideMenu,
  changeLocation,
  setAppHeader,
  toggleRateUsModal } from '../modules/MainLayout'

import MainLayout from 'layouts/MainLayout/MainLayout'

const mapDispatchToProps = {
  postConfigRequest,
  toggleSideMenu,
  changeLocation,
  setAppHeader,
  toggleRateUsModal
}

const mapStateToProps = (state, ownProps) => {
  return ({
    fetching: state['global'].fetching,
    children: ownProps.children,
    location: state['router'].locationBeforeTransitions.pathname,
    isSideMenuOpen: state['global'].isSideMenuOpen,
    header: state['global'].header,
    mode: state['core'].mode,
    version: state['core'].version,
    showRateUsModal: state['global'].showRateUsModal,
    state: state // DUMB SOLUTION
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)