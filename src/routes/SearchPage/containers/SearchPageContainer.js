import { connect } from 'react-redux'

import {
  performSearch,
  setQuery,
  setScrolledDown,  
  cleanUpSearchResult,
  loadTags,
  performSearchByQuery,
  performSearchBySize,
  performSearchByWhen,
  performSearchByShow,
  performSearchByTag,
  setQueryFromGetParam,
  setSearchResultView,
  toggleImagePreview
} from '../modules/SearchPage'

import { toggleUploadModal } from '../modules/UploadModal'

import Search from 'components/Search'

const mapDispatchToProps = {
  performSearch,
  performSearchByQuery,
  performSearchBySize,
  performSearchByWhen,
  performSearchByShow,
  performSearchByTag,
  loadTags,
  setScrolledDown,
  toggleUploadModal,
  cleanUpSearchResult,
  setQueryFromGetParam,
  setQuery,
  setSearchResultView,
  toggleImagePreview
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
    isImagePreviewOpen: state['searchPage'].isImagePreviewOpen,
    imagePreviewUrl: state['searchPage'].imagePreviewUrl,
    searchView: state['searchPage'].searchView,
    allTags: state['searchPage'].tags,
    isTextPreviewOpen: state['searchPage'].isTextPreviewOpen,
    textPreviewFileId: state['searchPage'].textPreviewFileId
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)