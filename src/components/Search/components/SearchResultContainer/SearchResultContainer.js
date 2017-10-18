import React, { Component } from 'react'
import HintCard from '../HintCard'

import { DetailedView, TableView } from './components'
import classes from './SearchResultContainer.scss'

class SearchResultContainer extends Component {
    render() {

        const {
            searchView,
            hits,
            searchQuery,
            fetching,
            performSearchByQuery
        } = this.props

        const searchResults = Array.from(hits.values())

        if (hits && hits.size > 0) {
            if (searchView == 'table') {
                return <TableView hits={searchResults}  />
            }

            if (searchView == 'detailed') {
                return <DetailedView hits={searchResults} />
            }
        } else {
            if (searchQuery != '') {
                return (<div className='pageContainer'>
                    <HintCard
                        title='Nothing found'
                        description={<span>Your search - <i>{searchQuery}</i> - did not match any documents</span>}
                        performSearchByQuery={performSearchByQuery}
                    />
                </div>)
            } else {
                return (<div className='pageContainer'>
                    <HintCard
                        title='Few tips for search'
                        description={<span>Just type your query in search input above and hit "Enter"</span>}
                        performSearchByQuery={performSearchByQuery}
                    />
                </div>)
            }
        }
    }
}

SearchResultContainer.propTypes = {
    searchView: React.PropTypes.string.isRequired,
    fetching: React.PropTypes.bool.isRequired,
    hits: React.PropTypes.object.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    performSearchByQuery: React.PropTypes.func.isRequired
}

export default SearchResultContainer
