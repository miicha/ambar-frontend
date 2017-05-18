import React, { Component } from 'react'
import { titles } from 'utils/'
import SearchResultTable from './components/SearchResultTable'
import UploadFileModal from './components/UploadFileModal'
import ImagePreview from './components/ImagePreview'
import SearchInput from './components/SearchInput'
import RefineSearchModal from './components/RefineSearchModal'
import { InfiniteScroll } from 'components/BasicComponents'

import { cyan100, cyan300, cyan400 } from 'material-ui/styles/colors'
import MoreHoriz from 'material-ui/svg-icons/navigation/more-horiz'
import MediaQuery from 'react-responsive'
import UploadIcon from 'material-ui/svg-icons/editor/attach-file'
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

import classes from './Search.scss'

class Search extends Component {

    timeoutId = null

    componentDidMount() {
        const { setPageTitle, setAppHeader, loadSources, performSearch, toggleRefineSearchModal, searchQuery, setQueryFromGetParam, setQuery } = this.props

        setPageTitle('Search')
        setAppHeader({
            left: () => <MediaQuery query='(min-width: 1024px)'>Search</MediaQuery>,
            center: (state) => {
                return (
                    <SearchInput
                        setQuery={setQuery}
                        query={state['searchPage'].searchQuery}
                        performSearch={performSearch}
                    />)
            },
            right: () => <FlatButton
                style={{ height: '34px', 'lineHeight': '10px', width: '34px', 'minWidth': '34px' }}
                backgroundColor={cyan300}
                hoverColor={cyan400}
                onTouchTap={() => toggleRefineSearchModal()}
                icon={<MoreHoriz color={cyan100} />}
            />
        })
        loadSources()
        setQueryFromGetParam()
    }

    componentWillUnmount() {
        const { cleanUpSearchResult } = this.props
        cleanUpSearchResult()
    }

    render() {
        const {
            query,
            fetching,
            hits,
            searchQuery,
            performSearch,
            loadHighlight,
            hasMore,
            urls,
            scrolledDown,
            setScrolledDown,
            setPageTitle,
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
            imagePreviewUrl,
            showFilePreview,
            isRefineSearchModalOpen,
            toggleRefineSearchModal,
            toggleSourceSelected,
            setAppHeader,
         } = this.props

        return (
            <div style={{ height: '100%' }}>
                <RefineSearchModal
                    isRefineSearchModalOpen={isRefineSearchModalOpen}
                    toggleRefineSearchModal={toggleRefineSearchModal}
                    sources={sources}
                    toggleSourceSelected={toggleSourceSelected}
                />
                <div style={{ height: '100%', overflowY: 'auto' }} 
                    ref={(container) => { this.containerNode = container }}>
                    <SearchResultTable
                        fetching={fetching}
                        performSearch={performSearch}
                        loadHighlight={loadHighlight}
                        hits={hits}
                        searchQuery={searchQuery}
                        urls={urls}                        
                        performSearchBySource={performSearchBySource}
                        performSearchByAuthor={performSearchByAuthor}
                        performSearchByPathToFile={performSearchByPathToFile}
                        performSearchByQuery={performSearchByQuery}
                        toggleImagePreview={toggleImagePreview}
                        showFilePreview={showFilePreview}
                    />
                    {this.containerNode && <InfiniteScroll
                        anchorEl={this.containerNode}
                        currentPage={currentPage}
                        threshold={100}
                        loadMore={(newPage) => {
                            performSearch(newPage, searchQuery)
                        }}
                        hasMore={hasMore}
                        onScrollDown={(isFirstPage) => setScrolledDown(!isFirstPage)}
                    />}
                </div>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', bottom: '10%', right: '30px' }}>
                        <FloatingActionButton
                            zDepth={4}
                            onTouchTap={() => { this.containerNode.scrollTop = 0 }}
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
    setPageTitle: React.PropTypes.func.isRequired,

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
    showFilePreview: React.PropTypes.bool.isRequired,

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
    imagePreviewUrl: React.PropTypes.string.isRequired,

    isRefineSearchModalOpen: React.PropTypes.bool.isRequired,
    toggleRefineSearchModal: React.PropTypes.func.isRequired,

    sources: React.PropTypes.object.isRequired,
    toggleSourceSelected: React.PropTypes.func.isRequired,

    setQuery: React.PropTypes.func.isRequired
}

export default Search