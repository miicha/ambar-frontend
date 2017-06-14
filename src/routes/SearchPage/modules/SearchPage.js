import { stateValueExtractor } from 'utils/'
import { hitsModel, sourcesModel } from 'models/'
import { titles, analytics, FormDataPolyfill } from 'utils'
import { handleError, showInfo } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import * as Regexes from 'utils/regexes'
import 'whatwg-fetch'

export const FILL_HITS = 'SEARCH.FILL_HITS'
export const UPDATE_SCROLLED_DOWN = 'SEARCH.UPDATE_SCROLLED_DOWN'
export const TOGGLE_IMAGE_PREVIEW_MODAL = 'SEARCH.TOGGLE_IMAGE_PREVIEW_MODAL'
export const SET_SOURCES = 'SEARCH.SET_SOURCES'
export const SET_IS_REFINE_SEARCH_MODAL_OPEN = 'SEARCH.SET_IS_REFINE_SEARCH_MODAL_OPEN'
export const TOGGLE_SOURCE_SELECTED = 'SEARCH.TOGGLE_SOURCE_SELECTED'
export const UPDATE_QUERY = 'SEARCH.UPDATE_QUERY'
export const SET_TAGS = 'SEARCH.SET_TAGS'

const REQUEST_SIZE = 10

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

export const loadSourcesAndTags = () => {
    return (dispatch, getState) => {
        dispatch(loadSources())
        dispatch(loadTags())
    }
}

export const loadSources = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        //Do nothing if Search page hasn't been loaded yet
        if (!getState()['searchPage']) {
            return
        }

        const query = getState()['searchPage'].searchQuery

        dispatch(startLoadingIndicator())

        fetch(urls.ambarWebApiGetSources(), {
            method: 'GET',
            ...defaultSettings
        })
            .then(resp => {
                if (resp.status == 200) {
                    return resp.json()
                }
                else { throw resp }
            })
            .then(sources => {
                const sourcesMap = sourcesModel.fromApi(sources, query)
                dispatch(setSources(sourcesMap))
                dispatch(stopLoadingIndicator())
            })
            .catch((errorPayload) => {
                dispatch(stopLoadingIndicator())
                dispatch(handleError(errorPayload))
                console.error('loadSources', errorPayload)
            })

        dispatch(stopLoadingIndicator())
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

export const toggleRefineSearchModal = () => {
    return (dispatch, getState) => {
        const isRefineSearchModalOpen = !getState()['searchPage'].isRefineSearchModalOpen
        dispatch(setIsRefineSearchModalOpen(isRefineSearchModalOpen))
        if (!isRefineSearchModalOpen) {
            const query = getState()['searchPage'].searchQuery
            dispatch(performSearch(0, query))
        }
    }
}

export const toggleSourceSelected = (sourceId) => {
    return (dispatch, getState) => {
        dispatch(updateSourceSelected(sourceId))
    }
}

export const setQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(updateQuery(query))
        dispatch(setSources(sourcesModel.fromSources(getState()['searchPage'].sources, query)))
    }
}

export const setTags = (tags) => {
    return {
        type: SET_TAGS,
        tags
    }
}

export const setSources = (sources) => {
    return {
        type: SET_SOURCES,
        sources
    }
}

const setIsRefineSearchModalOpen = (isRefineSearchModalOpen) => {
    return {
        type: SET_IS_REFINE_SEARCH_MODAL_OPEN,
        isRefineSearchModalOpen
    }
}

export const updateSourceSelected = (sourceId) => {
    return {
        type: TOGGLE_SOURCE_SELECTED,
        sourceId
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
    [SET_IS_REFINE_SEARCH_MODAL_OPEN]: (state, action) => {
        const newState = { ...state, isRefineSearchModalOpen: action.isRefineSearchModalOpen }
        return newState
    },
    [TOGGLE_SOURCE_SELECTED]: (state, action) => {
        const sourceId = action.sourceId
        const sources = new Map(state.sources)
        const source = sources.get(sourceId)
        sources.set(sourceId, { ...source, selected: !source.selected })

        const selectedSourceIdList = Array.from(sources.values()).filter(source => source.selected).map(source => source.id)
        let query = state.searchQuery
        query = query.replace(Regexes.SOURCE_QUERY_REGEX, '').trim()

        if (selectedSourceIdList.length > 0 && selectedSourceIdList.length != sources.size) {
            query = `${query} source:${selectedSourceIdList.join(',')}`
        }

        const newState = { ...state, sources: sources, searchQuery: query }

        return newState
    },
    [SET_SOURCES]: (state, action) => {
        const newState = { ...state, sources: action.sources }
        return newState
    },
    [UPDATE_QUERY]: (state, action) => {
        return ({ ...state, searchQuery: action.query })
    },
    [SET_TAGS]: (state, action) => {
        return ({ ...state, tags: action.tags })
    }
}