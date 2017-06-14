import React, { Component } from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import { List, ListItem } from 'material-ui/List'
import UploadFileIcon from 'material-ui/svg-icons/file/file-upload'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

import classes from './SideMenu.scss'

const menuItemStyle = { fontSize: '15px', padding: '7px 7px 7px 23px' }
const MenuItem = (props) => <ListItem {...props} innerDivStyle={menuItemStyle} />

const SecondaryText = (props) => <div {...props} style={{ fontSize: '11px', color: '#aaaaaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />

const subHeaderStyle = { fontSize: '15px', color: '#777777', lineHeight: '20px', cursor: 'default', fontFamily: 'Roboto, sans-serif' }
const MenuLabel = ({ children, ...props }) => <Subheader {...props} style={subHeaderStyle}>{children}</Subheader>

const SideMenu = ({ performSearchByQuery, performSearchBySource, performSearchBySize, performSearchByWhen, performSearchByShow, toggleUploadModal, sources }) =>
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
            <MenuLabel>Time Range</MenuLabel>
            <List>
                <MenuItem primaryText='Today' onTouchTap={() => performSearchByWhen('today')} />
                <MenuItem primaryText='Yesterday' onTouchTap={() => performSearchByWhen('yesterday')} />
                <MenuItem primaryText='This Week' onTouchTap={() => performSearchByWhen('thisweek')} />
                <MenuItem primaryText='This Month' onTouchTap={() => performSearchByWhen('thismonth')} />
                <MenuItem primaryText='This Year' onTouchTap={() => performSearchByWhen('thisyear')} />
            </List>
            {sources.size > 0 && <div>
                <MenuLabel>Source</MenuLabel>
                <List>
                    {Array.from(sources.values()).map(source => <MenuItem
                        primaryText={source.id}
                        secondaryText={<SecondaryText>{source.description}</SecondaryText>}
                        onTouchTap={() => performSearchBySource(source.id)}
                        title={source.description}
                        key={source.id}
                    />)}
                </List>
            </div>}
            <MenuLabel>Size</MenuLabel>
            <List>
                <MenuItem
                    primaryText='Large'
                    secondaryText={<SecondaryText>Larger than 3MB</SecondaryText>}
                    onTouchTap={() => performSearchBySize('>', '3M')}
                />
                <MenuItem
                    primaryText='Small'
                    secondaryText={<SecondaryText>Smaller than 300KB</SecondaryText>}
                    onTouchTap={() => performSearchBySize('<', '300K')}
                />
            </List>
            <Divider />
            <List>
                <MenuItem
                    primaryText="Hidden"
                    secondaryText={<SecondaryText>Show only hidden files</SecondaryText>}
                    onTouchTap={() => performSearchByShow('hidden')}
                />
            </List>
            <Divider />
            <List>
                <MenuItem
                    primaryText="Clear Query"
                    onTouchTap={() => performSearchByQuery('')}
                    style={{ color: '#dd6666' }}
                />
            </List>
        </div>
    )

SideMenu.propTypes = {
    performSearchByQuery: React.PropTypes.func.isRequired,
    performSearchBySource: React.PropTypes.func.isRequired,
    performSearchBySize: React.PropTypes.func.isRequired,
    performSearchByWhen: React.PropTypes.func.isRequired,
    performSearchByShow: React.PropTypes.func.isRequired,
    toggleUploadModal: React.PropTypes.func.isRequired,
    sources: React.PropTypes.object.isRequired
}

export default SideMenu




