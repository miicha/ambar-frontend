import React, { Component } from 'react'
import { LoadingIndicator } from 'components/BasicComponents'

import SearchResultMetaDescriptionLine from '../SearchResultMetaDescriptionLine'
import SearchResultMetaFullNameLine from '../SearchResultMetaFullNameLine'

import classes from './SearchResultRow.scss'

import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import MediaQuery from 'react-responsive'
import Paper from 'material-ui/Paper'
import { Divider, FlatButton } from 'material-ui'
import DownloadIcon from 'material-ui/svg-icons/file/cloud-download'
import LinearProgress from 'material-ui/LinearProgress'

const getHashCode = (str) => { 
    let hash = 0;
    
    if (str.length == 0) {
        return hash
    }
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash<<5)-hash) + char
        hash = hash & hash // Convert to 32bit integer
    }

    return hash
}

const getFileAvatarByMeta = (meta) => {
    const colors = [
       '#EF5350', '#E53935', '#D81B60', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#2196F3', '#43A047', '#EF6C00', '#A1887F', '#78909C', '#FF4081', '#3949AB']
    
    let extension = (typeof meta.extension !== 'string') && meta.extension.length && meta.extension.length > 0 
            ? meta.extension[0]
            : meta.extension
    extension = extension ? extension.replace('.', '') : ''

    return <Avatar 
        size={38}        
        style={{
            'font-size': '12px',
            'text-transform': 'uppercase',
            'cursor': 'default'            
        }}      
        backgroundColor={colors[getHashCode(extension) % colors.length]}>{extension}</Avatar>   
}

class SearchResultRow extends Component {
    startLoadingHighlight() {
        const { searchQuery, hit: { sha256: sha256 }, loadHighlight } = this.props
        loadHighlight(sha256, searchQuery)
    }    

    componentDidMount() {
    }

    render() {
        const { 
            hit: { 
                fetching: fetching,
                highlight: highlight,
                meta: meta,
                content: content,
                sha256: sha256 }, 
            searchQuery,
            loadHighlight,
            urls,
            performSearchBySource,
            performSearchByAuthor,
            performSearchByPathToFile,
            toggleImagePreview } = this.props

        const EM_TAG_REGEX = /<[\/]{0,1}em>/gim

        const hasMoreThanOneMeta = meta.length > 1 ? true : false

        const sortedMeta = meta.sort((a,b) => EM_TAG_REGEX.test(b.full_name) ? 1 : -1)
        const mainMeta = sortedMeta[0]
        const secondaryMetaList = sortedMeta.slice(1)

        const contentHighlight = highlight && highlight['content.text'] ? highlight['content.text'] : undefined
        return (
            <Paper zDepth={1} className={classes.searchResultRowCard}>
                <Card>
                    <CardHeader
                        style={{ overflowX: 'hidden' }}
                        title={<span className={classes.searchResultRowCardHeaderTitle} dangerouslySetInnerHTML={{ __html: mainMeta.short_name }} />}
                        avatar={getFileAvatarByMeta(mainMeta)}
                        subtitle={<SearchResultMetaFullNameLine meta={mainMeta} performSearchByPathToFile={performSearchByPathToFile} />}
                        actAsExpander={hasMoreThanOneMeta}
                        showExpandableButton={hasMoreThanOneMeta}
                    />
                    {hasMoreThanOneMeta && secondaryMetaList.map((secMeta, idx) =>
                        <CardText key={idx} expandable={true}>
                            <SearchResultMetaFullNameLine meta={secMeta} performSearchByPathToFile={performSearchByPathToFile} />
                            <SearchResultMetaDescriptionLine searchQuery={searchQuery} content={content} meta={secMeta} performSearchByAuthor={performSearchByAuthor} performSearchBySource={performSearchBySource} />
                        </CardText>
                    )}
                    <div className={classes.searchResultRowCardTextContainer}>
                        <div className={classes.searchResultRowCardTextDiv}>
                            {fetching && <CardText className={classes.searchResultRowCardText}>
                                <LoadingIndicator />
                            </CardText>}
                            {!fetching && content.state != 'processed' &&
                                <CardText className={classes.searchResultRowCardText}>
                                    <LinearProgress mode="indeterminate"/>
                                </CardText>
                            }
                            {!fetching && content.state === 'processed' && !contentHighlight &&
                                <CardText className={classes.searchResultRowCardText} onMouseEnter={() => this.startLoadingHighlight()}>
                                    <span className={classes.blurred}>Если у общества нет цветовой дифференциации штанов - то у общества</span><br />
                                    <span className={classes.blurred}>нет цели, а если нет цели - то...</span>
                                </CardText>}
                            {!fetching && contentHighlight && contentHighlight.map((hl, idx) =>
                                <CardText key={idx}
                                    className={idx != contentHighlight.length - 1 ? classes.searchResultRowCardTextWithBorder : classes.searchResultRowCardText}
                                    dangerouslySetInnerHTML={{ __html: hl }}
                                />)}
                        </div>

                        {!fetching && contentHighlight && content.thumb_available &&
                            <MediaQuery query='(min-width: 1024px)'>
                                <div className={classes.searchResultRowCardTextThumbnailContainer} >
                                    <img onTouchTap={() => { toggleImagePreview(urls.ambarWebApiGetThumbnail(sha256)) }}
                                        className={classes.searchResultRowCardTextThumbnailImage}
                                        src={urls.ambarWebApiGetThumbnail(sha256)} />
                                </div>
                            </MediaQuery>}
                    </div>
                    <CardActions className={classes.searchResultRowCardFooter}>
                        <FlatButton icon={<DownloadIcon />} label="Download" primary={true} onTouchTap={() => { window.open(urls.ambarWebApiGetFile(mainMeta.download_uri)) }} />
                        <SearchResultMetaDescriptionLine searchQuery={searchQuery} content={content} meta={mainMeta} performSearchByAuthor={performSearchByAuthor} performSearchBySource={performSearchBySource} />
                    </CardActions>
                </Card>
            </Paper>
        )
    }
}


SearchResultRow.propTypes = {
    hit: React.PropTypes.object.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    loadHighlight: React.PropTypes.func.isRequired,
    urls: React.PropTypes.object.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    toggleImagePreview: React.PropTypes.func.isRequired
}

export default SearchResultRow




