import { stateValueExtractor } from 'utils/'
import { crawlersModel } from 'models/'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import 'whatwg-fetch'

const UPDATE_CRAWLER = 'SETTINGS.UPDATE_CRAWLER'
const FILL_CRAWLERS = 'SETTINGS.FILL_CRAWLERS'
const UPDATE_NEW_CRAWLER = 'SETTINGS.UPDATE_NEW_CRAWLER'
const UPDATE_PIPELINE = 'SETTINGS.UPDATE_PIPELINE'

const REQUEST_SIZE = 10
const CRAWLER_LOG_SIZE = 10
const PIPELINE_LOG_SIZE = 30

export const loadCrawlers = () => {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            const urls = stateValueExtractor.getUrls(getState())
            const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

            dispatch(startLoadingIndicator())

            fetch(urls.ambarWebApiGetCrawlers(), {
                method: 'GET',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status === 200) { return resp.json() }
                    else { throw resp }
                })
                .then((data) => {
                    const crawlers = crawlersModel.fromApi(data)
                    dispatch(stopLoadingIndicator())
                    dispatch(fillCrawlers(crawlers))

                    crawlers.forEach((crawler, crawlerId, mapObject) => {
                        dispatch(loadCrawlerLog(crawler))
                    });
                })
                .catch((errorPayload) => {
                    dispatch(stopLoadingIndicator())
                    dispatch(handleError(errorPayload))
                    console.error('loadCrawlers', errorPayload)
                })
        })
    }
}

export const loadCrawlerLog = (crawler, preserveDisplayArgs = true) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        fetch(urls.ambarWebApiGetCrawlerLog(crawler.settings.uid, CRAWLER_LOG_SIZE), {
            method: 'GET',
            ...defaultSettings
        })
            .then((resp) => {
                if (resp.status == 200) { return resp.json() }
                else { throw resp }
            })
            .then((receivedLogs) => {
                if (preserveDisplayArgs) {
                    const crawlerId = crawler.settings.id
                    const crawlerFromState = getState().settingsPage.crawlers.get(crawlerId)
                    dispatch(updateCrawler({ ...crawler, log: { records: receivedLogs }, displayArgs: crawlerFromState.displayArgs }))
                }
                else {
                    dispatch(updateCrawler({ ...crawler, log: { records: receivedLogs } }))
                }
            })
            .catch((errorPayload) => {
                dispatch(updateCrawler({ ...crawler, log: { ...crawler.log } }))
                console.error('loadCrawlerLog', errorPayload)
            })
    }
}

export const loadPipelineLog = (pipeline) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        fetch(urls.ambarWebApiGetCrawlerLog('pipeline', PIPELINE_LOG_SIZE), {
            method: 'GET',
            ...defaultSettings
        })
            .then((resp) => {
                if (resp.status == 200) { return resp.json() }
                else { throw resp }
            })
            .then((data) => {
                dispatch(updatePipeline({ ...pipeline, log: { records: data } }))
            })
            .catch((errorPayload) => {
                dispatch(updatePipeline({ ...pipeline, log: { ...pipeline.log } }))
                console.error('loadPipelineLog', errorPayload)
            })
    }
}

export const startStopCrawler = (crawler, startStopCommand) => {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            const urls = stateValueExtractor.getUrls(getState())
            const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

            dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: true } }))

            fetch(urls.ambarWebApiStartStopCrawler(crawler.settings.id, startStopCommand), {
                method: 'PUT',
                ...defaultSettings
            })
                .then((resp) => {
                    if (resp.status === 200 || resp.status === 304) {
                        return fetch(urls.ambarWebApiGetCrawler(crawler.settings.id), {
                            method: 'GET',
                            ...defaultSettings
                        })
                    }
                    else { throw resp }
                })
                .then((resp) => {
                    if (resp.status === 200) { return resp.json() }
                    else { throw resp }
                })
                .then((data) => {
                    let crawlerFromApi = crawlersModel.fromApiSingle(data)
                    crawlerFromApi = { ...crawlerFromApi, log: { records: crawler.log.records } }
                    dispatch(loadCrawlerLog(crawlerFromApi))
                })
                .catch((errorPayload) => {
                    dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: false } }))
                    dispatch(handleError(errorPayload))
                    console.error('startStopCrawler', errorPayload)
                })
        })
    }
}

