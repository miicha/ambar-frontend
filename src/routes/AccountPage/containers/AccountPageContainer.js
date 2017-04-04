import { connect } from 'react-redux'
import { performLogout, performPasswordChange, changeOldPassword, changeNewPassword, changeNewPasswordConfirmation, loadUserInfo, loadDropboxCrawler, initDropboxCrawler, deleteDropboxCrawler } from '../modules/AccountPage'
import Account from 'components/Account'

const mapDispatchToProps = {
  performLogout,
  performPasswordChange,
  changeOldPassword,
  changeNewPassword,
  changeNewPasswordConfirmation,
  loadUserInfo,
  loadDropboxCrawler,
  initDropboxCrawler,
  deleteDropboxCrawler
}

const mapStateToProps = (state) => {
  return ({
    mode: state['core'].mode,
    fetching: state['accountPage'].fetching,
    email: state['accountPage'].email,
    name: state['accountPage'].name,
    plan: state['accountPage'].plan,
    langAnalyzer: state['accountPage'].langAnalyzer,
    storageMax: state['accountPage'].storageMax,
    storageUsed: state['accountPage'].storageUsed,
    oldPassword: state['accountPage'].oldPassword,
    newPassword: state['accountPage'].newPassword,
    newPasswordConfirmation: state['accountPage'].newPasswordConfirmation,
    oldPasswordError: state['accountPage'].oldPasswordError,
    newPasswordError: state['accountPage'].newPasswordError,
    newPasswordConfirmationError: state['accountPage'].newPasswordConfirmationError,

    dropboxCrawler: state['accountPage'].dropboxCrawler
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)