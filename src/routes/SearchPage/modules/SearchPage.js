import { stateValueExtractor } from 'utils/'
import { hitsModel } from 'models/'
import { titles, analytics, FormDataPolyfill } from 'utils'
import { handleError, showInfo } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator, loadSources, setQuery } from 'routes/MainLayout/modules/MainLayout'
import 'whatwg-fetch'

export const START_STOP_HIGHLIGHT_LOADING = 'SEARCH.START_STOP_HIGHLIGHT_LOADING'
export const SET_CONTENT_HIGHLIGHT = 'SEARCH.SET_CONTENT_HIGHLIGHT'
export const FILL_HITS = 'SEARCH.FILL_HITS'
export const UPDATE_SCROLLED_DOWN = 'SEARCH.UPDATE_SCROLLED_DOWN'
export const TOGGLE_UPLOAD_MODAL = 'SEARCH.TOGGLE_UPLOAD_MODAL'
export const ADD_FILES_TO_UPLOAD = 'SEARCH.ADD_FILES_TO_UPLOAD'
export const REMOVE_FILE_TO_UPLOAD = 'SEARCH.REMOVE_FILE_TO_UPLOAD'
export const SET_BUCKET_NAME = 'SEARCH.SET_BUCKET_NAME'
export const FILES_UPLOADING = 'SEARCH.FILES_UPLOADING'
export const CLEAN_FILES_TO_UPLOAD = 'SEARCH.CLEAN_FILES_TO_UPLOAD'
export const SET_BUCKET_NAME_VALIDATION_MESSAGE = 'SEARCH.SET_BUCKET_NAME_VALIDATION_MESSAGE'
export const TOGGLE_IMAGE_PREVIEW_MODAL = 'SEARCH.TOGGLE_IMAGE_PREVIEW_MODAL'

const REQUEST_SIZE = 10

const setQueryParameter = (query) => {
    if (history.pushState) {
        var newUri = `${window.location.protocol}//${window.location.host}${window.location.pathname}?query=${encodeURIComponent(query)}`;
        window.history.pushState({ path: newUri }, '', newUri);
    }
}

export const setScrolledDown = (scrolledDown) => {
    return (dispatch, getState) => {
        dispatch(updateScrolledDown(scrolledDown))
    }
}

export const performSearch = (page, query) => {
    return (dispatch, getState) => {
        if ((!query) || (query == '')) {
            dispatch(fillHits(true, new Map(), 0, '', false, page))
            return
        }

        setQueryParameter(query)
        titles.setPageTitle(query)

        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
            if (page == 0) { dispatch(fillHits(true, new Map(), 0, query, false, page)) }
            dispatch(startLoadingIndicator())
            fetch(urls.ambarWebApiSearchByStringQuery(query, page, REQUEST_SIZE), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status === 200) { return resp.json() }
                    else { throw resp }
                })
                .then((data) => {
                    const hits = hitsModel.fromApi(data)
                    const hasMore = (hits.size > 0)
                    const clean = (page == 0)
                    dispatch(stopLoadingIndicator())
                    dispatch(fillHits(clean, hits, data.found, query, hasMore, page))
                    
                    if (page === 0) { analytics().event('SEARCH.PERFORM', {query: query }) }            
                })
                .catch((errorPayload) => {
                    dispatch(stopLoadingIndicator())
                    dispatch(handleError(errorPayload))
                    console.error('performSearch', errorPayload)
                })
        })
    }
}

export const cleanUpSearchResult = () => {
    return (dispatch, getState) => {
        dispatch(fillHits(true, new Map(), 0, '', false, 0))
    }
}

export const loadHighlight = (sha256, query) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
            dispatch(startStopHighlightLoadingIndicator(sha256, true))
            fetch(urls.ambarWebApiLoadHightlight(sha256, query), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status == 200) { return resp.json() }
                    else { throw resp }
                })
                .then((resp) => {
                    dispatch(setContentHighlight(sha256, resp.highlight))
                    dispatch(startStopHighlightLoadingIndicator(sha256, false))
                    analytics().event('SEARCH.LOAD_HIGHLIGHT')             
                })
                .catch((errorPayload) => {
                    dispatch(startStopHighlightLoadingIndicator(sha256, false))
                    dispatch(handleError(errorPayload))
                    console.error('loadHighlight', errorPayload)
                })
        })
    }
}

export const uploadFiles = () => {
    return (dispatch, getState) => {
        dispatch(filesUploading(true))

        const urls = stateValueExtractor.getUrls(getState())
        const authHeaders = stateValueExtractor.getAuthHeaders(getState())

        const { filesToUpload, bucketName } = getState()['searchPage']

        const BUCKET_NAME_REGEX = /^[0-9a-zA-Z\-]+$/
        if (!BUCKET_NAME_REGEX.test(bucketName)) {
            dispatch(filesUploading(false))
            dispatch(setBucketNameValidationMessage('Bucket name has illegal characters, only numbers, letters and dashes allowed'))
            return
        }

        const uploadPromises = filesToUpload.map(file => new Promise((resolve, reject) => {
            const form = new FormDataPolyfill()
            form.set(file.name, file, file.name)
            
            fetch(urls.ambarWebApiPostFile(bucketName, file.name), {
                method: 'POST',
                body: form._asNative(),
                mode: 'cors',
                credentials: 'include',
                headers: {
                    ...authHeaders
                }
            }).then((resp) => {
                if (resp.status >= 400) { 
                    throw resp 
                }
                else { resolve() }
            })
            .catch((errorPayload) => reject(errorPayload))
        }))

        Promise.all(uploadPromises)
            .then((values) => {
                dispatch(filesUploading(false))
                dispatch(loadSources())
                dispatch(toggleUploadModal())
                dispatch(cleanFilesToUpload())
                dispatch(showInfo('Files succesfully uploaded'))   
                analytics().event('SEARCH.UPLOAD_FILES', { count: uploadPromises.length })             
            })            
            .catch((errorPayload) => {
                dispatch(filesUploading(false))

                if (errorPayload.status === 507) {
                    dispatch(handleError('No free space left in your account', true))
                } else {
                    dispatch(handleError(errorPayload))
                    analytics().event('SEARCH.UPLOAD_FILES_ERROR', { error: errorPayload })
                }
                
                console.error('uploadFile', errorPayload)
            })
    }
}

