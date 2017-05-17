import React, { Component } from 'react'
import { files } from 'utils/'
import classes from './SearchResultMetaDescriptionLine.scss'
import moment from 'moment'

const WHEN_QUERY = /((^|\s)when:)((today)|(yesterday)|(thisweek)|(thismonth)|(thisyear))/im
const SIZE_QUERY = /((^|\s)size(>|<)[=]{0,1})([0-9]*)([k|m]{0,1})/im

const SearchResultMetaDescriptionLine = (props) => {
    const { searchQuery, content, meta, performSearchBySource, performSearchByAuthor } = props

    const authorHighlighted = content.highlight && content.highlight.author
    const author = content.author

    const sourceIdHighlighted = meta.highlight && meta.highlight.source_id
    const sourceId = meta.source_id

    const updatedDatetimeHighlighted = searchQuery ? WHEN_QUERY.test(searchQuery) : false
    const updatedDatetime = meta.updated_datetime

    const sizeHighlighted = content.size ? SIZE_QUERY.test(searchQuery) : false
    const size = content.size ? content.size : null

    return (
        <div className={classes.searchResultMetaDescriptionLine}>
            {author && <div
                onTouchTap={() => performSearchByAuthor(author)}
                className={authorHighlighted ? classes.clickableSpanHighlighted : classes.clickableSpan}>
                Author: {author}
            </div>}
            {updatedDatetime && <div className={updatedDatetimeHighlighted ? classes.spanHighlighted : classes.span}>Last modified: {moment().to(updatedDatetime)}</div>}
            {sourceId && <div
                onTouchTap={() => performSearchBySource(sourceId)}
                className={sourceIdHighlighted ? classes.clickableSpanHighlighted : classes.clickableSpan}>
                Source: {sourceId}
            </div>}
            {size && <div className={sizeHighlighted ? classes.spanHighlighted : classes.span}>Size: {files.formatFileSize(size)}</div>}
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




