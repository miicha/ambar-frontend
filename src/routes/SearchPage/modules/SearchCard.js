import { stateValueExtractor } from 'utils/'
import { hitsModel } from 'models/'
import { titles, analytics, FormDataPolyfill } from 'utils'
import { handleError, showInfo } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import { setQuery, performSearch, setTags } from 'routes/SearchPage/modules/SearchPage'

import * as Regexes from 'utils/regexes'
import 'whatwg-fetch'

export const START_STOP_HIGHLIGHT_LOADING = 'SEARCH_CARD.START_STOP_HIGHLIGHT_LOADING'
export const SET_CONTENT_HIGHLIGHT = 'SEARCH_CARD.SET_CONTENT_HIGHLIGHT'
export const ADD_TAG = 'SEARCH_CARD.ADD_TAG'
export const REMOVE_TAG = 'SEARCH_CARD.REMOVE_TAG'
export const MARK_TAG_AS_CREATED = 'SEARCH_CARD.MARK_TAG_AS_CREATED'
export const TOGGLE_IS_HIDDEN_FILE = 'SEARCH_CARD.TOGGLE_IS_HIDDEN_FILE'

export const loadHighlight = (fileId, query) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
            dispatch(startStopHighlightLoadingIndicator(fileId, true))
            fetch(urls.ambarWebApiLoadContentHightlight(fileId, query), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status == 200) { return resp.json() }
                    else { throw resp }
                })
                .then((resp) => {
                    dispatch(setContentHighlight(fileId, hitsModel.contentHighlightFromApi(resp)))
                    dispatch(startStopHighlightLoadingIndicator(fileId, false))
                    analytics().event('SEARCH.LOAD_HIGHLIGHT')
                })
                .catch((errorPayload) => {
                    dispatch(startStopHighlightLoadingIndicator(fileId, false))
                    dispatch(handleError(errorPayload))
                    console.error('loadHighlight', errorPayload)
                })
        })
    }
}

export const setContentHighlight = (fileId, highlight) => {
    return {
        type: SET_CONTENT_HIGHLIGHT,
        fileId,
        highlight
    }
}

export const startStopHighlightLoadingIndicator = (fileId, fetching) => {
    return {
        type: START_STOP_HIGHLIGHT_LOADING,
        fileId,
        fetching
    }
}

export const addTagToFile = (fileId, tagType, tagName) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(addTag(fileId, tagType, tagName))

        fetch(urls.ambarWebApiAddTagToFile(fileId, tagType, tagName), {
            method: 'POST',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200 || resp.status == 201) {
                    dispatch(markTagAsCreated(fileId, tagType, tagName))
                    analytics().event('TAGS.ADD', { name: tagName })
                    return resp.json()
                }
                else { throw resp }
            })
            .then((data) => {
                dispatch(setTags(data.tags))
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('addTagToFile', errorPayload)
            })
    }
}

export const removeTagFromFile = (fileId, tagType, tagName) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(removeTag(fileId, tagType, tagName))

        fetch(urls.ambarWebApiDeleteTagFromFile(fileId, tagType, tagName), {
            method: 'DELETE',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    analytics().event('TAGS.REMOVED', { name: tagName })
                    return resp.json()
                }
                else { throw resp }
            })
            .then((data) => {
                dispatch(setTags(data.tags))
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('removeTagFromFile', errorPayload)
            })
    }
}

export const hideFile = (fileId) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(toggleIsHiddenFile(fileId, true))

        fetch(urls.ambarWebApiHideFile(fileId), {
            method: 'PUT',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    analytics().event('FILE.HIDE')
                    return
                }
                else { throw resp }
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('hideFile', errorPayload)
            })
    }
}

export const showFile = (fileId) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(toggleIsHiddenFile(fileId, false))

        fetch(urls.ambarWebApiUnhideFile(fileId), {
            method: 'PUT',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    analytics().event('FILE.SHOW')
                    return
                }
                else { throw resp }
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('showFile', errorPayload)
            })
    }
}

const addTag = (fileId, tagType, tagName) => {
    return {
        type: ADD_TAG,
        tagName: tagName,
        tagType: tagType,
        fileId: fileId
    }
}

const removeTag = (fileId, tagType, tagName) => {
    return {
        type: REMOVE_TAG,
        tagName: tagName,
        tagType: tagType,
        fileId: fileId
    }
}

const markTagAsCreated = (fileId, tagType, tagName) => {
    return {
        type: MARK_TAG_AS_CREATED,
        tagName: tagName,
        tagType: tagType,
        fileId: fileId
    }
}

const toggleIsHiddenFile = (fileId, value) => {
    return {
        type: TOGGLE_IS_HIDDEN_FILE,
        fileId: fileId,
        value: value
    }
}

const getHit = (state, fileId) => {
    const hit = state.hits.get(fileId)
    return hit
}

const updateHits = (state, fileId, hit) => {
    const newState = { ...state, hits: new Map(state.hits) }
    newState.hits.set(fileId, hit)
    return newState
}

export const ACTION_HANDLERS = {
    [START_STOP_HIGHLIGHT_LOADING]: (state, action) => {
        const oldHit = getHit(state, action.fileId)
        const hit = { ...oldHit, fetching: action.fetching }
        return updateHits(state, action.fileId, hit)
    },
    [SET_CONTENT_HIGHLIGHT]: (state, action) => {
        const oldHit = getHit(state, action.fileId)
        const hit = { ...oldHit, content: { ...oldHit.content, highlight: action.highlight } }
        return updateHits(state, action.fileId, hit)
    },
    [ADD_TAG]: (state, action) => {
        const oldHit = getHit(state, action.fileId)
        const hit = { ...oldHit, tags: [...oldHit.tags, { name: action.tagName, type: action.tagType, isFetching: true }] }
        return updateHits(state, action.fileId, hit)
    },
    [REMOVE_TAG]: (state, action) => {
        const oldHit = getHit(state, action.fileId)
        const hit = { ...oldHit, tags: [...oldHit.tags.filter(t => !((t.name === action.tagName) && (t.type === action.tagType)))] }
        return updateHits(state, action.fileId, hit)
    },
    [MARK_TAG_AS_CREATED]: (state, action) => {
        const oldHit = getHit(state, action.fileId)
        const hit = { ...oldHit }
        hit.tags = hit.tags.map(tag => {
            if ((tag.name === action.tagName) && (tag.type === action.tagType)) {
                tag.isFetching = false
            }

            return tag
        })

        return updateHits(state, action.fileId, hit)
    },
    [TOGGLE_IS_HIDDEN_FILE]: (state, action) => {
        const oldHit = getHit(state, action.fileId)
        const hit = { ...oldHit, isHidden: action.value, hidden_mark: action.value ? {} : null }
        return updateHits(state, action.fileId, hit)
    }
}