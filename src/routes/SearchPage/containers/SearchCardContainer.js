import { connect } from 'react-redux'

import {
  openTextPreview
} from '../modules/TextPreviewModal'

import {
  loadHighlight,  
  addTagToFile,
  removeTagFromFile,
  hideFile,
  showFile
} from '../modules/SearchCard'

import {
  performSearchByPathToFile,
  performSearchByAuthor,
  performSearchByQuery,
  performSearchByTag,
  toggleImagePreview
} from '../modules/SearchPage'

import SearchCard from 'components/Search/components/SearchResultContainer/components/SearchResultCard'

const mapDispatchToProps = {
  performSearchByPathToFile,
  performSearchByAuthor,
  performSearchByQuery,
  performSearchByTag,
  loadHighlight,
  toggleImagePreview,
  addTagToFile,
  removeTagFromFile,
  hideFile,
  showFile,
  openTextPreview
}

const mapStateToProps = (state, ownProps) => {
  const hit = state['searchPage'].hits.get(ownProps.fileId)
  const urls = state['core'].urls
  const thumbnailUri = urls.ambarWebApiGetThumbnail(hit.sha256)
  const downloadUri = urls.ambarWebApiGetFile(hit.meta.download_uri)

  return ({ 
    hit: hit,
    thumbnailUri: thumbnailUri,
    downloadUri: downloadUri,
    showFilePreview: state['core'].showFilePreview,
    allTags: state['searchPage'].tags,
    searchQuery: state['searchPage'].searchQuery       
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCard)