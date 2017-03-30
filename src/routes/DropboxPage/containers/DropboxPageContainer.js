import { connect } from 'react-redux'
import { setDropboxTokenFromGetParams, loadDropboxFolder, toggleOpenDropboxFolder, toggleSelectDropboxFolder, connectDropbox } from '../modules/DropboxPage'
import Dropbox from 'components/Dropbox'
import { setAppTitle } from '../../MainLayout/modules/MainLayout'

const mapDispatchToProps = {
  setAppTitle,
  setDropboxTokenFromGetParams,
  loadDropboxFolder,
  toggleOpenDropboxFolder,
  toggleSelectDropboxFolder,
  connectDropbox
}

const mapStateToProps = (state) => {
  return ({
    mode: state['core'].mode,
    integrations: state['core'].integrations,
    fetching: state['dropbox'].fetching,
    errorMessage: state['dropbox'].errorMessage,
    folder: state['dropbox'].folder
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Dropbox)