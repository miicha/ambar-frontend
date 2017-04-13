import React, { Component } from 'react'
import { files } from 'utils/'
import classes from './SearchResultMetaDescriptionLine.scss'

const EM_TAG_REGEX = /<[\/]{0,1}em>/gim

const SearchResultMetaDescriptionLine = (props) => {
    const { content, meta, performSearchBySource, performSearchByAuthor } = props

    return (
        <div className={classes.searchResultMetaDescriptionLine}>
            {content.author && <div
                onTouchTap={() => performSearchByAuthor(content.author.replace(EM_TAG_REGEX, ''))}
                className={EM_TAG_REGEX.test(content.author) ? classes.clickableSpanHighlighted : classes.clickableSpan}>
                Author: {content.author.replace(EM_TAG_REGEX, '')}&nbsp;
                </div>}
            {meta.updated_datetime && <span>Modified: {meta.updated_datetime}&nbsp;</span>}
            {meta.indexed_datetime && <span>Indexed: {`${meta.indexed_datetime} UTC`}&nbsp;</span>}
            {meta.source_id && <div
                onTouchTap={() => performSearchBySource(meta.source_id.replace(EM_TAG_REGEX, ''))}
                className={EM_TAG_REGEX.test(meta.source_id) ? classes.clickableSpanHighlighted : classes.clickableSpan}>
                Source: {meta.source_id.replace(EM_TAG_REGEX, '')}&nbsp;
                </div>}
            {content.size && <span>Size: {files.formatFileSize(content.size)}</span>}
        </div>
    )
}

SearchResultMetaDescriptionLine.propTypes = {
    content: React.PropTypes.object.isRequired,
    meta: React.PropTypes.object.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired
}

export default SearchResultMetaDescriptionLine