export const refreshCrawler = (crawlerId) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())
        const crawler = getState().settingsPage.crawlers.get(crawlerId)

        // Don't refresh crawler if any modal is open or crawler is deleted
        if (!crawler || crawler.displayArgs.isSettingsModalOpen || crawler.displayArgs.isDeleteModalOpen || crawler.meta.delete) {
            return
        }

        fetch(urls.ambarWebApiGetCrawler(crawler.settings.id), {
            method: 'GET',
            ...defaultSettings
        })
            .then((resp) => {
                if (resp.status === 200) { return resp.json() }
                else { throw resp }
            })
            .then((data) => {
                let crawlerFromApi = crawlersModel.fromApiSingle(data)
                crawlerFromApi = { ...crawlerFromApi, log: { records: crawler.log.records }, displayArgs: crawler.displayArgs }
                dispatch(loadCrawlerLog(crawlerFromApi))
            })
            .catch((errorPayload) => {
                if (errorPayload.status == 404) {
                    dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, delete: true } }))
                    console.warn('refreshCrawler', errorPayload)
                    return
                }

                dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: false } }))
                dispatch(handleError(errorPayload))
                console.error('refreshCrawler', errorPayload)
            })
    }
}

export const deleteCrawler = (crawler) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: true } }))

        fetch(urls.ambarWebApiDeleteCrawler(crawler.settings.id), {
            method: 'DELETE',
            ...defaultSettings
        })
            .then((resp) => {
                if (resp.status === 200) {
                    dispatch(updateCrawler({
                        ...crawler,
                        meta: { ...crawler.meta, delete: true },
                        displayArgs: { ...crawler.displayArgs, isDeleteModalOpen: false }
                    }))
                }
                else { throw resp }
            })
            .catch((errorPayload) => {
                dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: false, errorMessage: `Server error` } }))
                console.error('deleteCrawler', errorPayload)
            })
    }
}

export const setCrawlerUpdateJSON = (crawler, updateJSON) => {
    return (dispatch, getState) => {
        dispatch(updateCrawler({
            ...crawler, meta: {
                ...crawler.meta,
                updateJSON: updateJSON,
                updateJSONTouched: true
            }
        }))
    }
}

export const updateCrawlerFromUpdateJSON = (crawler) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: true } }))

        let crawlerSettings = null

        try { crawlerSettings = JSON.parse(crawler.meta.updateJSON) }
        catch (errorPayload) {
            dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: false, updateJSONTouched: false, errorMessage: 'Specified JSON is invalid!' } }))
            return
        }

        if (crawler.settings.id != crawlerSettings.id) {
            dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: false, updateJSONTouched: false, errorMessage: 'Please do not change crawler id!' } }))
            return
        }

        if ((crawlerSettings.credentials.password === '******') || (crawlerSettings.credentials.token === '******')) {
            dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: false, updateJSONTouched: false, errorMessage: 'Please provide password or token!' } }))
            return
        }

        fetch(urls.ambarWebApiUpdateCrawler(crawler.settings.id), {
            method: 'POST',
            ...defaultSettings,
            body: JSON.stringify(crawlerSettings)
        })
            .then((resp) => {
                if (resp.status === 200) {
                    return fetch(urls.ambarWebApiGetCrawler(crawler.settings.id), {
                        method: 'GET',
                        ...defaultSettings
                    })
                        .then((resp) => {
                            if (resp.status === 200) { return resp.json() }
                            else { throw `Unrecognized response code ${resp.status}` }
                        })
                }
                if (resp.status === 400 || resp.status === 500) {
                    return resp.json()
                        .then((json) => {
                            throw json.message
                        })
                }
                else { throw `Unrecognized response code ${resp.status}` }
            })
            .then((data) => {
                let updatedCrawler = crawlersModel.fromApiSingle(data)
                updatedCrawler = { ...updatedCrawler, displayArgs: { ...crawler.displayArgs, isSettingsModalOpen: false } }
                dispatch(loadCrawlerLog(updatedCrawler, false))
            })
            .catch((errorPayload) => {
                dispatch(updateCrawler({ ...crawler, meta: { ...crawler.meta, fetching: false, updateJSONTouched: false, errorMessage: errorPayload } }))
                console.error('updateCrawlerFromUpdateJSON', errorPayload)
            })
    }
}

