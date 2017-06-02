import React, { Component } from 'react'

import ClearIcon from 'material-ui/svg-icons/content/clear'
import { LoadingIndicator } from 'components/BasicComponents'
import classes from './Tag.scss'

const Tag = ({ tagName, onRemove, onClick, isHighlighted, isFetching }) => {
    const onRemoveCallback = onRemove
        ? onRemove
        : () => { }

    const onClickCallback = onClick
        ? onClick
        : () => { }

    return (
        <div
            style={{ display: 'flex', alignItems: 'center' }}
            className={`${classes.tag} ${isHighlighted ? classes.highlight : ''} ${isFetching ? classes.loading : ''}`}
            onTouchTap={(e) => {
                e.stopPropagation()                
                onClickCallback(tagName)
            }}>
            <span>{tagName}</span>
            {!isFetching && <ClearIcon
                className={classes.removeTagButton}
                onTouchTap={(e) => {
                    e.stopPropagation()
                    onRemoveCallback(tagName)
                }}
                hoverColor='#FF5722'
                style={{ color: 'inherit', width: '1em', height: '1em' }}
            />}            
        </div>
    )
}

Tag.propTypes = {
    tagName: React.PropTypes.string.isRequired,
    onRemove: React.PropTypes.func,
    onClick: React.PropTypes.func,
    isHighlighted: React.PropTypes.bool
}

export default Tag




