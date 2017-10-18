import { stateValueExtractor, titles, validators, analytics } from 'utils'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import 'whatwg-fetch'

const CHANGE_FIELD = 'SEARCH_TEXT_PREVIEW_MODAL.CHANGE_FIELD'
const TOGGLE_TEXT_PREVIEW_MODAL = 'SEARCH_TEXT_PREVIEW_MODAL.TOGGLE_TEXT_PREVIEW_MODAL'
const OPEN_MODAL = 'SEARCH_TEXT_PREVIEW_MODAL.OPEN_MODAL'
const CLOSE_MODAL = 'SEARCH_TEXT_PREVIEW_MODAL.CLOSE_MODAL'

const loadDocument = (file_id, query) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())        
        const query = getState()['searchPage'].searchQuery

        fetch(urls.ambarWebApiLoadFullContentHightlight(file_id, query), {
            ...defaultSettings,
            method: 'GET'
        })
        .then((resp) => {
            if (resp.status !== 200) { throw resp }
            else { return resp.json() }
        })
        .then((data) => {
            dispatch(changeField('textPreviewHit', data))
            dispatch(changeField('textPreviewFetching', false))
        })
        .catch((errorPayload) => {
            dispatch(handleError(errorPayload))
            dispatch(changeField('textPreviewFetching', false))
            console.error('textPreviewModal', errorPayload)
        })
    }
}

export const openTextPreview = (fileId = undefined) => {
    return (dispatch, getState) => {
        analytics().event('SEARCH_TEXT_PREVIEW_MODAL.OPEN')
        dispatch(openModal())
        dispatch(loadDocument(fileId))
    }
}

const openModal = () => {
    return {
        type: OPEN_MODAL        
    }
}

export const closeModal = () => {
    return (dispatch, getState) => {
        analytics().event('SEARCH_TEXT_PREVIEW_MODAL.CLOSE')
        dispatch(changeField('isTextPreviewOpen', false))        
        dispatch(changeField('textPreviewFileId', null))
        dispatch(changeField('textPreviewHit', null))
        dispatch(changeField('textPreviewFetching', false))
    }   
}

const changeField = (fieldName, value) => {
    return {
        type: CHANGE_FIELD,
        fieldName,
        value
    }
}

export const ACTION_HANDLERS = {
    [CHANGE_FIELD]: (state, action) => {
        const newState = { ...state }
        newState[action.fieldName] = action.value

        return newState
    },    
    [OPEN_MODAL]: (state, action) => {
        return {...state, isTextPreviewOpen: true, textPreviewFetching: true}
    }    
}