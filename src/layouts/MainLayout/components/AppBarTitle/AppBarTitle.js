import React from 'react'
import classes from './AppBarTitle.scss'

export const AppBarTitle = ({data, fetching }) => (
    <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ display: 'flex', flexGrow: '1' }}>
            {data.left ? data.left : <div />}                        
        </div>
        {data.center ? data.center : <div />}        
        <div style={{ display: 'flex', flexGrow: '1', alignItems: 'center', justifyContent: 'space-between', lineHeight: '36px' }}>
            {data.right ? data.right : <div />}                        
        </div>
    </div>
)

AppBarTitle.propTypes = {
    fetching: React.PropTypes.bool.isRequired,
    data: React.PropTypes.object.isRequired
}

export default AppBarTitle
