import moment from 'moment'
import { dates, urls } from 'utils/'

const getCawlerUpdateJson = (crawler) => JSON.stringify({
    ...crawler,
    state: undefined,
    is_deleted: undefined,
    _id: undefined,
    api_url: undefined,
    is_removed: undefined,
}, null, 2)

const parseCrawlerFromApi = (apiResp) => ({
    settings: {
        ...apiResp,
        state: undefined,
        is_deleted: undefined,
        _id: undefined,
        api_url: undefined,
        is_removed: undefined
    },
    meta: {
        fetching: false,
        state: apiResp.state,
        updateJSONTouched: false,
        delete: false,
        updateJSON: getCawlerUpdateJson(apiResp)
    },
    log: {
        fetching: false,
        records: []
    },
    displayArgs: {
        isDeleteModalOpen: false,
        isSettingsModalOpen: false
    }
})

export const fromApi = (resp) => {
    let crawlers = new Map()
    resp.map((crawlerFromApi) => {
        const crawler = parseCrawlerFromApi(crawlerFromApi)
        crawlers.set(crawler.settings.id, crawler)
    })
    return crawlers
}

export const fromApiSingle = (resp) => parseCrawlerFromApi(resp)