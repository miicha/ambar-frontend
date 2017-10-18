import { connect } from 'react-redux'

import {  
  closeModal
} from '../modules/TextPreviewModal'

import {
    performSearchByPathToFile,
    performSearchByAuthor,
    performSearchByNamedEntity
  } from '../modules/SearchPage'

import TextPreview from 'components/Search/components/TextPreview'

const mapDispatchToProps = {
  closeModal,
  performSearchByPathToFile,
  performSearchByAuthor,
  performSearchByNamedEntity
}

const mapStateToProps = (state, ownProps) => {
  return ({ 
    fetching: state['searchPage'].textPreviewFetching,
    isOpened: state['searchPage'].isTextPreviewOpen,
    fileId: state['searchPage'].textPreviewFileId,
    query: state['searchPage'].searchQuery,
    hit: state['searchPage'].textPreviewHit,
    namedEntityTypes: state['core'].namedEntityTypes
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(TextPreview)