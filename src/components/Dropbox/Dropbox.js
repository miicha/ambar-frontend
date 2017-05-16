import React from 'react'
import Dialog from 'material-ui/Dialog'
import Toggle from 'material-ui/Toggle'
import Avatar from 'material-ui/Avatar'
import FileFolder from 'material-ui/svg-icons/file/folder'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { List, ListItem } from 'material-ui/List'
import { FullScreenPattern } from 'components/BasicComponents'
import { LoadingIndicator } from 'components/BasicComponents'
import { cyan500, gray500, gray200 } from 'material-ui/styles/colors'
import classes from './Dropbox.scss'

const stripFolderPath = (path) => path.slice(1).substring(path.lastIndexOf('/'))

const folderItem = (folder, loadDropboxFolder, toggleOpenDropboxFolder, toggleSelectDropboxFolder) =>
  <ListItem
    key={folder.path}
    primaryTogglesNestedList={false}
    className={classes.noSelect}
    style={{ cursor: 'default' }}
    primaryText={stripFolderPath(folder.path)}
    secondaryText={folder.childrenLoaded && folder.children.length === 0 && 'No subfolders'}
    leftAvatar={<Avatar
      style={{ cursor: 'pointer' }}
      icon={folder.fetching ? <LoadingIndicator small color={'#ffffff'} /> : <FileFolder />}
      backgroundColor={folder.selected ? cyan500 : gray500}
      onTouchTap={(event) => {
        if (folder.fetching) {
          return
        }
        if (!folder.childrenLoaded) {
          loadDropboxFolder(folder.path)
          return
        }

        toggleOpenDropboxFolder(folder.path, !folder.open)
      }}
    />}
    rightToggle={
      <Toggle
        toggled={folder.selected}
        disabled={folder.freezed || folder.fetching}
        onTouchTap={() => {
          toggleSelectDropboxFolder(folder.path, !folder.selected)
        }} />
    }
    open={folder.open}
    nestedItems={
      folder.fetching
        ? []
        : folder.children.map((childFolder) => folderItem(childFolder, loadDropboxFolder, toggleOpenDropboxFolder, toggleSelectDropboxFolder))
    }
  />

export class Dropbox extends React.Component {
  componentDidMount() {
    const { setPageTitle, setDropboxTokenFromGetParams, stopLoadingIndicator } = this.props

    setPageTitle('Ambar Integrations: Dropbox')
    setDropboxTokenFromGetParams()
    stopLoadingIndicator()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  render() {
    const { fetching, errorMessage, folder, loadDropboxFolder, toggleOpenDropboxFolder, toggleSelectDropboxFolder, connectDropbox } = this.props

    const actions = [
      <RaisedButton
        label={folder.selected ? 'Deselect all' : 'Select all'}
        primary={folder.selected ? false : true}
        secondary={folder.selected ? true : false}
        disabled={fetching || folder.fetching}
        onTouchTap={() => {
          toggleSelectDropboxFolder('', !folder.selected)
        }}
      />,
      errorMessage ? <div className={classes.dropboxErrorMessage}>{errorMessage}</div> : undefined
      ,
      <RaisedButton
        label='Connect'
        primary={true}
        disabled={fetching || folder.fetching}
        onTouchTap={() => {
          connectDropbox()
        }}
      />
    ]

    const title = (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <img height='32px' src='dropbox.svg' alt='dropbox' style={{ marginRight: '10px' }} />
        <span>Select folders</span>
      </div>
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#aaaaaa', lineHeight: '18px', marginBottom: '0' }}>Ambar will collect and index your documents from selected Dropbox folders</p>
    </div>)

    return (
      <FullScreenPattern>
        <Dialog
          contentStyle={{ maxWidth: '500px' }}
          title={title}
          titleStyle={{ padding: '15px' }}
          actionsContainerClassName={classes.dropboxActionsContainer}
          modal={true}
          open={true}
          onRequestClose={() => { }}
          bodyStyle={{ padding: '5px' }}
          autoScrollBodyContent={true}
          actions={actions}
        >
          {(fetching || folder.fetching) && <LoadingIndicator large />}
          {!(fetching || folder.fetching) &&
            <List>
              {folder.children.map((childFolder) => folderItem(childFolder, loadDropboxFolder, toggleOpenDropboxFolder, toggleSelectDropboxFolder))}
            </List>
          }
        </Dialog>
      </FullScreenPattern>
    )
  }
}

Dropbox.propTypes = {
  mode: React.PropTypes.string.isRequired,
  errorMessage: React.PropTypes.string,
  fetching: React.PropTypes.bool.isRequired,
  setDropboxTokenFromGetParams: React.PropTypes.func.isRequired,
  folder: React.PropTypes.object.isRequired,
  loadDropboxFolder: React.PropTypes.func.isRequired,
  toggleOpenDropboxFolder: React.PropTypes.func.isRequired,
  toggleSelectDropboxFolder: React.PropTypes.func.isRequired,
  connectDropbox: React.PropTypes.func.isRequired,
  startLoadingIndicator: React.PropTypes.func.isRequired,
  stopLoadingIndicator: React.PropTypes.func.isRequired
}

export default Dropbox
