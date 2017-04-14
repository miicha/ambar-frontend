import React, { Component } from 'react'
import { titles } from 'utils/'
import SearchResultTable from './components/SearchResultTable'
import UploadFileModal from './components/UploadFileModal'
import ImagePreview from './components/ImagePreview'

import UploadIcon from 'material-ui/svg-icons/editor/attach-file'
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Dialog from 'material-ui/Dialog'
import Scroll from 'react-scroll'

import classes from './Search.scss'

class Search extends Component {
    componentDidMount() {
        const { setAppTitle, setHeader, loadSources } = this.props
        setAppTitle('Search')
        setHeader('Search', true)
        loadSources()
    }

    componentWillUnmount() {
        const { cleanUpSearchResult } = this.props
        cleanUpSearchResult()
    }

    scrollToTop() {
        Scroll.animateScroll.scrollToTop()
    }

    render() {
        const { fetching,
            hits,
            searchQuery,
            performSearch,
            loadHighlight,
            hasMore,
            urls,
            scrolledDown,
            setScrolledDown,
            setAppTitle,
            currentPage,
            mode,
            toggleUploadModal,
            isUploadModalOpen,
            sources,
            filesToUpload,
            addFilesToUpload,
            removeFileToUpload,
            setBucketName,
            bucketName,
            bucketNameValidationMessage,
            isFilesUploading,
            uploadFiles,
            performSearchBySource,
            performSearchByAuthor,
            performSearchByPathToFile,
            performSearchByQuery,
            toggleImagePreview,
            isImagePreviewOpen,
            imagePreviewUrl } = this.props

        return (
            <div>
                <SearchResultTable
                    currentPage={currentPage}
                    fetching={fetching}
                    performSearch={performSearch}
                    loadHighlight={loadHighlight}
                    hits={hits}
                    searchQuery={searchQuery}
                    hasMore={hasMore}
                    urls={urls}
                    setScrolledDown={setScrolledDown}
                    scrolledDown={scrolledDown}
                    performSearchBySource={performSearchBySource}
                    performSearchByAuthor={performSearchByAuthor}
                    performSearchByPathToFile={performSearchByPathToFile}
                    performSearchByQuery={performSearchByQuery}
                    toggleImagePreview={toggleImagePreview}
                />
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', bottom: '10%', right: '20px' }}>
                        <FloatingActionButton
                            zDepth={4}
                            onTouchTap={this.scrollToTop}
                            className={scrolledDown ? '' : 'hiddenWithAnimation'}>
                            <ArrowUpward />
                        </FloatingActionButton>
                        <FloatingActionButton
                            zDepth={4}
                            className={classes.uploadFileBtn}
                            secondary={true}
                            onTouchTap={toggleUploadModal}>
                            <UploadIcon />
                        </FloatingActionButton>
                    </div>
                    <UploadFileModal
                        fetching={isFilesUploading}
                        sources={sources}
                        open={isUploadModalOpen}
                        toggleModal={toggleUploadModal}
                        addFilesToUpload={addFilesToUpload}
                        removeFileToUpload={removeFileToUpload}
                        filesToUpload={filesToUpload}
                        setBucketName={setBucketName}
                        bucketName={bucketName}
                        bucketNameValidationMessage={bucketNameValidationMessage}
                        uploadFiles={uploadFiles}
                    />
                </div>
                <ImagePreview visible={isImagePreviewOpen} imageUrl={imagePreviewUrl} toggle={toggleImagePreview} />
            </div>
        )
    }
}

Search.propTypes = {
    setAppTitle: React.PropTypes.func.isRequired,

    setScrolledDown: React.PropTypes.func.isRequired,
    scrolledDown: React.PropTypes.bool.isRequired,

    fetching: React.PropTypes.bool.isRequired,

    currentPage: React.PropTypes.number.isRequired,
    hasMore: React.PropTypes.bool.isRequired,

    searchQuery: React.PropTypes.string.isRequired,
    hits: React.PropTypes.object.isRequired,
    performSearch: React.PropTypes.func.isRequired,
    loadHighlight: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchByQuery: React.PropTypes.func.isRequired,
    cleanUpSearchResult: React.PropTypes.func.isRequired,

    loadSources: React.PropTypes.func.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired,

    urls: React.PropTypes.object.isRequired,

    toggleUploadModal: React.PropTypes.func.isRequired,
    isUploadModalOpen: React.PropTypes.bool.isRequired,
    sources: React.PropTypes.object.isRequired,
    addFilesToUpload: React.PropTypes.func.isRequired,
    removeFileToUpload: React.PropTypes.func.isRequired,
    filesToUpload: React.PropTypes.array.isRequired,
    setBucketName: React.PropTypes.func.isRequired,
    bucketName: React.PropTypes.string.isRequired,
    bucketNameValidationMessage: React.PropTypes.string.isRequired,
    isFilesUploading: React.PropTypes.bool.isRequired,
    uploadFiles: React.PropTypes.func.isRequired,

    toggleImagePreview: React.PropTypes.func.isRequired,
    isImagePreviewOpen: React.PropTypes.bool.isRequired,
    imagePreviewUrl: React.PropTypes.string.isRequired
}

export default Search