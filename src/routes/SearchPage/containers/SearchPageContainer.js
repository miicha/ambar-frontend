import { connect } from 'react-redux'
import {
  performSearch,
  loadHighlight,
  setQuery,
  setScrolledDown,
  toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  setBucketName,
  uploadFiles,
  toggleImagePreview,
  cleanUpSearchResult
} from '../modules/SearchPage'
import Search from 'components/Search'
import { loadSources, performSearchBySource, performSearchByPathToFile, performSearchByAuthor, performSearchByQuery } from '../../MainLayout/modules/MainLayout'

const mapDispatchToProps = {
  performSearch,
  loadSources,
  loadHighlight,
  setScrolledDown,
  toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  setBucketName,
  uploadFiles,
  performSearchBySource,
  performSearchByPathToFile,
  toggleImagePreview,
  cleanUpSearchResult,
  performSearchByAuthor,
  performSearchByQuery
}

const mapStateToProps = (state) => {
  return ({
    hasMore: state['searchPage'].hasMore,
    searchQuery: state['searchPage'].searchQuery,
    fetching: state['global'].fetching,
    hits: state['searchPage'].hits,
    scrolledDown: state['searchPage'].scrolledDown,
    currentPage: state['searchPage'].currentPage,
    urls: state['core'].urls,
    mode: state['core'].mode,
    showFilePreview: state['core'].showFilePreview,
    isUploadModalOpen: state['searchPage'].isUploadModalOpen,
    sources: state['global'].sources,
    filesToUpload: state['searchPage'].filesToUpload,
    bucketName: state['searchPage'].bucketName,
    isFilesUploading: state['searchPage'].isFilesUploading,
    bucketNameValidationMessage: state['searchPage'].bucketNameValidationMessage,
    isImagePreviewOpen: state['searchPage'].isImagePreviewOpen,
    imagePreviewUrl: state['searchPage'].imagePreviewUrl    
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)