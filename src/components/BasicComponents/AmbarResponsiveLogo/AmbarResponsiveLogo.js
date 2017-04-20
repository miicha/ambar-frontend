import React from 'react'
import classes from './AmbarResponsiveLogo.scss'
import MediaQuery from 'react-responsive'

export const AmbarResponsiveLogo = ({mode, version}) => (
    <div className={classes.ambarResponsiveLogo} title={`Ambar ${mode.toUpperCase()} ${version}`} >
        <img alt='Logo'
            src={'owl.svg'} />
        <MediaQuery query='(min-width: 1024px)'>
            <img alt='Ambar'
                src={'ambar.svg'} />
        </MediaQuery>
    </div>)


AmbarResponsiveLogo.propTypes = {
    mode: React.PropTypes.string.isRequired,
    version: React.PropTypes.string.isRequired
}

export default AmbarResponsiveLogo