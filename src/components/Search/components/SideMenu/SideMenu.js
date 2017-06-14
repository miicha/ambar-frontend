import React, { Component } from 'react'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import { List, ListItem } from 'material-ui/List'
import TrashIcon from 'material-ui/svg-icons/action/delete'
import DateIcon from 'material-ui/svg-icons/action/today'
import ContentInbox from 'material-ui/svg-icons/content/inbox'
import ContentDrafts from 'material-ui/svg-icons/content/drafts'
import ContentSend from 'material-ui/svg-icons/content/send'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

import classes from './SideMenu.scss'

const menuItemStyle = {fontSize: '15px', padding: '10px 10px 10px 32px'}
const MenuItem = (props) => <ListItem {...props} innerDivStyle={menuItemStyle} />

const subHeaderStyle = {fontSize: '15px', color: '#777777', lineHeight: '20px', cursor: 'default', fontFamily: 'Roboto, sans-serif'}
const MenuLabel = ({children, ...props}) => <Subheader {...props} style={subHeaderStyle}>{children}</Subheader>

const SideMenu = ({performSearchByQuery}) => {
    return (
        <div className={classes.sideMenuContainer}>
            <MenuLabel>Time Range</MenuLabel>
            <List>
                <MenuItem primaryText='Today' onTouchTap={() => performSearchByQuery('when:today')} />
                <MenuItem primaryText='Yesterday' onTouchTap={() => performSearchByQuery('when:yesterday')} />
                <MenuItem primaryText='This Week' onTouchTap={() => performSearchByQuery('when:thisweek')} />
                <MenuItem primaryText='This Month' onTouchTap={() => performSearchByQuery('when:thismonth')} />
                <MenuItem primaryText='This Year' onTouchTap={() => performSearchByQuery('when:thisyear')} />
            </List>
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
                <MenuItem primaryText="Hidden" onTouchTap={() => performSearchByQuery('show:hidden')}/>
            </List>
        </div>
    )
}

SideMenu.propTypes = {
    performSearchByQuery: React.PropTypes.func.isRequired
}

export default SideMenu




