import React, { Component } from 'react'
import { files } from 'utils/'
import classes from './SearchResultMetaDescriptionLine.scss'

const EM_TAG_REGEX = /<[\/]{0,1}em>/gim
const WHEN_QUERY = /((^|\s)when:)((today)|(yesterday)|(thisweek)|(thismonth)|(thisyear))/im

const SearchResultMetaDescriptionLine = (props) => {
    const { searchQuery, content, meta, performSearchBySource, performSearchByAuthor } = props

    const authorHighlighted = content.author ? EM_TAG_REGEX.test(content.author) : false
    const author = content.author ? content.author.replace(EM_TAG_REGEX, '') : null

    const sourceIdHighlighted = meta.source_id ? EM_TAG_REGEX.test(meta.source_id) : false
    const sourceId = meta.source_id ? meta.source_id.replace(EM_TAG_REGEX, '') : null

    const updatedDatetimeHighlighted = searchQuery ? WHEN_QUERY.test(searchQuery) : false
    const updatedDatetime = meta.updated_datetime ? meta.updated_datetime : null

    const indexedDatetime = meta.indexed_datetime ? meta.indexed_datetime : null

    const size = content.size ? content.size : null

    return (
        <div className={classes.searchResultMetaDescriptionLine}>
            {author && <div
                onTouchTap={() => performSearchByAuthor(author)}
                className={authorHighlighted ? classes.clickableSpanHighlighted : classes.clickableSpan}>
                Author: {author}
            </div>}
            {updatedDatetime && <div className={updatedDatetimeHighlighted ? classes.spanHighlighted : classes.span}>Modified: {updatedDatetime}</div>}
            {indexedDatetime && <div className={classes.span}>Indexed: {`${indexedDatetime} UTC`}</div>}
            {sourceId && <div
                onTouchTap={() => performSearchBySource(sourceId)}
                className={sourceIdHighlighted ? classes.clickableSpanHighlighted : classes.clickableSpan}>
                Source: {sourceId}
            </div>}
            {size && <div className={classes.span}>Size: {files.formatFileSize(size)}</div>}
        </div>
    )
}

SearchResultMetaDescriptionLine.propTypes = {
    content: React.PropTypes.object.isRequired,
    meta: React.PropTypes.object.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired
}

export default SearchResultMetaDescriptionLine




