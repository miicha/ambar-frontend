import { urls, titles, stateValueExtractor } from 'utils'
import { push } from 'react-router-redux'
import { sourcesModel } from 'models/'
import { performSearch } from 'routes/SearchPage/modules/SearchPage'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import * as Regexes from 'utils/regexes'

import 'whatwg-fetch'

export const START_LOADING_INDICATOR = 'MAIN.START_LOADING_INDICATOR'
export const STOP_LOADING_INDICATOR = 'MAIN.STOP_LOADING_INDICATOR'
export const CHANGE_SIDE_MENU_STATE = 'MAIN.CHANGE_SIDE_MENU_STATE'
export const UPDATE_HEADER = 'MAIN.UPDATE_HEADER'
export const UPDATE_QUERY = 'MAIN.UPDATE_QUERY'
export const SET_SOURCES = 'MAIN.SET_SOURCES'
export const SET_IS_REFINE_SEARCH_MODAL_OPEN = 'MAIN.SET_IS_REFINE_SEARCH_MODAL_OPEN'
export const TOGGLE_SOURCE_SELECTED = 'MAIN.TOGGLE_SOURCE_SELECTED'
const CHANGE_FIELD = 'MAIN.CHANGE_FIELD'

export const setQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(updateQuery(query))
        dispatch(setSources(sourcesModel.fromSources(getState()['global'].sources, query)))
    }
}

const setQueryFromGetParam = () => {
    return (dispatch, getState) => {
        const query = getState().router.locationBeforeTransitions.query.query
        const doSearch = getState().router.locationBeforeTransitions.query.doSearch

        const safeQuery = !query ? '' : query

        dispatch(updateQuery(safeQuery))

        if (doSearch) {
            dispatch(performSearch(0, safeQuery))
        }
    }
}

export const performSearchByPathToFile = (path) => {
    return (dispatch, getState) => {
        let query = getState()['global'].query.replace(Regexes.FILE_NAME_QUERY_REGEX, '')
        query = `${query} filename:${path}`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const performSearchByAuthor = (author) => {
    return (dispatch, getState) => {
        let query = getState()['global'].query.replace(Regexes.AUTHOR_QUERY_REGEX, '')
        author = author.replace(' ', '?')
        query = `${query} author:${author}`
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const performSearchByQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export const setHeader = (header, showSearchInput = false, searchQuery = '') => {
    return (dispatch, getState) => {
        dispatch(updateHeader(header, showSearchInput))
        dispatch(stopLoadingIndicator())

        if (showSearchInput) {
            dispatch(setQueryFromGetParam())
        }
    }
}

export const toggleSideMenu = () => {
    return (dispatch, getState) => {
        const isSideMenuOpen = getState().global.isSideMenuOpen
        dispatch(changeSideMenuState(!isSideMenuOpen))
    }
}

export const changeLocation = (location) => {
    return (dispatch, getState) => {
        const currentLocation = getState()['router'].locationBeforeTransitions.pathname
        if (currentLocation !== location) {
            dispatch(startLoadingIndicator())
            dispatch(push(location))
        }

        dispatch(toggleSideMenu())
    }
}

export const loadSources = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        const query = getState()['global'].query

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

export const toggleRefineSearchModal = () => {
    return (dispatch, getState) => {
        const isRefineSearchModalOpen = !getState()['global'].isRefineSearchModalOpen
        dispatch(setIsRefineSearchModalOpen(isRefineSearchModalOpen))
        if (!isRefineSearchModalOpen) {
            const query = getState()['global'].query
            dispatch(performSearch(0, query))
        }
    }
}

export const toggleSourceSelected = (sourceId) => {
    return (dispatch, getState) => {
        dispatch(updateSourceSelected(sourceId))
    }
}

export const performSearchBySource = (sourceId) => {
    return (dispatch, getState) => {
        dispatch(setSources(sourcesModel.fromSourcesDisabled(getState()['global'].sources)))
        dispatch(updateSourceSelected(sourceId))
        const query = getState()['global'].query
        dispatch(setQuery(query))
        dispatch(performSearch(0, query))
    }
}

export function startLoadingIndicator() {
    return {
        type: START_LOADING_INDICATOR
    }
}

export function stopLoadingIndicator() {
    return {
        type: STOP_LOADING_INDICATOR
    }
}

export const toggleRateUsModal = (value) => {
    return (dispatch, getState) => dispatch(changeField('showRateUsModal', value))
}

function updateHeader(header, showSearchInput) {
    return {
        type: UPDATE_HEADER,
        header,
        showSearchInput
    }
}

function changeSideMenuState(isSideMenuOpen) {
    return {
        type: CHANGE_SIDE_MENU_STATE,
        isSideMenuOpen
    }
}

function updateQuery(query) {
    return {
        type: UPDATE_QUERY,
        query
    }
}

const setSources = (sources) => {
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

const updateSourceSelected = (sourceId) => {
    return {
        type: TOGGLE_SOURCE_SELECTED,
        sourceId
    }
}

const changeField = (fieldName, value) => {
    return {
        type: CHANGE_FIELD,
        fieldName,
        value
    }
}

const ACTION_HANDLERS = {
    [START_LOADING_INDICATOR]: (state, action) => {
        return ({ ...state, fetching: true, isError: false })
    },
    [STOP_LOADING_INDICATOR]: (state, action) => {
        return ({ ...state, fetching: false })
    },
    [CHANGE_SIDE_MENU_STATE]: (state, action) => {
        return ({ ...state, isSideMenuOpen: action.isSideMenuOpen })
    },
    [UPDATE_HEADER]: (state, action) => {
        return ({ ...state, header: action.header, showSearchInput: action.showSearchInput })
    },
    [UPDATE_QUERY]: (state, action) => {
        return ({ ...state, query: action.query })
    },
    [SET_SOURCES]: (state, action) => {
        const newState = { ...state, sources: action.sources }
        return newState
    },
    [TOGGLE_SOURCE_SELECTED]: (state, action) => {
        const sourceId = action.sourceId
        const sources = new Map(state.sources)
        const source = sources.get(sourceId)
        sources.set(sourceId, { ...source, selected: !source.selected })

        const selectedSourceIdList = Array.from(sources.values()).filter(source => source.selected).map(source => source.id)
        let query = state.query
        query = query.replace(Regexes.SOURCE_QUERY_REGEX, '').trim()

        if (selectedSourceIdList.length > 0 && selectedSourceIdList.length != sources.size) {
            query = `${query} source:${selectedSourceIdList.join(',')}`
        }

        const newState = { ...state, sources: sources, query: query }

        return newState
    },
    [SET_IS_REFINE_SEARCH_MODAL_OPEN]: (state, action) => {
        const newState = { ...state, isRefineSearchModalOpen: action.isRefineSearchModalOpen }
        return newState
    },
    [CHANGE_FIELD]: (state, action) => {
        const newState = {...state}
        newState[action.fieldName] = action.value

        return newState
    }
}

const initial_state = {
    query: '',
    isSideMenuOpen: false,
    fetching: true,
    header: 'Loading...',

    showSearchInput: false,
    sources: new Map(),
    isRefineSearchModalOpen: false,

    showRateUsModal: false
}

export default function mainLayoutReducer(state = initial_state, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}



