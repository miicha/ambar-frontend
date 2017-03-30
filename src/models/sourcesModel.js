import * as Regexes from 'utils/regexes'

export const fromApi = (resp, query) => {
    const sourcesMatch = query.match(Regexes.SOURCE_QUERY_REGEX)
    const selectedSources = sourcesMatch && sourcesMatch[3] ? sourcesMatch[3].split(',').map(source => source.trim()) : []

    let sources = new Map()
    resp.forEach((source) => {
        sources.set(source.id, { ...source, selected: selectedSources.includes(source.id) || selectedSources.length == 0 })
    })
    return sources
}

export const fromSources = (oldSources, query) => {
    const sourcesMatch = query.match(Regexes.SOURCE_QUERY_REGEX)
    const selectedSources = sourcesMatch && sourcesMatch[3] ? sourcesMatch[3].split(',').map(source => source.trim()) : []

    let sources = new Map()
    oldSources.forEach((source) => {
        sources.set(source.id, { ...source, selected: selectedSources.includes(source.id) || selectedSources.length == 0 })
    })
    return sources
}

export const fromSourcesDisabled = (oldSources) => {
    let sources = new Map()
    oldSources.forEach((source) => {
        sources.set(source.id, { ...source, selected: false })
    })
    return sources
}