export const toggleImagePreview = (imageUrl = undefined) => {
    return (dispatch, getState) => {
        analytics().event('SEARCH.TOGGLE_IMAGE_PREIVEW')
        dispatch(toggleImagePreviewModal(imageUrl))
    }
}

export const toggleImagePreviewModal = (imageUrl) => {
    return {
        type: TOGGLE_IMAGE_PREVIEW_MODAL,
        imageUrl
    }
}

export const fillHits = (clean, hits, found, searchQuery, hasMore, currentPage) => {
    return {
        type: FILL_HITS,
        clean,
        hits,
        found,
        searchQuery,
        hasMore,
        currentPage
    }
}

export const setContentHighlight = (sha256, highlight) => {
    return {
        type: SET_CONTENT_HIGHLIGHT,
        sha256,
        highlight
    }
}

export const startStopHighlightLoadingIndicator = (sha256, fetching) => {
    return {
        type: START_STOP_HIGHLIGHT_LOADING,
        sha256,
        fetching
    }
}

export const updateScrolledDown = (scrolledDown) => {
    return {
        type: UPDATE_SCROLLED_DOWN,
        scrolledDown
    }
}

export const toggleUploadModal = () => {
    return {
        type: TOGGLE_UPLOAD_MODAL
    }
}

export const addFilesToUpload = (files) => {
    return {
        type: ADD_FILES_TO_UPLOAD,
        files: files
    }
}

export const removeFileToUpload = (file) => {
    return {
        type: REMOVE_FILE_TO_UPLOAD,
        file: file
    }
}

export const setBucketName = (bucketName) => {
    return {
        type: SET_BUCKET_NAME,
        name: bucketName
    }
}

export const setBucketNameValidationMessage = (bucketNameValidationMessage) => {
    return {
        type: SET_BUCKET_NAME_VALIDATION_MESSAGE,
        message: bucketNameValidationMessage
    }
}

export const filesUploading = (isUploading) => {
    return {
        type: FILES_UPLOADING,
        isUploading: isUploading
    }
}

export const cleanFilesToUpload = () => {
    return {
        type: CLEAN_FILES_TO_UPLOAD
    }
}

const ACTION_HANDLERS = {
    [START_STOP_HIGHLIGHT_LOADING]: (state, action) => {
        let newState = { ...state }
        newState.hits = new Map(state.hits)
        let hit = { ...newState.hits.get(action.sha256) }
        hit.fetching = action.fetching
        newState.hits.set(action.sha256, hit)
        return newState
    },
    [SET_CONTENT_HIGHLIGHT]: (state, action) => {
        let newState = { ...state }
        newState.hits = new Map(state.hits)
        let hit = { ...newState.hits.get(action.sha256) }
        hit.highlight = action.highlight
        newState.hits.set(action.sha256, hit)
        return newState
    },
    [FILL_HITS]: (state, action) => {
        let newState = { ...state }
        if (action.clean) {
            newState.hits = action.hits
        }
        else {
            newState.hits = new Map([...state.hits, ...action.hits])
        }
        newState.fetching = false
        newState.searchQuery = action.searchQuery
        newState.hasMore = action.hasMore
        newState.currentPage = action.currentPage
        return newState
    },
    [UPDATE_SCROLLED_DOWN]: (state, action) => {
        const newState = { ...state, scrolledDown: action.scrolledDown }
        return newState
    },
    [TOGGLE_UPLOAD_MODAL]: (state, action) => {
        const newState = { ...state, isUploadModalOpen: !state.isUploadModalOpen }
        return newState
    },
    [ADD_FILES_TO_UPLOAD]: (state, action) => {
        const newState = { ...state, filesToUpload: [...state.filesToUpload, ...action.files] }
        return newState
    },
    [REMOVE_FILE_TO_UPLOAD]: (state, action) => {
        const newState = { ...state, filesToUpload: state.filesToUpload.filter(f => f !== action.file) }
        return newState
    },
    [SET_BUCKET_NAME]: (state, action) => {
        return { ...state, bucketName: action.name, bucketNameValidationMessage: '' }
    },
    [SET_BUCKET_NAME_VALIDATION_MESSAGE]: (state, action) => {
        return { ...state, bucketNameValidationMessage: action.message }
    },
    [FILES_UPLOADING]: (state, action) => {
        const newState = { ...state, isFilesUploading: action.isUploading }
        return newState
    },
    [CLEAN_FILES_TO_UPLOAD]: (state, action) => {
        const newState = { ...state, filesToUpload: [] }
        return newState
    },
    [TOGGLE_IMAGE_PREVIEW_MODAL]: (state, action) => {
        const newState = { ...state, isImagePreviewOpen: !state.isImagePreviewOpen, imagePreviewUrl: action.imageUrl ? action.imageUrl : state.imagePreviewUrl }
        return newState
    }
}

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
    imagePreviewUrl: ''
}

export default function searchPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}