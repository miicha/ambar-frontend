import React, { Component } from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import { List, ListItem } from 'material-ui/List'
import UploadFileIcon from 'material-ui/svg-icons/file/file-upload'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

import classes from './SideMenu.scss'

const menuItemStyle = { fontSize: '15px', padding: '10px 10px 10px 32px' }
const MenuItem = (props) => <ListItem {...props} innerDivStyle={menuItemStyle} />

const subHeaderStyle = { fontSize: '15px', color: '#777777', lineHeight: '20px', cursor: 'default', fontFamily: 'Roboto, sans-serif' }
const MenuLabel = ({ children, ...props }) => <Subheader {...props} style={subHeaderStyle}>{children}</Subheader>

const SideMenu = ({ performSearchByQuery, toggleUploadModal, sources }) => {
    
    return (
        <div className={classes.sideMenuContainer}>
            <RaisedButton
                label='Upload Files'
                style={{ margin: '0 16px 10px 16px' }}
                primary={true}
                icon={<UploadFileIcon />}
                onTouchTap={toggleUploadModal}
            />
            <MenuLabel>Time Range</MenuLabel>
            <List>
                <MenuItem primaryText='Today' onTouchTap={() => performSearchByQuery('when:today')} />
                <MenuItem primaryText='Yesterday' onTouchTap={() => performSearchByQuery('when:yesterday')} />
                <MenuItem primaryText='This Week' onTouchTap={() => performSearchByQuery('when:thisweek')} />
                <MenuItem primaryText='This Month' onTouchTap={() => performSearchByQuery('when:thismonth')} />
                <MenuItem primaryText='This Year' onTouchTap={() => performSearchByQuery('when:thisyear')} />
            </List>
            {sources.size > 0 && <div>
                <MenuLabel>Source</MenuLabel>
                <List>
                    {Array.from(sources.values()).map(source => <MenuItem
                        primaryText={source.id}
                        secondaryText={source.description}
                        onTouchTap={() => performSearchByQuery(`source:${source.id}`)}
                        title={source.description}
                    />)}                                        
                </List>
            </div>}
            <MenuLabel>Size</MenuLabel>
            <List>
                <MenuItem                    
                    primaryText='Large'
                    secondaryText='Larger than 3MB'
                    onTouchTap={() => performSearchByQuery('size>3M')}
                />
                <MenuItem
                    primaryText='Small'
                    secondaryText='Smaller than 300KB'
                    onTouchTap={() => performSearchByQuery('size<300K')}
                />
            </List>
            <Divider />
            <List>
                <MenuItem primaryText="Hidden" onTouchTap={() => performSearchByQuery('show:hidden')} />
            </List>
        </div>
    )
}

SideMenu.propTypes = {
    performSearchByQuery: React.PropTypes.func.isRequired,
    toggleUploadModal: React.PropTypes.func.isRequired,
    sources: React.PropTypes.object.isRequired
}

export default SideMenu




