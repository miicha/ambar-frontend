import React, { Component } from 'react'

import SearchCard from 'routes/SearchPage/containers/SearchCardContainer'
import DetailedCard from './components/DetailedCard'
import classes from './DetailedView.scss'

class DetailedView extends Component {
    render() {
        const { hits } = this.props

        return (
            <div className='pageContainer'>
                {hits.map((hit, idx) =>
                    <SearchCard
                        key={hit.file_id}
                        fileId={hit.file_id}                        
                        Component={DetailedCard}
                    />                    
                )}
            </div>
        )
    }
}

DetailedView.propTypes = {
    hits: React.PropTypes.array.isRequired
}

export default DetailedView
