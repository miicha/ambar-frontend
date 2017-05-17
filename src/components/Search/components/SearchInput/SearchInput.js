import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'
import SearchIcon from 'material-ui/svg-icons/action/search'
import MediaQuery from 'react-responsive'
import classes from './SearchInput.scss'

class SearchInput extends Component {
    timeoutId = null

    getSuggestions(currentValue) {
        const possibleCommands = [
            'filename:',
            'source:',
            'size>',
            'size<',
            'when:today',
            'when:thisweek',
            'when:thismonth',
            'when:thisyear',
            'author:'
        ]
        
        const lastSpaceSymbol = currentValue.lastIndexOf(' ')
        const prefix = lastSpaceSymbol === -1 ? '' : currentValue.slice(0, lastSpaceSymbol)                       

        return possibleCommands.map(val => `${prefix} ${val}`)
    }

    shouldComponentUpdate(nextProp) {
        return this.props.query !== nextProp.query
    }

    render() {
        const { performSearch, setQuery, query } = this.props        

        const hintText = <span>
            <MediaQuery query='(min-width: 1024px)'>Type query here and hit "Enter"</MediaQuery>
            <MediaQuery query='(max-width: 1023px)'>Search</MediaQuery>
        </span>

        return (
            <div style={{ display: 'flex', justifyContent: 'flex-start', flexGrow: '2', margin: '15px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '15px', marginRight: '3px' }}>
                    <SearchIcon style={{ color: 'white', height: '100%' }} onTouchTap={() => performSearch(0, query)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <AutoComplete
                        animated={false}
                        ref='search_input'
                        name='search_input'
                        fullWidth={true}
                        style={{ width: '100%' }}
                        inputStyle={{ color: 'white', width: '100%' }}
                        hintStyle={{ color: '#EEEEEE' }}
                        hintText={hintText}
                        spellCheck={false}
                        searchText={query}
                        dataSource={this.getSuggestions(query)}                        
                        onKeyPress={(event) => {
                            if (event.charCode === 13) {
                                performSearch(0, query)                             
                                return
                            }
                        }}
                        onKeyDown={(event) => {
                            clearTimeout(this.timeoutId)
                        }}
                        onUpdateInput={(newValue, dataSource, params) => {
                            clearTimeout(this.timeoutId)
                            setQuery(newValue)

                            this.timeoutId = setTimeout(() => {
                                performSearch(0, newValue)
                            }, 200)
                        }}
                        onClose={() => {
                            this.refs.search_input.focus()
                        }}
                        underlineShow={false}
                    />
                </div>
            </div>
        )
    }
}

SearchInput.propTypes = {
    query: React.PropTypes.string.isRequired,
    performSearch: React.PropTypes.func.isRequired,
    setQuery: React.PropTypes.func.isRequired
}

export default SearchInput