import { connect } from 'react-redux'

import {
  toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  uploadFiles 
} from '../modules/UploadModal'

import UploadModal from 'components/Search/components/UploadFileModal'

const mapDispatchToProps = {
  toggleModal: toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  uploadFiles
}

const mapStateToProps = (state, ownProps) => {
  return ({ 
    fetching: state['searchPage'].isFilesUploading,
    open: state['searchPage'].isUploadModalOpen,
    filesToUpload: state['searchPage'].filesToUpload
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadModal)