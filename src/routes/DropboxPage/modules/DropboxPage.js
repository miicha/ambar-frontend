import { stateValueExtractor, errors, validators } from 'utils/'
import { push } from 'react-router-redux'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import Dropbox from 'dropbox'
import 'whatwg-fetch'

const CHANGE_FIELD = 'DROPBOX.CHANGE_FIELD'

export const setDropboxTokenFromGetParams = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const location = getState().router.locationBeforeTransitions        

        if (!location.hash || location.hash == '') {
            dispatch(push('/account'))
            return
        }

        const credentials = urls.getParamsFromQuery(location.hash)

        if (credentials.error) {
            dispatch(push('/account'))
            return
        }        

        const newUri = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
        window.history.pushState({ path: newUri }, '', newUri)

        dispatch(changeField('credentials', credentials))
        dispatch(changeField('fetching', false))

        dispatch(loadDropboxFolder(''))
    }
}

const setSubFolderFieldBySubFolderPath = (rootFolder, subFolderPath, fieldName, fieldValue) => {
    if (!subFolderPath || (rootFolder.path.toLowerCase() === subFolderPath.toLowerCase())) {

        // recursively setting children selected
        if (fieldName === 'children') {
            fieldValue = fieldValue.map(child => { return { ...child, selected: rootFolder.selected, freezed: rootFolder.selected } })
        }

        // recursively freezing/unfreezing children
        if (fieldName === 'selected') {
            rootFolder.children.forEach(child => {
                setSubFolderFieldBySubFolderPath(child, null, 'freezed', fieldValue)
                setSubFolderFieldBySubFolderPath(child, null, 'selected', fieldValue)
            })
        }

        rootFolder[fieldName] = fieldValue
        return
    }

    rootFolder.children.forEach(childFolder => {
        setSubFolderFieldBySubFolderPath(childFolder, subFolderPath, fieldName, fieldValue)
    })
}

const getSelectedPaths = (rootFolder, selectedPaths) => {
    if (rootFolder.selected && !rootFolder.freezed) {
        selectedPaths.push(rootFolder.path)
    }

    rootFolder.children.forEach(childFolder => {
        getSelectedPaths(childFolder, selectedPaths)
    })
}

export const toggleOpenDropboxFolder = (folderPath, open) => {
    return (dispatch, getState) => {
        const rootFolder = getState()['dropbox'].folder
        setSubFolderFieldBySubFolderPath(rootFolder, folderPath, 'open', open)
        dispatch(changeField('folder', { ...rootFolder }))
    }
}

export const toggleSelectDropboxFolder = (folderPath, selected) => {
    return (dispatch, getState) => {
        const rootFolder = getState()['dropbox'].folder
        setSubFolderFieldBySubFolderPath(rootFolder, folderPath, 'selected', selected)
        dispatch(changeField('folder', { ...rootFolder }))
        dispatch(changeField('errorMessage', undefined))
    }
}

export const loadDropboxFolder = (folderPath) => {
    return (dispatch, getState) => {
        const credentials = getState()['dropbox'].credentials

        if (!credentials) {
            dispatch(handleError('No dropbox credentials found'))
            console.error('loadDropboxFolder', 'No dropbox credentials found')
            return
        }

        const rootFolder = getState()['dropbox'].folder
        setSubFolderFieldBySubFolderPath(rootFolder, folderPath, 'fetching', true)
        setSubFolderFieldBySubFolderPath(rootFolder, folderPath, 'open', true)
        dispatch(changeField('folder', { ...rootFolder }))

        let dbx = new Dropbox({ accessToken: credentials.access_token })

        dbx.filesListFolder({ path: folderPath })
            .then((resp) => {
                const children = resp.entries.filter(entry => entry['.tag'] === 'folder').map(entry => {
                    return {
                        path: entry.path_display,
                        selected: false,
                        open: false,
                        freezed: false,
                        fetching: false,
                        childrenLoaded: false,
                        children: []
                    }
                })
                setSubFolderFieldBySubFolderPath(rootFolder, folderPath, 'children', children)
                setSubFolderFieldBySubFolderPath(rootFolder, folderPath, 'childrenLoaded', true)
                setSubFolderFieldBySubFolderPath(rootFolder, folderPath, 'fetching', false)
                dispatch(changeField('folder', { ...rootFolder }))
            })
            .catch(err => {
                setSubFolderFieldBySubFolderPath(rootFolder, folderPath, 'fetching', false)
                dispatch(changeField('folder', { ...rootFolder }))
                dispatch(handleError(err))
                console.error('loadDropboxFolder', err)
            });

    }
}

export const connectDropbox = () => {
    return (dispatch, getState) => {
        const credentials = getState()['dropbox'].credentials

        if (!credentials) {
            dispatch(handleError('No dropbox credentials found'))
            console.error('loadDropboxFolder', 'No dropbox credentials found')
            return
        }

        const rootFolder = getState()['dropbox'].folder
        const selectedFolders = []
        getSelectedPaths(rootFolder, selectedFolders)

        if (selectedFolders.length === 0) {
            dispatch(changeField('errorMessage', 'Please select at least one folder!'))
            return
        }

        dispatch(changeField('fetching', true))

        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        const dropboxSettings = {
            accountId: credentials.account_id,
            token: credentials.access_token,
            locations: selectedFolders
        }

        fetch(urls.ambarWebApiCreateDropboxCrawler(), {
            ...defaultSettings,
            method: 'POST',
            body: JSON.stringify(dropboxSettings)
        })
            .then((resp) => {
                if (resp.status === 201) {
                    dispatch(changeField('fetching', false))
                    dispatch(push('/account'))
                    return
                }

                throw new Error('Error connecting to Dropbox!')
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(handleError(errorPayload))
                console.error('connectDropbox', errorPayload)
            })
    }
}

const changeField = (fieldName, value) => {
    return {
        type: CHANGE_FIELD,
        fieldName,
        value
    }
}

const ACTION_HANDLERS = {
    [CHANGE_FIELD]: (state, action) => {
        const newState = { ...state }
        newState[action.fieldName] = action.value
        return newState
    }
}

const initialState = {
    fetching: true,
    query: undefined,
    credentials: undefined,
    errorMessage: undefined,
    folder: {
        path: '',
        selected: false,
        open: false,
        freezed: false,
        fetching: false,
        childrenLoaded: false,
        children: []
    }
}

export default function accountPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}