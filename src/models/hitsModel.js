import moment from 'moment'
import { dates, urls } from 'utils/'

const highlightHit = (hit) => {
    if (hit.highlight && hit.highlight['meta.full_name']) {
        const metaHighlight = hit.highlight['meta.full_name']        
        hit.meta.forEach((meta, idx) => {
            if (metaHighlight.indexOf(meta.full_name) != -1) {
                meta.full_name = `<em>${meta.full_name}</em>`
            }
        })
    }
    if (hit.highlight && hit.highlight['meta.source_id']) {
        const metaHighlight = hit.highlight['meta.source_id']        
        hit.meta.forEach((meta, idx) => {
            if (metaHighlight.indexOf(meta.source_id) != -1) {
                meta.source_id = `<em>${meta.source_id}</em>`
            }
        })
    }
    if (hit.highlight && hit.highlight['content.author']) {
        hit.content.author = `<em>${hit.content.author}</em>`
    }
}

export const fromApi = (resp) => {
    let hits = new Map()
    resp.hits.forEach((hit) => {
        if (hit.meta && hit.meta.length > 0) {
            highlightHit(hit)
            hits.set(hit.sha256, {
                ...hit,
                fetching: false
            })
        }
    })
    return hits
}

