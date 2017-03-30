import React from 'react'
import classes from './AmbarResponsiveLogo.scss'
import MediaQuery from 'react-responsive'

export const AmbarResponsiveLogo = ({colored = false}) => (
    <div className={classes.ambarResponsiveLogo} title="Ambar Version 1.0" >
        <img alt='Logo'
            src={colored ? 'owl-blue.svg' : 'owl.svg'} />
        <MediaQuery query='(min-width: 1024px)'>
            <img alt='Ambar'
                src={colored ? 'ambar-blue.svg' : 'ambar.svg'} />
        </MediaQuery>
    </div>)


AmbarResponsiveLogo.propTypes = {
}

export default AmbarResponsiveLogo
