import React, { Component } from 'react'
import { files } from 'utils/'
import classes from './SearchResultMetaDescriptionLine.scss'

const SearchResultMetaDescriptionLine = (props) => {
    const { content, meta, searchSelectedSource } = props
    return (
        <div className={classes.searchResultMetaDescriptionLine}>
            {content.author && <span>Author: {content.author}&nbsp;</span>}
            {meta.updated_datetime && <span>Modified: {meta.updated_datetime}&nbsp;</span>}
            {meta.indexed_datetime && <span>Indexed: {`${meta.indexed_datetime} UTC`}&nbsp;</span>}
            {meta.source_id && <div className={classes.divWithTooltip}>
                <span
                    onTouchTap={() => searchSelectedSource(meta.source_id)}
                    className={classes.clickableSpan}>
                    Source: {meta.source_id}&nbsp;
                </span>
                <span
                    className={classes.tooltipMessage}>
                    Search source {meta.source_id}
                </span>
            </div>}
            {content.size && <span>Size: {files.formatFileSize(content.size)}</span>}
        </div>
    )
}

SearchResultMetaDescriptionLine.propTypes = {
    content: React.PropTypes.object.isRequired,
    meta: React.PropTypes.object.isRequired,
    searchSelectedSource: React.PropTypes.func.isRequired
}

export default SearchResultMetaDescriptionLine




