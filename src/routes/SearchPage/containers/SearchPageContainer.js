import { connect } from 'react-redux'

import {
  performSearch,
  setQuery,
  setScrolledDown,
  toggleImagePreview,
  cleanUpSearchResult,
  toggleRefineSearchModal,
  toggleSourceSelected,
  loadSourcesAndTags,
  performSearchByQuery,
  performSearchBySource,
  performSearchBySize,
  performSearchByWhen,
  performSearchByShow,
  setQueryFromGetParam
} from '../modules/SearchPage'

import { toggleUploadModal } from '../modules/UploadModal'

import Search from 'components/Search'

const mapDispatchToProps = {
  performSearch,
  performSearchByQuery,
  performSearchBySource,
  performSearchBySize,
  performSearchByWhen,
  performSearchByShow,
  loadSourcesAndTags,
  setScrolledDown,
  toggleUploadModal,
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
    isImagePreviewOpen: state['searchPage'].isImagePreviewOpen,
    imagePreviewUrl: state['searchPage'].imagePreviewUrl,
    sources: state['searchPage'].sources,
    isRefineSearchModalOpen: state['searchPage'].isRefineSearchModalOpen,
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)