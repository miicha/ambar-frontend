import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { List, ListItem } from 'material-ui/List'
import UploadFileIcon from 'material-ui/svg-icons/file/file-upload'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import { TagsInput } from 'components/BasicComponents'
import classes from './SideMenu.scss'

const listItemStyle = { fontSize: '15px', padding: '7px 7px 7px 23px' }
const StyledListItem = (props) => <ListItem innerDivStyle={listItemStyle} {...props} />

const SecondaryText = (props) => <div {...props} style={{ fontSize: '11px', color: '#aaaaaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />

const subHeaderStyle = { fontSize: '15px', color: '#777777', lineHeight: '20px', cursor: 'default', fontFamily: 'Roboto, sans-serif' }
const MenuLabel = ({ children, ...props }) => <Subheader {...props} style={subHeaderStyle}>{children}</Subheader>

const SideMenu = ({ performSearchByQuery, performSearchBySize, performSearchByWhen, performSearchByShow, performSearchByTag, toggleUploadModal, setSearchResultView, searchView, allTags }) =>
    (
        <div className={classes.sideMenuContainer}>
            <RaisedButton
                label='Upload Files'
                style={{ margin: '-2px 16px 16px 16px' }}
                labelColor={'#00bcd4'}
                backgroundColor={'#ffffff'}
                icon={<UploadFileIcon />}
                onTouchTap={toggleUploadModal}
            />
            <Divider style={{ marginBottom: '10px' }} />
            <MenuLabel>View</MenuLabel>
            <List>
                <StyledListItem primaryText='Detailed' style={{ fontWeight: searchView === 'detailed' ? 'bold' : 'normal' }} onTouchTap={() => setSearchResultView('detailed')} />
                <StyledListItem primaryText='Table' style={{ fontWeight: searchView === 'table' ? 'bold' : 'normal' }} onTouchTap={() => setSearchResultView('table')} />
            </List>
            {allTags.length > 0 &&
                <div>
                    <Divider />
                    <List>
                        <MenuLabel>Tags</MenuLabel>
                        <TagsInput
                            tags={allTags}
                            showRemoveIcon={false}
                            showAddField={false}
                            performSearchByTag={performSearchByTag}
                            style={{ cursor: 'pointer', paddingLeft: '23px' }}
                        />
                    </List>
                </div>}
            <Divider style={{ marginBottom: '10px' }} />
            <MenuLabel>Time Range</MenuLabel>
            <List>
                <StyledListItem primaryText='Today' onTouchTap={() => performSearchByWhen('today')} />
                <StyledListItem primaryText='Yesterday' onTouchTap={() => performSearchByWhen('yesterday')} />
                <StyledListItem primaryText='This Week' onTouchTap={() => performSearchByWhen('thisweek')} />
                <StyledListItem primaryText='This Month' onTouchTap={() => performSearchByWhen('thismonth')} />
                <StyledListItem primaryText='This Year' onTouchTap={() => performSearchByWhen('thisyear')} />
            </List>

            <Divider />
            <List>
                <MenuLabel>Trash</MenuLabel>
                <StyledListItem
                    primaryText='Removed Files'
                    onTouchTap={() => performSearchByShow('removed')}
                />
            </List>
            <Divider />
            <List>
                <StyledListItem
                    primaryText="Clear Query"
                    onTouchTap={() => performSearchByQuery('')}
                    style={{ color: '#dd6666' }}
                />
            </List>
        </div>
    )

SideMenu.propTypes = {
    performSearchByQuery: React.PropTypes.func.isRequired,
    performSearchBySize: React.PropTypes.func.isRequired,
    performSearchByWhen: React.PropTypes.func.isRequired,
    performSearchByShow: React.PropTypes.func.isRequired,
    performSearchByTag: React.PropTypes.func.isRequired,
    toggleUploadModal: React.PropTypes.func.isRequired,
    setSearchResultView: React.PropTypes.func.isRequired,
    searchView: React.PropTypes.string.isRequired,
    allTags: React.PropTypes.array.isRequired
}

export default SideMenu




