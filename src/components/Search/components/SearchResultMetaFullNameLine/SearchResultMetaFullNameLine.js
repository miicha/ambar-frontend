import React, { Component } from 'react'
import classes from './SearchResultMetaFullNameLine.scss'

const EM_TAG_REGEX = /<[\/]{0,1}em>/gim

const SearchResultMetaFullNameLine = (props) => {
    const { meta, performSearchByPathToFile } = props

    const fullPath = meta.full_name.replace(EM_TAG_REGEX, '')
    const fullPathParts = fullPath.split('/')
        .filter(part => part != '')
    const fullPathPartsExtended = fullPathParts
        .map((part, idx) => {
            const isLast = idx === fullPathParts.length - 1
            const trailingSymbol = isLast ? '' : '/'
            const trailingAsterisk = isLast ? '' : '*'
            return {
                part: `${part}${trailingSymbol}`,
                pathToPart: `//${fullPathParts.filter((part, innerIdx) => innerIdx <= idx).join('/')}${trailingSymbol}${trailingAsterisk}`
            }
        })

    const isHighlighted = EM_TAG_REGEX.test(meta.full_name)

    return (
        <div className={isHighlighted ? classes.metaFullNameLineContainerHighlighted : classes.metaFullNameLineContainer}>
            <span>//</span>
            {fullPathPartsExtended.map((part, idx) => <span
                className={classes.metaFullNamePart}
                key={idx}
                onTouchTap={() => performSearchByPathToFile(part.pathToPart)}>
                {part.part}
            </span>)}
        </div>
    )
}

SearchResultMetaFullNameLine.propTypes = {
    meta: React.PropTypes.object.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired
}

export default SearchResultMetaFullNameLine




