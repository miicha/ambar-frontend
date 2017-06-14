import React, { Component } from 'react'
import SearchCard from 'routes/SearchPage/containers/SearchCardContainer'
import HintCard from '../HintCard'

import classes from './SearchResultTable.scss'

class SearchResultTable extends Component {
    render() {
        const {
            hits,
            searchQuery,
            fetching,
            performSearchByQuery,
            toggleImagePreview
        } = this.props

        return (
            <div className='pageContainer'>
                {hits && hits.size > 0 && Array.from(hits.values()).map((hit, idx) =>
                    <SearchCard
                        key={hit.file_id}                        
                        fileId={hit.file_id}
                        searchQuery={searchQuery}
                        toggleImagePreview={toggleImagePreview}
                     />
                )}
                {(!hits || hits.size == 0)
                    && searchQuery != ''
                    && <HintCard
                        title='Nothing found'
                        description={<span>Your search - <i>{searchQuery}</i> - did not match any documents</span>}
                        performSearchByQuery={performSearchByQuery}
                    />}
                {(!hits || hits.size == 0)
                    && searchQuery === ''
                    && <HintCard
                        title='Few tips for search'
                        description={<span>Just type your query in search input above and hit "Enter"</span>}
                        performSearchByQuery={performSearchByQuery}
                    />}
            </div>
        )
    }
}

SearchResultTable.propTypes = {
    fetching: React.PropTypes.bool.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    toggleImagePreview: React.PropTypes.func.isRequired,
}

export default SearchResultTable
