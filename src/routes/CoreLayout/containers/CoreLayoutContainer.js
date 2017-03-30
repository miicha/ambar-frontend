import { connect } from 'react-redux'
import { loadConfig, setAppTitle, closeNotification } from '../modules/CoreLayout'
import CoreLayout from 'layouts/CoreLayout/CoreLayout'

const mapDispatchToProps = {
  loadConfig,
  setAppTitle,
  closeNotification
}

const mapStateToProps = (state) => {
  return ({
    fetching: state['core'].fetching,
    isNotificationOpen: state['core'].isNotificationOpen,
    notificationMessage: state['core'].notificationMessage,
    notificationReason: state['core'].notificationReason
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
