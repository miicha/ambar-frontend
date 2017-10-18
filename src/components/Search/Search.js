import React, { Component } from 'react'
import { titles } from 'utils/'

import { SearchResultContainer, ImagePreview, TextPreview, SearchInput, SideMenu } from './components'
import { InfiniteScroll } from 'components/BasicComponents'
import UploadModal from 'routes/SearchPage/containers/UploadModalContainer'
import TextPreviewModal from 'routes/SearchPage/containers/TextPreviewModalContainer'

import { cyan100, cyan300, cyan400 } from 'material-ui/styles/colors'
import MoreHoriz from 'material-ui/svg-icons/navigation/more-horiz'
import MediaQuery from 'react-responsive'
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'

import Dialog from 'material-ui/Dialog'

import classes from './Search.scss'

const Desktop = ({ children }) => <MediaQuery query='(min-width: 1024px)' children={children} />

class Search extends Component {

    timeoutId = null

    componentDidMount() {
        const { setPageTitle, setAppHeader, loadTags, performSearch, searchQuery, setQueryFromGetParam, setQuery } = this.props

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
            }
        })
        loadTags()
        setQueryFromGetParam()
    }

    componentWillUnmount() {
        const { cleanUpSearchResult } = this.props
        cleanUpSearchResult()
    }

    render() {
        const {
            searchView,
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
            toggleImagePreview,
            isImagePreviewOpen,
            imagePreviewUrl,
            setAppHeader,
            performSearchByQuery,
            performSearchBySize,
            performSearchByWhen,
            performSearchByShow,
            performSearchByTag,
            setSearchResultView,
            allTags
         } = this.props

        return (
            <div style={{ height: '100%' }}>
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
                        <SideMenu
                            performSearchByQuery={performSearchByQuery}
                            performSearchBySize={performSearchBySize}
                            performSearchByWhen={performSearchByWhen}
                            performSearchByShow={performSearchByShow}
                            performSearchByTag={performSearchByTag}
                            toggleUploadModal={toggleUploadModal}
                            setSearchResultView={setSearchResultView}
                            searchView={searchView}
                            allTags={allTags}
                        />
                    </div>
                </Desktop>
                <MediaQuery query='(min-width: 1024px)'>
                    {
                        (matches) => {
                            return (<div style={{ marginLeft: matches ? '200px' : '0', height: '100%', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.05)' }}
                                ref={(container) => { this.containerNode = container }}>
                                <SearchResultContainer
                                    searchView={searchView}
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
                    </div>
                </div>
                <UploadModal />
                <ImagePreview visible={isImagePreviewOpen} imageUrl={imagePreviewUrl} toggle={toggleImagePreview} />
                <TextPreviewModal />
            </div>
        )
    }
}

Search.propTypes = {
    searchView: React.PropTypes.string.isRequired,
    setPageTitle: React.PropTypes.func.isRequired,

    setScrolledDown: React.PropTypes.func.isRequired,
    scrolledDown: React.PropTypes.bool.isRequired,

    fetching: React.PropTypes.bool.isRequired,

    currentPage: React.PropTypes.number.isRequired,
    hasMore: React.PropTypes.bool.isRequired,

    searchQuery: React.PropTypes.string.isRequired,
    hits: React.PropTypes.object.isRequired,

    loadTags: React.PropTypes.func.isRequired,
    allTags: React.PropTypes.array.isRequired,

    toggleUploadModal: React.PropTypes.func.isRequired,

    toggleImagePreview: React.PropTypes.func.isRequired,
    isImagePreviewOpen: React.PropTypes.bool.isRequired,
    imagePreviewUrl: React.PropTypes.string.isRequired,

    setQuery: React.PropTypes.func.isRequired,
    performSearchByQuery: React.PropTypes.func.isRequired,
    performSearchBySize: React.PropTypes.func.isRequired,
    performSearchByWhen: React.PropTypes.func.isRequired,
    performSearchByShow: React.PropTypes.func.isRequired,
    performSearchByTag: React.PropTypes.func.isRequired,
    setSearchResultView: React.PropTypes.func.isRequired
}

export default Search