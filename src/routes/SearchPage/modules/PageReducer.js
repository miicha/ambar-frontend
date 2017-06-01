import { ACTION_HANDLERS as SearchCardActions } from './SearchCard'
import { ACTION_HANDLERS as SearchPageActions } from './SearchPage'

const initialState = {
    searchQuery: '',
    currentPage: 0,
    hits: new Map(),
    hasMore: false,
    scrolledDown: false,
    isUploadModalOpen: false,
    filesToUpload: [],
    bucketName: 'Default',
    bucketNameValidationMessage: '',
    isFilesUploading: false,
    isImagePreviewOpen: false,
    imagePreviewUrl: '',
    sources: new Map(),
    isRefineSearchModalOpen: false,
    tags: []
}

export default function reducer(state = initialState, action) {    
    const ACTION_HANDLERS = {
        ...SearchCardActions,
        ...SearchPageActions
    }

    let handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}