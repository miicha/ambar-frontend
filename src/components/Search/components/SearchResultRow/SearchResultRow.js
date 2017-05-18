import React, { Component } from 'react'
import { LoadingIndicator } from 'components/BasicComponents'
import SearchResultMetaDescriptionLine from '../SearchResultMetaDescriptionLine'
import SearchResultMetaFullNameLine from '../SearchResultMetaFullNameLine'

import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import MediaQuery from 'react-responsive'
import Paper from 'material-ui/Paper'
import { Divider, FlatButton } from 'material-ui'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import PreviewIcon from 'material-ui/svg-icons/action/open-in-new'
import TextDownloadIcon from 'material-ui/svg-icons/action/subject'
import LinearProgress from 'material-ui/LinearProgress'

import classes from './SearchResultRow.scss'

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

    return <Avatar
        className={classes.resultAvatar}
        onTouchTap={() => searchFunction(`*.${extension}`)}
        size={38}
        style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            cursor: 'default'
        }}
        backgroundColor={colors[getHashCode(extension) % colors.length]}>{extension}</Avatar>
}

const shouldShowPreviewButton = (showFilePreview, size, extension) => {
    const MAX_FILE_SIZE_FOR_PREVIEW = 3 * 1024 * 1024 // 3MB
    const GOOGLE_ALLOWED_FILE_EXTENSIONS = ['doc', 'docx', 'ppt', 'pptx', 'rtf', 'txt', 'xls', 'xlsx', 'csv', 'pdf']

    return showFilePreview && size < MAX_FILE_SIZE_FOR_PREVIEW && GOOGLE_ALLOWED_FILE_EXTENSIONS.indexOf(extension) !== -1
}

const shouldShowTextButton = (extension) => {
    const ARCHIVE_EXTENSIONS = ['zip']
    return ARCHIVE_EXTENSIONS.indexOf(extension) == -1
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
            meta: meta,
            content: content,
            sha256: sha256
            },
            searchQuery,
            loadHighlight,
            urls,
            performSearchBySource,
            performSearchByAuthor,
            performSearchByPathToFile,
            toggleImagePreview,
            showFilePreview } = this.props

        const contentHighlight = content && content.highlight && content.highlight.text ? content.highlight.text : undefined

        return (
            <Paper zDepth={1} className={classes.searchResultRowCard}>
                <Card>
                    <CardHeader
                        style={{ overflowX: 'hidden' }}
                        title={<span className={classes.searchResultRowCardHeaderTitle} dangerouslySetInnerHTML={{ __html: meta.short_name }} />}
                        avatar={getFileAvatarByMeta(meta, performSearchByPathToFile)}
                        subtitle={<SearchResultMetaFullNameLine meta={meta} performSearchByPathToFile={performSearchByPathToFile} />}
                        actAsExpander={false}
                        showExpandableButton={false}
                    />
                    <div className={classes.searchResultRowCardTextContainer}>
                        <div className={classes.searchResultRowCardTextDiv}>
                            {fetching && <CardText>
                                <LoadingIndicator />
                            </CardText>
                            }
                            {!fetching && content.state != 'processed' &&
                                <CardText>
                                    <LinearProgress mode='indeterminate' />
                                </CardText>
                            }
                            {!fetching && content.state === 'processed' && !contentHighlight &&
                                <CardText onMouseEnter={() => this.startLoadingHighlight()}>
                                    <span className={classes.blurred}>Если у общества нет цветовой дифференциации штанов - то у общества</span><br />
                                    <span className={classes.blurred}>нет цели, а если нет цели - то...</span>
                                </CardText>
                            }
                            {!fetching && contentHighlight && contentHighlight.map((hl, idx) =>
                                <CardText key={idx}
                                    className={classes.searchResultRowCardTextWithBorder}
                                    dangerouslySetInnerHTML={{ __html: hl }}
                                />)
                            }
                        </div>
                        {!fetching && contentHighlight && content.thumb_available &&
                            <MediaQuery query='(min-width: 1024px)'>
                                <div className={classes.searchResultRowCardTextThumbnailContainer} >
                                    <img onTouchTap={() => { toggleImagePreview(urls.ambarWebApiGetThumbnail(sha256)) }}
                                        className={classes.searchResultRowCardTextThumbnailImage}
                                        src={urls.ambarWebApiGetThumbnail(sha256)} />
                                </div>
                            </MediaQuery>
                        }
                    </div>
                    <CardActions className={classes.searchResultRowCardFooter}>
                        <div style={{ display: 'flex' }}>
                            <FlatButton icon={<FileDownloadIcon />} label='Original' primary={true} onTouchTap={() => { window.open(urls.ambarWebApiGetFile(meta.download_uri)) }} />
                            {shouldShowTextButton(getExtension(meta)) && <FlatButton
                                icon={<TextDownloadIcon />}
                                label='Text'
                                primary={true}
                                onTouchTap={() => { window.open(urls.ambarWebApiGetFileText(meta.download_uri)) }} />
                            }
                            {shouldShowPreviewButton(showFilePreview, content.size, getExtension(meta)) && <FlatButton
                                icon={<PreviewIcon />}
                                label='Preview'
                                primary={true}
                                onTouchTap={() => { window.open(urls.googlePreviewFile(meta.download_uri, urls), 'preview', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600px,height=600px') }} />
                            }
                        </div>
                        <SearchResultMetaDescriptionLine
                            searchQuery={searchQuery}
                            content={content}
                            meta={meta}
                            performSearchByAuthor={performSearchByAuthor}
                            performSearchBySource={performSearchBySource}
                        />
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
    showFilePreview: React.PropTypes.bool.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    toggleImagePreview: React.PropTypes.func.isRequired
}

export default SearchResultRow




