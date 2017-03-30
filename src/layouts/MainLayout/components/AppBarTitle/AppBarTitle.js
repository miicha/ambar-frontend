import React from 'react'
import classes from './AppBarTitle.scss'
import SearchInput from '../../components/SearchInput'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import MediaQuery from 'react-responsive'
import MoreHoriz from 'material-ui/svg-icons/navigation/more-horiz'

import { cyan100, cyan300, cyan400 } from 'material-ui/styles/colors'

export const AppBarTitle = ({showSearchInput, title, setQuery, query, performSearch, fetching, mode, toggleRefineSearchModal }) => (
    <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ display: 'flex', flexGrow: '1' }}>
            {showSearchInput && <MediaQuery query='(min-width: 1024px)'>{title}</MediaQuery>}
            {!showSearchInput && <span>{title}</span>}
        </div>
        {showSearchInput &&
            <SearchInput setQuery={setQuery} query={query} performSearch={performSearch} />
        }
        <div style={{ display: 'flex', flexGrow: '1', alignItems: 'center', justifyContent: 'space-between', lineHeight: '36px' }}>
            {showSearchInput && <FlatButton
                style={{ height: '34px', 'lineHeight': '10px', width: '34px', 'minWidth': '34px' }}
                backgroundColor={cyan300}
                hoverColor={cyan400}
                onTouchTap={() => toggleRefineSearchModal()}
                icon={<MoreHoriz color={cyan100} />}
            />}
            {!showSearchInput && <div />}
        </div>
    </div>
)

AppBarTitle.propTypes = {
    mode: React.PropTypes.string.isRequired,
    fetching: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    showSearchInput: React.PropTypes.bool.isRequired,
    setQuery: React.PropTypes.func.isRequired,
    performSearch: React.PropTypes.func.isRequired,
    query: React.PropTypes.string.isRequired
}

export default AppBarTitle
