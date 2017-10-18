import React, { Component } from 'react'
import Dialog from 'material-ui/Dialog'
import { Card, CardText } from 'material-ui/Card'
import DetailedCardHeader from 'components/Search/components/SearchResultContainer/components/DetailedView/components/DetailedCard/components/DetailedCardHeader'
import FlatButton from 'material-ui/FlatButton'
import { LoadingIndicator, TagsInput } from 'components/BasicComponents'

import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

import classes from './TextPreview.scss'

const listItemStyle = { fontSize: '15px', padding: '7px 7px 7px 23px' }
const StyledListItem = (props) => <ListItem innerDivStyle={listItemStyle} {...props} />

const SecondaryText = (props) => <div {...props} style={{ fontSize: '11px', color: '#aaaaaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />

const subHeaderStyle = { fontSize: '15px', color: '#777777', lineHeight: '20px', cursor: 'default', fontFamily: 'Roboto, sans-serif' }
const MenuLabel = ({ children, ...props }) => <Subheader {...props} style={subHeaderStyle}>{children}</Subheader>

class TextPreview extends React.Component {
    render() {
        const { isOpened, closeModal, query, fetching, hit, performSearchByPathToFile, performSearchByAuthor, performSearchByNamedEntity, namedEntityTypes } = this.props

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
            {isOpened && !fetching &&
                <div className={classes.textPreviewDialogBody}>
                    {hit.named_entities_distinct.length > 0 && <div className={classes.sidebar}>
                        {namedEntityTypes.map(neType => {
                            if (hit.named_entities_distinct.some(ne => ne.type === neType.name))
                                return (
                                    <List key={neType.name}>
                                        <MenuLabel>{neType.description}</MenuLabel>
                                        <TagsInput
                                            tags={hit.named_entities_distinct.filter(ne => ne.type == neType.name)}
                                            showRemoveIcon={false}
                                            showAddField={false}
                                            performSearchByTag={(tag) => {
                                                closeModalAndRunFunction(tag, performSearchByNamedEntity)
                                            }}
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
                </div>
            }
        </Dialog>
        )
    }

}

TextPreview.propTypes = {
    isOpened: React.PropTypes.bool.isRequired,
    fileId: React.PropTypes.string,
    query: React.PropTypes.string.isRequired,
    hit: React.PropTypes.object,
    namedEntityTypes: React.PropTypes.array.isRequired,
    closeModal: React.PropTypes.func.isRequired,
    performSearchByPathToFile: React.PropTypes.func.isRequired,
    performSearchByAuthor: React.PropTypes.func.isRequired,
    performSearchByNamedEntity: React.PropTypes.func.isRequired
}

export default TextPreview