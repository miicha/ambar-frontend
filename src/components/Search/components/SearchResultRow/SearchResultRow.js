import React, { Component } from 'react'
import { LoadingIndicator } from 'components/BasicComponents'

import SearchResultMetaDescriptionLine from '../SearchResultMetaDescriptionLine'
import SearchResultMetaFullNameLine from '../SearchResultMetaFullNameLine'

import classes from './SearchResultRow.scss'

import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import MediaQuery from 'react-responsive'
import Paper from 'material-ui/Paper'
import { Divider, FlatButton } from 'material-ui'
import DownloadIcon from 'material-ui/svg-icons/file/cloud-download'
import LinearProgress from 'material-ui/LinearProgress'

class SearchResultRow extends Component {
    startLoadingHighlight() {
        const { searchQuery, hit: { sha256: sha256 }, loadHighlight } = this.props
        loadHighlight(sha256, searchQuery)
    }

    componentDidMount() {
    }

    render() {
        const { hit: { fetching: fetching, highlight: highlight, meta: meta, content: content, sha256: sha256 }, searchQuery, loadHighlight, urls, performSearchBySource, performSearchByAuthor, performSearchByPathToFile, toggleImagePreview } = this.props

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




