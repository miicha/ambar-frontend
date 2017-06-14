import moment from 'moment'
import { dates, urls } from 'utils/'

export const fromApi = (resp) => {
    let hits = new Map()
    resp.hits.forEach((hit) => {
        hits.set(hit.file_id, {
            ...hit,
            fetching: false
        })
    })
    return hits
}

export const contentHighlightFromApi = (resp) => {
    return resp.highlight
}
