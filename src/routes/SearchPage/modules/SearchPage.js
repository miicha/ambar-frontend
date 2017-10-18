import { stateValueExtractor } from 'utils/'
import { hitsModel } from 'models/'
import { titles, analytics, FormDataPolyfill } from 'utils'
import { handleError, showInfo } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import * as Regexes from 'utils/regexes'
import 'whatwg-fetch'

export const FILL_HITS = 'SEARCH.FILL_HITS'
export const UPDATE_SCROLLED_DOWN = 'SEARCH.UPDATE_SCROLLED_DOWN'
export const TOGGLE_IMAGE_PREVIEW_MODAL = 'SEARCH.TOGGLE_IMAGE_PREVIEW_MODAL'
export const UPDATE_QUERY = 'SEARCH.UPDATE_QUERY'
export const SET_TAGS = 'SEARCH.SET_TAGS'
export const SET_SEARCH_RESULT_VIEW = 'SEARCH.SET_SEARCH_RESULT_VIEW'

const REQUEST_SIZE = 25

const changeBrowserAddressStringToQuery = (query) => {
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
        const fetching = getState()['global'].fetching

        if (fetching) {
            return
        }

        changeBrowserAddressStringToQuery(query)
        titles.setPageTitle(query != '' ? query : 'Search')

        if ((!query) || (query == '')) {
            dispatch(cleanUpSearchResult())
            return
        }

        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        return new Promise((resolve) => {
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

                    if (page === 0) { analytics().event('SEARCH.PERFORM', { query: query }) }
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

export const updateScrolledDown = (scrolledDown) => {
    return {
        type: UPDATE_SCROLLED_DOWN,
        scrolledDown
    }
}

export const performSearchByQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
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

export const performSearchByTag = (tag) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.TAGS_QUERY_REGEX, '')
        query = `${query} tags:${tag}`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const performSearchByNamedEntity = (namedEntity) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.NAMED_ENTITIES_QUERY_REGEX, '')
        query = `${query} entities:"${namedEntity}"`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const performSearchBySize = (symbol, size) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.SIZE_QUERY_REGEX, '')
        query = `${query} size${symbol}${size}`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const performSearchByWhen = (when) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.WHEN_QUERY_REGEX, '')
        query = `${query} when:${when}`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const performSearchByShow = (show) => {
    return (dispatch, getState) => {
        let query = getState()['searchPage'].searchQuery.replace(Regexes.SHOW_QUERY_REGEX, '')
        query = `${query} show:${show}`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const loadTags = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(startLoadingIndicator())

        fetch(urls.ambarWebApiGetAllTags(), {
            method: 'GET',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    return resp.json()
                }
                else { throw resp }
            })
            .then(tags => {                
                dispatch(setTags(tags))
                dispatch(stopLoadingIndicator())
            })
            .catch((errorPayload) => {
                dispatch(stopLoadingIndicator())
                dispatch(handleError(errorPayload))
                console.error('loadTags', errorPayload)
            })

        dispatch(stopLoadingIndicator())
    }
}

export const setQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(updateQuery(query))        
    }
}

export const setTags = (tags) => {
    return {
        type: SET_TAGS,
        tags
    }
}

export const setSearchResultView = (view) => {
    return {
        type: SET_SEARCH_RESULT_VIEW,
        view: view
    }
}

export const setQueryFromGetParam = () => {
    return (dispatch, getState) => {
        const query = getState().router.locationBeforeTransitions.query.query
        const doSearch = getState().router.locationBeforeTransitions.query.doSearch

        const safeQuery = !query ? '' : query

        dispatch(updateQuery(safeQuery))
        dispatch(performSearch(0, safeQuery))
    }
}

const updateQuery = (query) => {
    return {
        type: UPDATE_QUERY,
        query
    }
}

export const ACTION_HANDLERS = {
    [FILL_HITS]: (state, action) => {
        let newState = { ...state }
        if (action.clean) {
            newState.hits = action.hits
        }
        else {
            newState.hits = new Map([...state.hits, ...action.hits])
        }
        newState.fetching = false
        newState.hasMore = action.hasMore
        newState.currentPage = action.currentPage
        return newState
    },
    [UPDATE_SCROLLED_DOWN]: (state, action) => {
        const newState = { ...state, scrolledDown: action.scrolledDown }
        return newState
    },
    [TOGGLE_IMAGE_PREVIEW_MODAL]: (state, action) => {
        const newState = { ...state, isImagePreviewOpen: !state.isImagePreviewOpen, imagePreviewUrl: action.imageUrl ? action.imageUrl : state.imagePreviewUrl }
        return newState
    },       
    [UPDATE_QUERY]: (state, action) => {
        return ({ ...state, searchQuery: action.query })
    },
    [SET_TAGS]: (state, action) => {
        return ({ ...state, tags: action.tags })
    },
    [SET_SEARCH_RESULT_VIEW]: (state, action) => {
        const newState = { ...state, searchView: action.view }
        return newState
    }
}