export const setNewCrawlerJSON = (newCrawler, json) => {
    return (dispatch, getState) => {
        dispatch(updateNewCrawler({ ...newCrawler, json: json, jsonTouched: true }))
    }
}

export const createNewCrawler = (newCrawler) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(updateNewCrawler({ ...newCrawler, fetching: true }))

        let crawlerToCreate = {}

        try { crawlerToCreate = JSON.parse(newCrawler.json) }
        catch (errorPayload) {
            dispatch(updateNewCrawler({ ...newCrawler, fetching: false, errorMessage: 'Specified JSON is invalid!', jsonTouched: false }))
            return
        }

        const crawlers = getState().settingsPage.crawlers
        if (crawlers.has(crawlerToCreate.id)) {
            dispatch(updateNewCrawler({ ...newCrawler, fetching: false, errorMessage: 'Crawler with specified id already exists!', jsonTouched: false }))
            return
        }

        fetch(urls.ambarWebApiCreateCrawler(crawlerToCreate.id), {
            method: 'POST',
            ...defaultSettings,
            body: newCrawler.json
        })
            .then((resp) => {
                if ((resp.status === 201) || (resp.status === 200)) {
                    const crawlerJsonTemplate = getState()['core'].crawlerJsonTemplate
                    dispatch(updateNewCrawler({ ...newCrawler, json: crawlerJsonTemplate, fetching: false, jsonTouched: false, errorMessage: null, isCreateCrawlerModalOpen: false }))
                    dispatch(loadCrawlers())
                }
                else if (resp.status === 400) {
                    return resp.json()
                        .then(respJson => {
                            dispatch(updateNewCrawler({ ...newCrawler, fetching: false, errorMessage: `${respJson.message}`, jsonTouched: false }))
                        })
                }
                else { 
                    throw 'Server error' 
                }
            })
            .catch((errorPayload) => {
                dispatch(updateNewCrawler({ ...newCrawler, fetching: false, errorMessage: `Error: ${errorPayload}`, jsonTouched: false }))
                console.error('createNewCrawler', errorPayload)
            })
    }
}

export const setDeleteModalOpen = (crawler, isOpen) => {
    return (dispatch, getState) => {
        dispatch(updateCrawler({ ...crawler, displayArgs: { ...crawler.displayArgs, isDeleteModalOpen: isOpen } }))
    }
}

export const setSettingsModalOpen = (crawler, isOpen) => {
    return (dispatch, getState) => {
        dispatch(updateCrawler({ ...crawler, displayArgs: { ...crawler.displayArgs, isSettingsModalOpen: isOpen } }))
    }
}

export const setCreateCrawlerModalOpen = (newCrawler, isOpen) => {
    return (dispatch, getState) => {
        dispatch(updateNewCrawler({ ...newCrawler, isCreateCrawlerModalOpen: isOpen }))
    }
}

const fillCrawlers = (crawlers) => {
    return {
        type: FILL_CRAWLERS,
        crawlers
    }
}

const updateCrawler = (crawler) => {
    return {
        type: UPDATE_CRAWLER,
        crawler
    }
}

const updatePipeline = (pipeline) => {
    return {
        type: UPDATE_PIPELINE,
        pipeline
    }
}

const updateNewCrawler = (newCrawler) => {
    return {
        type: UPDATE_NEW_CRAWLER,
        newCrawler
    }
}

const ACTION_HANDLERS = {
    [FILL_CRAWLERS]: (state, action) => {
        let newState = { ...state }
        newState.crawlers = action.crawlers
        return newState
    },
    [UPDATE_CRAWLER]: (state, action) => {
        let newState = { ...state }
        newState.crawlers = new Map(state.crawlers)
        if (action.crawler.meta.delete) { newState.crawlers.delete(action.crawler.settings.id) }
        else { newState.crawlers.set(action.crawler.settings.id, action.crawler) }
        return newState
    },
    [UPDATE_NEW_CRAWLER]: (state, action) => {
        return { ...state, newCrawler: action.newCrawler }
    },
    [UPDATE_PIPELINE]: (state, action) => {
        return { ...state, pipeline: action.pipeline }
    }
}

const initialState = {
    crawlers: new Map(),
    newCrawler: { json: '', fetching: false, errorMessage: undefined, isCreateCrawlerModalOpen: false },
    pipeline: { log: { records: [] } }
}

export default function settingsPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}