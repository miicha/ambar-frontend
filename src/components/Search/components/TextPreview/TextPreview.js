import React, { Component } from 'react'
import Dialog from 'material-ui/Dialog'
import { Card, CardText } from 'material-ui/Card'
import DetailedCardHeader from 'components/Search/components/Views/DetailedView/components/DetailedCard/components/DetailedCardHeader'
import FlatButton from 'material-ui/FlatButton'
import { LoadingIndicator, TagsInput } from 'components/BasicComponents'

import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

import classes from './TextPreview.scss'

const listItemStyle = { fontSize: '15px', padding: '7px 7px 7px 23px' }
const StyledListItem = (props) => <ListItem innerDivStyle={listItemStyle} {...props} />

const SecondaryText = (props) => <div {...props} style={{ fontSize: '11px', color: '#aaaaaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />

const subHeaderStyle = { fontSize: '15px', color: '#777777', lineHeight: '20px', cursor: 'default', fontFamily: 'Roboto, sans-serif', textTransform: 'capitalize' }
const MenuLabel = ({ children, ...props }) => <Subheader {...props} style={subHeaderStyle}>{children}</Subheader>


class TextPreview extends React.Component {
    render() {
        const { hit, searchByNamedEntity } = this.props
        const types = [...new Set(hit.named_entities_distinct.map(ne => ne.type))]

        return (
            <div className={classes.textPreviewDialogBody}>
                {types.length > 0 && <div className={classes.sidebar}>
                    {types.map((type) => {
                        return (
                            <List key={type}>
                                <MenuLabel>{type}</MenuLabel>
                                <TagsInput
                                    tags={hit.named_entities_distinct.filter(ne => ne.type == type)}
                                    showRemoveIcon={false}
                                    showAddField={false}
                                    performSearchByTag={(tag) => searchByNamedEntity(tag)}
                                    style={{ cursor: 'pointer', paddingLeft: '23px' }}
                                />
                            </List>)
                    })}
                </div>}
                <div className={classes.contentPreview}>
                    <CardText>
                        <span dangerouslySetInnerHTML={{ __html: hit.content.highlight.text[0] }}></span>
                    </CardText>
                </div>
            </div>)
    }
}

TextPreview.propTypes = {
    hit: React.PropTypes.object,
    searchByNamedEntity: React.PropTypes.func.isRequired
}

class TextPreviewDialog extends React.Component {
    render() {
        const {
            isOpened,
            closeModal,
            query,
            fetching,
            hit,
            performSearchByPathToFile,
            performSearchByAuthor,
            performSearchByNamedEntity,
            localization
        } = this.props

        const closeModalAndRunFunction = (ctx, func) => {
            closeModal()
            func(ctx)
        }

        const header = isOpened && !fetching
            ? <DetailedCardHeader
                searchQuery={query}
                meta={hit.meta}
                content={hit.content}
                performSearchByPathToFile={(filePath) => closeModalAndRunFunction(filePath, performSearchByPathToFile)}
                performSearchByAuthor={(author) => closeModalAndRunFunction(author, performSearchByAuthor)}
                localization={localization}
            />
            : null

        return (<Dialog
            title={header}
            open={isOpened}
            autoScrollBodyContent={false}
            onRequestClose={closeModal}
            bodyStyle={{ padding: '0' }}
        >
            {isOpened && fetching && <LoadingIndicator large />}
            {isOpened && !fetching && <TextPreview hit={hit} searchByNamedEntity={(tag) => closeModalAndRunFunction(tag, performSearchByNamedEntity)} />}
        </Dialog>
        )
    }

}

TextPreviewDialog.propTypes = {
    isOpened: React.PropTypes.bool.isRequired,
    fileId: React.PropTypes.string,
    query: React.PropTypes.string.isRequired,
    hit: React.PropTypes.object,
    closeModal: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchByNamedEntity: React.PropTypes.func.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default TextPreviewDialog