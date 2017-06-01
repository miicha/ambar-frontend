import React, { Component } from 'react'
import { CardHeader } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import { SearchResultMetaFullNameLine } from './components/'
import { files } from 'utils/'
import moment from 'moment'

import classes from './SearchResultCardHeader.scss'

const getHashCode = (str) => {
    let hash = 0;

    if (str.length == 0) {
        return hash
    }

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }

    return hash
}

const getExtension = (meta) => {
    let extension = (typeof meta.extension !== 'string') && meta.extension.length && meta.extension.length > 0
        ? meta.extension[0]
        : meta.extension
    return extension ? extension.replace('.', '').toLowerCase() : ''
}

const getFileAvatarByMeta = (meta, searchFunction) => {
    const colors = [
        '#EF5350', '#E53935', '#D81B60', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#2196F3', '#43A047', '#EF6C00', '#A1887F', '#78909C', '#FF4081', '#3949AB']

    let extension = getExtension(meta)

    const avatarStyle = {
        fontSize: '12px',
        textTransform: 'uppercase',
        cursor: 'default'
    }

    return <Avatar
        className={classes.resultAvatar}
        onTouchTap={() => searchFunction(`*.${extension}`)}
        size={38}
        style={avatarStyle}
        backgroundColor={colors[getHashCode(extension) % colors.length]}>{extension}</Avatar>
}

const getHumanizedTime = (date) => {
    const start = moment.utc()
    const end = moment.utc(date)

    let diff = moment.duration(end.diff(start))
    if (Math.floor(Math.abs(diff.asDays())) > 6) {
        return end.format('DD.MM.YYYY') 
    }

    return diff.humanize(true)
}

const SIZE_QUERY = /((^|\s)size(>|<)[=]{0,1})([0-9]*)([k|m]{0,1})/im
const WHEN_QUERY = /((^|\s)when:)((today)|(yesterday)|(thisweek)|(thismonth)|(thisyear))/im

const HighlightedSpan = ({children, isHighlighted, ...otherProps}) => {
    return isHighlighted 
    ? <span style={{backgroundColor: '#fff176'}} {...otherProps}>{children}</span>
    : <span {...otherProps}>{children}</span>
}

const SearchResultCardHeader = (props) => {

    const { meta, content, searchQuery, performSearchByPathToFile, performSearchByAuthor, performSearchBySource } = props

    const headerContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingBottom: '5px',
        fontSize: '12px',
        color: '#9E9E9E'
    }

    const sizeHighlighted = content.size ? SIZE_QUERY.test(searchQuery) : false
    const size = content.size ? content.size : null     

    const updatedDatetimeHighlighted = searchQuery ? WHEN_QUERY.test(searchQuery) : false
    const updatedDatetime = meta.updated_datetime
    const displayedUpdatedDateTime = updatedDatetime && getHumanizedTime(updatedDatetime) 

    const authorHighlighted = content.highlight && content.highlight.author
    const author = content.author

    const sourceIdHighlighted = meta.highlight && meta.highlight.source_id
    const sourceId = meta.source_id

    return (
        <div style={headerContainerStyle}>
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    {getFileAvatarByMeta(meta, performSearchByPathToFile)}
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <span
                                className={classes.metaShortName}
                                dangerouslySetInnerHTML={{ __html: meta.short_name }}
                            />
                            {size && <span>&nbsp;&ndash;&nbsp;<HighlightedSpan isHighlighted={sizeHighlighted}>{files.formatFileSize(size)}</HighlightedSpan></span>}
                            <SearchResultMetaFullNameLine
                                meta={meta}
                                performSearchByPathToFile={performSearchByPathToFile}
                            />
                            <span>
                                {author && <span style={{paddingRight: '3px'}}>by&nbsp;
                                    <HighlightedSpan
                                        className={classes.clickableMeta}
                                        onTouchTap={() => performSearchByAuthor(`${author}*`)}
                                        isHighlighted={authorHighlighted}>
                                        {author}
                                    </HighlightedSpan>
                                </span>}
                                {sourceId && <span>from&nbsp;
                                    <HighlightedSpan
                                        className={classes.clickableMeta}
                                        onTouchTap={() => performSearchBySource(sourceId)}
                                        isHighlighted={sourceIdHighlighted}>
                                        {sourceId}
                                    </HighlightedSpan>
                                </span>}
                            </span>                            
                        </div>
                    </div>
                </div>
            </div>
            <div>{updatedDatetime && <span>Last modified: <HighlightedSpan isHighlighted={updatedDatetimeHighlighted}>{displayedUpdatedDateTime}</HighlightedSpan></span>}</div>
        </div>
    )
}

SearchResultCardHeader.propTypes = {
    meta: React.PropTypes.object.isRequired,
    content: React.PropTypes.object.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired
}

export default SearchResultCardHeader




