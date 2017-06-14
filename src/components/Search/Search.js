import React, { Component } from 'react'
import { titles } from 'utils/'

import { SearchResultTable, ImagePreview, SearchInput, SideMenu, RefineSearchModal } from './components'
import { InfiniteScroll } from 'components/BasicComponents'
import UploadModal from 'routes/SearchPage/containers/UploadModalContainer'

import { cyan100, cyan300, cyan400 } from 'material-ui/styles/colors'
import MoreHoriz from 'material-ui/svg-icons/navigation/more-horiz'
import MediaQuery from 'react-responsive'
import UploadIcon from 'material-ui/svg-icons/editor/attach-file'
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'

import Dialog from 'material-ui/Dialog'

import classes from './Search.scss'

const Desktop = ({ children }) => <MediaQuery query='(min-width: 1024px)' children={children} />

class Search extends Component {

    timeoutId = null

    componentDidMount() {
        const { setPageTitle, setAppHeader, loadSourcesAndTags, performSearch, toggleRefineSearchModal, searchQuery, setQueryFromGetParam, setQuery } = this.props

        setPageTitle('Search')
        setAppHeader({
            left: () => <Desktop>Search</Desktop>,
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
        loadSourcesAndTags()
        setQueryFromGetParam()
    }

    componentWillUnmount() {
        const { cleanUpSearchResult } = this.props
        cleanUpSearchResult()
    }

    render() {
        const {
            fetching,
            hits,
            searchQuery,
            performSearch,
            hasMore,
            scrolledDown,
            setScrolledDown,
            setPageTitle,
            currentPage,
            mode,
            toggleUploadModal,
            sources,
            toggleImagePreview,
            isImagePreviewOpen,
            imagePreviewUrl,
            isRefineSearchModalOpen,
            toggleRefineSearchModal,
            toggleSourceSelected,
            setAppHeader,
            performSearchByQuery
         } = this.props

        return (
            <div style={{ height: '100%' }}>
                <RefineSearchModal
                    isRefineSearchModalOpen={isRefineSearchModalOpen}
                    toggleRefineSearchModal={toggleRefineSearchModal}
                    sources={sources}
                    toggleSourceSelected={toggleSourceSelected}
                />
                <Desktop>
                    <div style={{
                        position: 'fixed',
                        width: '200px',
                        height: '100%',
                        left: 0,
                        right: 0,
                        boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)',
                        padding: '0'
                    }}>
                        <SideMenu performSearchByQuery={performSearchByQuery} />
                    </div>
                </Desktop>
                <MediaQuery query='(min-width: 1024px)'>
                    {
                        (matches) => {
                            return (<div style={{ marginLeft: matches ? '200px' : '0', height: '100%', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.05)' }}
                                ref={(container) => { this.containerNode = container }}>
                                <SearchResultTable
                                    fetching={fetching}
                                    hits={hits}
                                    searchQuery={searchQuery}
                                    toggleImagePreview={toggleImagePreview}
                                    performSearchByQuery={performSearchByQuery}
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
                            </div>)
                        }
                    }
                </MediaQuery>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', bottom: '10%', right: '30px', zIndex: '990' }}>
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
                    <UploadModal />                        
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

    loadSourcesAndTags: React.PropTypes.func.isRequired,

    toggleUploadModal: React.PropTypes.func.isRequired,
    sources: React.PropTypes.object.isRequired,

    toggleImagePreview: React.PropTypes.func.isRequired,
    isImagePreviewOpen: React.PropTypes.bool.isRequired,
    imagePreviewUrl: React.PropTypes.string.isRequired,

    isRefineSearchModalOpen: React.PropTypes.bool.isRequired,
    toggleRefineSearchModal: React.PropTypes.func.isRequired,

    toggleSourceSelected: React.PropTypes.func.isRequired,

    setQuery: React.PropTypes.func.isRequired,
    performSearchByQuery: React.PropTypes.func.isRequired
}

export default Search