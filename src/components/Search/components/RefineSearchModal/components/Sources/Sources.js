import React, { Component } from 'react'

import { List, ListItem } from 'material-ui/List'
import FileFolder from 'material-ui/svg-icons/file/folder'
import BugReport from 'material-ui/svg-icons/action/bug-report'
import Apps from 'material-ui/svg-icons/navigation/apps'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Subheader from 'material-ui/Subheader'
import Toggle from 'material-ui/Toggle'
import { cyan500, gray500 } from 'material-ui/styles/colors'

import classes from './Sources.scss'

const Sources = (props) => {
    const { sources, toggleSourceSelected } = props

    return (
        <List>
            {(!sources || sources.size) == 0 &&
            <ListItem
                leftAvatar={<Avatar icon={<Apps />} backgroundColor={gray500} />}
                primaryText='No sources defined yet...'
                secondaryText='Upload some files or integrate your Dropbox'
            />
            }
            {sources && Array.from(sources.values()).map(source =>
                <ListItem
                    key={source.id}
                    leftAvatar={<Avatar icon={source.type === 'bucket' ? <FileFolder /> : <BugReport />} backgroundColor={source.selected ? cyan500 : gray500} />}
                    primaryText={source.id}
                    secondaryText={source.description}
                    rightToggle={<Toggle toggled={source.selected} onToggle={() => toggleSourceSelected(source.id)} />}
                />
            )}
        </List>
    )
}

Sources.propTypes = {
    sources: React.PropTypes.object.isRequired,
    toggleSourceSelected: React.PropTypes.func.isRequired
}

export default Sources
