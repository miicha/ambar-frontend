import { ACTION_HANDLERS as SearchCardActions } from './SearchCard'
import { ACTION_HANDLERS as SearchPageActions } from './SearchPage'
import { ACTION_HANDLERS as UploadModalActions } from './UploadModal'
import { ACTION_HANDLERS as TextPreviewModalActions } from './TextPreviewModal'

const initialState = {
    searchQuery: '',
    currentPage: 0,
    hits: new Map(),
    hasMore: false,
    scrolledDown: false,
    isUploadModalOpen: false,
    filesToUpload: [],
    isFilesUploading: false,
    isImagePreviewOpen: false,
    imagePreviewUrl: '',
    isTextPreviewOpen: false,
    textPreviewFileId: '',
    textPreviewFetching: true,
    textPreviewHit: null,
    searchView: 'detailed', // TODO refactor and extract constant
    tags: []
}

export default function reducer(state = initialState, action) {    
    const ACTION_HANDLERS = {
        ...SearchCardActions,
        ...SearchPageActions,
        ...UploadModalActions,
        ...TextPreviewModalActions
    }

    let handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}