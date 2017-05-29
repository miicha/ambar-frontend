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
  cleanUpSearchResult,
  toggleRefineSearchModal,
  toggleSourceSelected,
  loadSources,
  performSearchBySource,
  performSearchByPathToFile,
  performSearchByAuthor,
  performSearchByQuery,
  setQueryFromGetParam,
  addTagToFile,
  removeTagFromFile,
  performSearchByTag
} from '../modules/SearchPage'
import Search from 'components/Search'

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
  performSearchByQuery,
  toggleRefineSearchModal,
  toggleSourceSelected,
  setQueryFromGetParam,
  setQuery,
  addTagToFile,
  removeTagFromFile,
  performSearchByTag
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