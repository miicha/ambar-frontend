import React, { Component } from 'react'
import SearchResultRow from '../SearchResultRow'
import EmptyCard from '../EmptyCard'

import classes from './SearchResultTable.scss'

class SearchResultTable extends Component {
    render() {
        const {
            hits,
            searchQuery,
            fetching,
            performSearch,
            urls,
            showFilePreview,
            loadHighlight,
            performSearchBySource,
            performSearchByAuthor,
            performSearchByPathToFile,
            performSearchByQuery,
            toggleImagePreview } = this.props

        const hintText = (<div><p>Try these tips to refine your search</p>
            <ul>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('*') }}>
                    *
                    </span> - show all files
                </li>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('John') }}>
                    John
                    </span> - search files containing "John" word
                </li>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('John Smith') }}>
                    John Smith
                    </span> - search for files containing both "John" and "Smith" words
                </li>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('"John Smith"') }}>
                    "John Smith"
                    </span> - search for files containing "John Smith" phrase
                </li>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('"John Smith"~10') }}>
                    "John Smith"~10
                    </span> - search for files containing both "John" and "Smith" words with maximum distance of 10 words
                </li>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('John~3') }}>
                    John~3
                    </span> - fuzzy search for word "John" in all files with maximum of 3 replacements
                </li>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('filename:*.txt') }}>
                    filename:*.txt
                    </span> - search for all ".txt" files, can be combined with other queries (examples:&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('filename:*.pdf') }}>*.pdf</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('filename:*.doc*') }}>*.doc*</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('filename:*.rtf') }}>*.rtf</span>
                    )
                </li>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('size>1M') }}>
                    size>1M
                    </span> - search for all files larger than 1 MB, can be combined with other queries (available options are:&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('size<1M') }}>size&lt;1M</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('size>100K') }}>size&gt;100K</span>
                    )
                </li>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:today') }}>
                    when:today
                    </span> - search for all files modified today (available options are:&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:today') }}>today</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:yesterday') }}>yesterday</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:thisweek') }}>thisweek</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:thismonth') }}>thismonth</span>,&nbsp;
                    <span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('when:thisyear') }}>thisyear</span>
                    )
                </li>
                <li><span className={classes.clickableSpan} onTouchTap={() => { performSearchByQuery('author:*') }}>
                    author:*
                    </span> - search for all files with specified author
                </li>
            </ul>
        </div>)

        const emailText = (<p>
            Have any questions? <a className={classes.link} href="mailto:hello@ambar.cloud?subject=Ambar Question">Drop us an email</a>
        </p>)

        const nothingFoundText = (<div>
            <p style={{ marginTop: 0 }}>Your search - <i>{searchQuery}</i> - did not match any documents</p>
            {hintText}
            {emailText}
        </div>)

        const tipText = (<div>
            <p style={{ marginTop: 0 }}>Just type your query in search input above and hit "Enter"</p>
            {hintText}
            {emailText}
        </div>)

        return (
            <div className='pageContainer'>
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
                        toggleImagePreview={toggleImagePreview}
                        showFilePreview={showFilePreview} />
                )}
                {(!hits || hits.size == 0)
                    && searchQuery != ''
                    && <EmptyCard
                        title='Nothing found'
                        textElement={nothingFoundText} />}
                {(!hits || hits.size == 0)
                    && searchQuery === ''
                    && <EmptyCard
                        title='Few tips for search'
                        textElement={tipText}
                    />}                
            </div>
        )
    }
}

SearchResultTable.propTypes = {
    fetching: React.PropTypes.bool.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    loadHighlight: React.PropTypes.func.isRequired,
    performSearch: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    urls: React.PropTypes.object.isRequired,
    showFilePreview: React.PropTypes.bool.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchByQuery: React.PropTypes.func.isRequired,
    toggleImagePreview: React.PropTypes.func.isRequired
}

export default SearchResultTable
