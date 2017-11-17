import { connect } from 'react-redux'
import { stateValueExtractor } from 'utils/'
import {
  performLogout,
  performPasswordChange,
  changeOldPassword,
  changeNewPassword,
  changeNewPasswordConfirmation,
  loadUserInfo,
  loadDropboxCrawler,
  initDropboxCrawler,
  deleteDropboxCrawler,
  toggleRemoveUserAccountDialog,
  removeUserAccount
} from '../modules/AccountPage'

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
  deleteDropboxCrawler,
  toggleRemoveUserAccountDialog,
  removeUserAccount
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
    showRemoveUserAccountDialog: state['accountPage'].showRemoveUserAccountDialog,
    dropboxCrawler: state['accountPage'].dropboxCrawler,
    isDefaultUser: state['accountPage'].isDefaultUser,
    auth: state['core'].auth,
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)