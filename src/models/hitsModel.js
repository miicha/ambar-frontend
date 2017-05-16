import moment from 'moment'
import { dates, urls } from 'utils/'

const highlightHit = (hit) => {
    hit.meta.forEach((meta, idx) => {
        if (meta.highlight && meta.highlight.full_name) {
            meta.full_name = `<em>${meta.full_name}</em>`
        }
        if (meta.highlight && meta.highlight.source_id) {
            meta.source_id = `<em>${meta.source_id}</em>`
        }
    })
    if (hit.highlight && hit.highlight['author']) {
        hit.content.author = `<em>${hit.content.author}</em>`
    }
    if (hit.highlight && hit.highlight.text) {
        hit.highlight['content.text'] = hit.highlight.text
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

