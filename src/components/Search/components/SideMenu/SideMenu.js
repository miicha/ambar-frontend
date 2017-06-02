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

const SideMenu = (props) => {

    const menuItemStyle = {fontSize: '15px', padding: '10px 10px 10px 32px'}

    return (
        <div className={classes.sideMenuContainer}>
            <Subheader style={{fontSize: '15px', color: '#777777', lineHeight: '20px', cursor: 'default', fontFamily: 'Roboto, sans-serif'}}><DateIcon color='rgb(117, 117, 117)'/>Time Range</Subheader>
            <List>
                <ListItem
                    key={1}
                    innerDivStyle={menuItemStyle}
                    primaryText='Today'
                />
                <ListItem
                    key={2}
                    innerDivStyle={menuItemStyle}
                    primaryText='Yesterday'
                />
                <ListItem
                    key={3}
                    innerDivStyle={menuItemStyle}
                    primaryText='This Week'
                />
                <ListItem
                    key={3}
                    innerDivStyle={menuItemStyle}
                    primaryText='This Month'
                />
                <ListItem
                    key={4}
                    innerDivStyle={menuItemStyle}
                    primaryText='This Year'
                />
            </List>
            <Divider />
            <List>
                <ListItem
                    primaryText="Hidden"
                    innerDivStyle={menuItemStyle}
                    leftIcon={<TrashIcon />} 
                />
            </List>

        </div>
    )
}

SideMenu.propTypes = {
    performSearchByQuery: React.PropTypes.func.isRequired
}

export default SideMenu




