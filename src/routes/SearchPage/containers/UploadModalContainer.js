import { connect } from 'react-redux'

import {
  toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  setBucketName,
  uploadFiles 
} from '../modules/UploadModal'

import UploadModal from 'components/Search/components/UploadFileModal'

const mapDispatchToProps = {
  toggleModal: toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  setBucketName,
  uploadFiles
}

const mapStateToProps = (state, ownProps) => {
  return ({ 
    fetching: state['searchPage'].isFilesUploading,
    sources: state['searchPage'].sources,
    open: state['searchPage'].isUploadModalOpen,
    filesToUpload: state['searchPage'].filesToUpload,
    bucketNameValidationMessage: state['searchPage'].bucketNameValidationMessage,
    bucketName: state['searchPage'].bucketName
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadModal)