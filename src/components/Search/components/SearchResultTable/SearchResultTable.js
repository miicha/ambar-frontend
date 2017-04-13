import React, { Component } from 'react'
import { InfiniteScroll } from 'components/BasicComponents'
import SearchResultRow from '../SearchResultRow'
import EmptyCard from '../EmptyCard'

import classes from './SearchResultTable.scss'

class SearchResultTable extends Component {

    componentDidMount() {
        window.addEventListener('scroll', (eventArgs) => this.handleScroll(eventArgs, this.props))
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', (eventArgs) => this.handleScroll(eventArgs, this.props))
    }

    handleScroll(eventArgs, props) {
        const { scrolledDown, setScrolledDown } = props
        const scrollPosition = event.srcElement.body.scrollTop
        const showScrollToTopButton = scrollPosition > 1000 ? true : false
        if (scrolledDown != showScrollToTopButton) {
            setScrolledDown(showScrollToTopButton)
        }
    }

    render() {
        const {
            hits,
            searchQuery,
            fetching,
            hasMore,
            performSearch,
            urls,
            loadHighlight,
            scrolledDown,
            currentPage,
            performSearchBySource,
            performSearchByAuthor,
            performSearchByPathToFile,
            toggleImagePreview } = this.props
            
        const hintText = (<div><p>Try these tips to refine your search</p>
            <ul>
                <li><i>*</i> - show all files</li>
                <li><i>John</i> - search files containing "John" word</li>
                <li><i>John Smith</i> - search for files containing both "John" and "Smith" words</li>
                <li><i>"John Smith"</i> - search for files containing "John Smith" phrase</li>
                <li><i>"John Smith"~10</i> - search for files containing both "John" and "Smith" words with maximum distance of 10 words</li>
                <li><i>John~3</i> - fuzzy search for word "John" in all files with maximum of 3 replacements</li>
                <li><i>filename:*.txt</i> - search for all ".txt" files, can be combined with other queries</li>
                <li><i>size>1M</i> - search for all files larger than 1 Mb, can be combined with other queries</li>
            </ul>
        </div>)

        const emailText = (<p>
            Have any questions? <a className={classes.link} href="mailto:hello@ambar.cloud?subject=Ambar Question">Drop us an email</a>
        </p>)

        const nothingFoundText = (<div>
            <p style={{marginTop: 0}}>Your search - <i>{searchQuery}</i> - did not match any documents</p>
            {hintText}
            {emailText}
        </div>)

        const tipText = (<div>
            <p style={{marginTop: 0}}>Just type your query in search input above and hit "Enter"</p>
            {hintText}
            {emailText}
        </div>)

        return (
            <InfiniteScroll
                currentPage={currentPage}
                threshold={500}
                loadMore={(newPage) => {
                    performSearch(newPage, searchQuery)
                }}
                hasMore={hasMore}
                fetching={fetching}>
                {hits && hits.size > 0 && Array.from(hits.values()).map((hit, idx) =>
                    <SearchResultRow
                        key={hit.sha256}
                        hit={hit}
                        searchQuery={searchQuery}
                        loadHighlight={loadHighlight}
                        urls={urls}
                        performSearchBySource={performSearchBySource}
                        performSearchByAuthor={performSearchByAuthor}
                        performSearchByPathToFile={performSearchByPathToFile}
                        toggleImagePreview={toggleImagePreview} />
                )}
                {(!hits || hits.size == 0)
                    && !fetching
                    && searchQuery != ''
                    && <EmptyCard
                        title='Nothing found'
                        textElement={nothingFoundText} />}
                {(!hits || hits.size == 0)
                    && !fetching
                    && searchQuery === ''
                    && <EmptyCard
                        title='Few tips for search'
                        textElement={tipText}
                    />}
            </InfiniteScroll>
        )
    }
}

SearchResultTable.propTypes = {
    currentPage: React.PropTypes.number.isRequired,
    hasMore: React.PropTypes.bool.isRequired,
    fetching: React.PropTypes.bool.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    loadHighlight: React.PropTypes.func.isRequired,
    performSearch: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    urls: React.PropTypes.object.isRequired,
    scrolledDown: React.PropTypes.bool.isRequired,
    setScrolledDown: React.PropTypes.func.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    toggleImagePreview: React.PropTypes.func.isRequired
}

export default SearchResultTable
