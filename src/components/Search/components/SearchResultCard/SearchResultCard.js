import React, { Component } from 'react'
import { LoadingIndicator } from 'components/BasicComponents'

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import MediaQuery from 'react-responsive'
import Paper from 'material-ui/Paper'
import { Divider, FlatButton } from 'material-ui'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import PreviewIcon from 'material-ui/svg-icons/action/open-in-new'
import TextDownloadIcon from 'material-ui/svg-icons/action/subject'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import UndoIcon from 'material-ui/svg-icons/content/undo'
import LinearProgress from 'material-ui/LinearProgress'

import { SearchResultCardHeader, TagsInput } from './components'

import classes from './SearchResultCard.scss'

const getExtension = (meta) => {
    let extension = (typeof meta.extension !== 'string') && meta.extension.length && meta.extension.length > 0
        ? meta.extension[0]
        : meta.extension
    return extension ? extension.replace('.', '').toLowerCase() : ''
}

const shouldShowPreviewButton = (size, extension) => {
    const MAX_FILE_SIZE_FOR_PREVIEW = 3 * 1024 * 1024 // 3MB
    const GOOGLE_ALLOWED_FILE_EXTENSIONS = ['doc', 'docx', 'ppt', 'pptx', 'rtf', 'txt', 'xls', 'xlsx', 'csv', 'pdf']

    return size < MAX_FILE_SIZE_FOR_PREVIEW && GOOGLE_ALLOWED_FILE_EXTENSIONS.indexOf(extension) !== -1
}

const shouldShowTextButton = (extension) => {
    const ARCHIVE_EXTENSIONS = ['zip']
    return ARCHIVE_EXTENSIONS.indexOf(extension) == -1
}

class SearchResultCard extends Component {
    startLoadingHighlight() {
        const { searchQuery, hit: { file_id: fileId }, loadHighlight } = this.props
        loadHighlight(fileId, searchQuery)
    }

    render() {
        const {
            hit: {
                fetching: fetching,
            meta: meta,
            content: content,
            sha256: sha256,
            tags: tags,
            file_id: fileId,
            isHidden: isHidden,
            hidden_mark: hidden_mark
        },
            allTags,
            searchQuery,
            loadHighlight,
            urls,
            performSearchBySource,
            performSearchByAuthor,
            performSearchByPathToFile,
            toggleImagePreview,
            showFilePreview,
            addTagToFile,
            removeTagFromFile,
            performSearchByTag,
            hideFile,
            showFile } = this.props

        const contentHighlight = content && content.highlight && content.highlight.text ? content.highlight.text : undefined

        return (
            <Paper zDepth={1} className={classes.searchResultRowCard}>
                <Card>
                    <SearchResultCardHeader
                        searchQuery={searchQuery}
                        meta={meta}
                        content={content}
                        performSearchByPathToFile={performSearchByPathToFile}
                        performSearchByAuthor={performSearchByAuthor}
                        performSearchBySource={performSearchBySource}
                    />
                    {!isHidden && <div>
                        <TagsInput
                            tags={tags}
                            onAddTag={(tag) => addTagToFile(fileId, tag)}
                            onRemoveTag={(tag) => removeTagFromFile(fileId, tag)}
                            performSearchByTag={performSearchByTag}
                            suggestions={allTags.map(t => t.name)}
                        />
                        <div className={classes.searchResultRowCardTextContainer}>
                            <div className={classes.searchResultRowCardTextDiv}>
                                {fetching && <CardText>
                                    <LoadingIndicator />
                                </CardText>
                                }
                                {!fetching && !contentHighlight &&
                                    <CardText onMouseEnter={() => this.startLoadingHighlight()}>
                                        <span className={classes.blurred}>Если у общества нет цветовой дифференциации штанов - то у общества</span><br />
                                        <span className={classes.blurred}>нет цели, а если нет цели - то...</span>
                                    </CardText>
                                }
                                {!fetching && contentHighlight && contentHighlight.map((hl, idx) =>
                                    <CardText key={idx}
                                        className={idx != contentHighlight.length - 1 ? classes.searchResultRowCardTextWithBorder : undefined}
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
                    </div>}
                    <CardActions className={classes.searchResultRowCardFooter}>
                        <div style={{ display: 'flex', justifyContent: !isHidden ? 'space-between' : 'flex-end', width: '100%' }}>
                            {!isHidden && <div>
                                <FlatButton
                                    icon={<FileDownloadIcon />}
                                    label='Original'
                                    primary={true}
                                    onTouchTap={() => { window.open(urls.ambarWebApiGetFile(meta.download_uri)) }}
                                />
                                <FlatButton
                                    icon={<TextDownloadIcon />}
                                    label='Text'
                                    disabled={!shouldShowTextButton(getExtension(meta))}
                                    primary={true}
                                    onTouchTap={() => { window.open(urls.ambarWebApiGetFileText(meta.download_uri)) }}
                                />
                                {showFilePreview && <FlatButton
                                    icon={<PreviewIcon />}
                                    label='Preview'
                                    primary={true}
                                    disabled={!shouldShowPreviewButton(content.size, getExtension(meta))}
                                    onTouchTap={() => {
                                        window.open(
                                            urls.googlePreviewFile(meta.download_uri, urls),
                                            'preview',
                                            'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800px,height=600px'
                                        )
                                    }}
                                />}
                            </div>}
                            <div>
                                {!hidden_mark && <FlatButton
                                    icon={<DeleteIcon />}
                                    secondary={true}
                                    label='Hide'
                                    style={{ color: 'grey' }}
                                    onTouchTap={() => hideFile(fileId)}
                                />}
                                {(isHidden || hidden_mark) && <FlatButton
                                    icon={<UndoIcon />}
                                    label='Restore'
                                    primary={true}
                                    onTouchTap={() => showFile(fileId)}
                                />}
                            </div>
                        </div>}
                    </CardActions>
                </Card>
            </Paper>
        )
    }
}


SearchResultCard.propTypes = {
    hit: React.PropTypes.object.isRequired,
    allTags: React.PropTypes.array.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    loadHighlight: React.PropTypes.func.isRequired,
    urls: React.PropTypes.object.isRequired,
    showFilePreview: React.PropTypes.bool.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    toggleImagePreview: React.PropTypes.func.isRequired,
    addTagToFile: React.PropTypes.func.isRequired,
    removeTagFromFile: React.PropTypes.func.isRequired,
    performSearchByTag: React.PropTypes.func.isRequired,
    hideFile: React.PropTypes.func.isRequired,
    showFile: React.PropTypes.func.isRequired
}

export default SearchResultCard




