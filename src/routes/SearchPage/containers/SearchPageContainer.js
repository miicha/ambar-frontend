import { connect } from 'react-redux'
import {
  performSearch,
  setQuery,
  setScrolledDown,
  toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  setBucketName,
  uploadFiles,
  toggleImagePreview,
  cleanUpSearchResult,
  toggleRefineSearchModal,
  toggleSourceSelected,
  loadSourcesAndTags,
  performSearchByQuery,
  setQueryFromGetParam,
} from '../modules/SearchPage'
import Search from 'components/Search'

const mapDispatchToProps = {
  performSearch,
  performSearchByQuery,
  loadSourcesAndTags,
  setScrolledDown,
  toggleUploadModal,
  addFilesToUpload,
  removeFileToUpload,
  setBucketName,
  uploadFiles,
  toggleImagePreview,
  cleanUpSearchResult,
  toggleRefineSearchModal,
  toggleSourceSelected,
  setQueryFromGetParam,
  setQuery
}

const mapStateToProps = (state) => {
  return ({    
    hasMore: state['searchPage'].hasMore,
    searchQuery: state['searchPage'].searchQuery,
    fetching: state['global'].fetching,
    hits: state['searchPage'].hits,
    scrolledDown: state['searchPage'].scrolledDown,
    currentPage: state['searchPage'].currentPage,
    mode: state['core'].mode,
    isUploadModalOpen: state['searchPage'].isUploadModalOpen,
    filesToUpload: state['searchPage'].filesToUpload,
    bucketName: state['searchPage'].bucketName,
    isFilesUploading: state['searchPage'].isFilesUploading,
    bucketNameValidationMessage: state['searchPage'].bucketNameValidationMessage,
    isImagePreviewOpen: state['searchPage'].isImagePreviewOpen,
    imagePreviewUrl: state['searchPage'].imagePreviewUrl,
    sources: state['searchPage'].sources,
    isRefineSearchModalOpen: state['searchPage'].isRefineSearchModalOpen,
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)