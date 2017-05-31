import { stateValueExtractor } from 'utils/'
import { hitsModel, sourcesModel } from 'models/'
import { titles, analytics, FormDataPolyfill } from 'utils'
import { handleError, showInfo } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import { setQuery, performSearch, setSources, updateSourceSelected } from 'routes/SearchPage/modules/SearchPage'

import * as Regexes from 'utils/regexes'
import 'whatwg-fetch'

export const START_STOP_HIGHLIGHT_LOADING = 'SEARCH_CARD.START_STOP_HIGHLIGHT_LOADING'
export const SET_CONTENT_HIGHLIGHT = 'SEARCH_CARD.SET_CONTENT_HIGHLIGHT'
export const ADD_TAG = 'SEARCH_CARD.ADD_TAG'
export const REMOVE_TAG = 'SEARCH_CARD.REMOVE_TAG'
export const MARK_TAG_AS_CREATED = 'SEARCH_CARD.MARK_TAG_AS_CREATED'

export const loadHighlight = (sha256, query) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
            dispatch(startStopHighlightLoadingIndicator(sha256, true))
            fetch(urls.ambarWebApiLoadContentHightlight(sha256, query), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status == 200) { return resp.json() }
                    else { throw resp }
                })
                .then((resp) => {
                    dispatch(setContentHighlight(sha256, hitsModel.contentHighlightFromApi(resp)))
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

export const performSearchByPathToFile = (path) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.FILE_NAME_QUERY_REGEX, '')
        path = path.replace(/\s/gim, '?')
        query = `${query} filename:${path}`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const performSearchByAuthor = (author) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.AUTHOR_QUERY_REGEX, '')
        author = author.replace(/\s/gim, '?')
        query = `${query} author:${author}`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const performSearchBySource = (sourceId) => {
    return (dispatch, getState) => {
        dispatch(setSources(sourcesModel.fromSourcesDisabled(getState()['searchPage'].sources)))
        dispatch(updateSourceSelected(sourceId))
        const query = getState()['searchPage'].searchQuery
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const performSearchByTag = (tag) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.TAGS_QUERY_REGEX, '')        
        query = `${query} tags:${tag}`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const addTagToFile = (sha256, fileId, tagName) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(addTag(sha256, tagName))

        fetch(urls.ambarWebApiAddTagToFile(fileId), {
            method: 'POST',
            body: JSON.stringify({ name: tagName }),
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200 || resp.status == 201) {                    
                    dispatch(markTagAsCreated(sha256, tagName))
                    analytics().event('TAGS.ADD', { name: tagName })
                    return
                }
                else { throw resp }
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('addTagToFile', errorPayload)
            })
    }
}

export const removeTagFromFile = (sha256, fileId, tagName) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(removeTag(sha256, tagName))

        fetch(urls.ambarWebApiDeleteTagFromFile(fileId, tagName), {
            method: 'DELETE',            
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    analytics().event('TAGS.REMOVED', { name: tagName })
                    return
                }
                else { throw resp }
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('removeTagFromFile', errorPayload)
            })
    }
}

const addTag = (sha256, tagName) => {
    return {
        type: ADD_TAG,
        tagName: tagName,
        sha256: sha256
    }
}

const removeTag = (sha256, tagName) => {
    return {
        type: REMOVE_TAG,
        tagName: tagName,
        sha256: sha256
    }
}

const markTagAsCreated = (sha256, tagName) => {
    return {
        type: MARK_TAG_AS_CREATED,
        tagName: tagName,
        sha256: sha256
    }
}

const getHit = (state, sha256) => {
    const hit = state.hits.get(sha256)
    return hit
}

const updateHits = (state, sha256, hit) => {
    const newState = { ...state, hits: new Map(state.hits) }
    newState.hits.set(sha256, hit)
    return newState
}

export const ACTION_HANDLERS = {
    [START_STOP_HIGHLIGHT_LOADING]: (state, action) => {
        const oldHit = getHit(state, action.sha256)
        const hit = { ...oldHit, fetching: action.fetching }
        return updateHits(state, action.sha256, hit)
    },
    [SET_CONTENT_HIGHLIGHT]: (state, action) => {
        const oldHit = getHit(state, action.sha256)
        const hit = { ...oldHit, content: { highlight: action.highlight } }
        return updateHits(state, action.sha256, hit)
    },
    [ADD_TAG]: (state, action) => {
        const oldHit = getHit(state, action.sha256)
        const hit = { ...oldHit, tags: [...oldHit.tags, { name: action.tagName, isFetching: true }] }
        return updateHits(state, action.sha256, hit)
    },
    [REMOVE_TAG]: (state, action) => {
        const oldHit = getHit(state, action.sha256)
        const hit = { ...oldHit, tags: [...oldHit.tags.filter(t => t.name !== action.tagName)] }
        return updateHits(state, action.sha256, hit)
    },
    [MARK_TAG_AS_CREATED]: (state, action) => {
        const oldHit = getHit(state, action.sha256)
        const hit = { ...oldHit}
        hit.tags = hit.tags.map(tag => {
            if (tag.name === action.tagName) {
                tag.isFetching = false
            }

            return tag
        })

        return updateHits(state, action.sha256, hit)
    }
}