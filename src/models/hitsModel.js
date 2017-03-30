import moment from 'moment'
import { dates, urls } from 'utils/'

const highlightMetaInHit = (hit) => {
    if (hit.highlight && hit.highlight['meta.full_name']) {
        const metaHighlight = hit.highlight['meta.full_name']
        hit.meta.forEach((meta, idx) => {
            if (metaHighlight.indexOf(meta.full_name) != -1) {
                meta.full_name = `<em>${meta.full_name}</em>`
            }
        })
    }
}

export const fromApi = (resp) => {
    let hits = new Map()
    resp.hits.forEach((hit) => {
        if (hit.meta && hit.meta.length > 0) {
            highlightMetaInHit(hit)
            hits.set(hit.sha256, {
                ...hit,
                fetching: false
            })
        }
    })
    return hits
}

