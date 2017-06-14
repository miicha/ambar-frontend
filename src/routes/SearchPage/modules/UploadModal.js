import { stateValueExtractor } from 'utils/'
import { analytics, FormDataPolyfill } from 'utils'
import { handleError, showInfo } from 'routes/CoreLayout/modules/CoreLayout'
import { loadSources } from 'routes/SearchPage/modules/SearchPage'
import 'whatwg-fetch'

export const TOGGLE_UPLOAD_MODAL = 'SEARCH_UPLOAD_MODAL.TOGGLE_UPLOAD_MODAL'
export const ADD_FILES_TO_UPLOAD = 'SEARCH_UPLOAD_MODAL.ADD_FILES_TO_UPLOAD'
export const REMOVE_FILE_TO_UPLOAD = 'SEARCH_UPLOAD_MODAL.REMOVE_FILE_TO_UPLOAD'
export const FILES_UPLOADING = 'SEARCH_UPLOAD_MODAL.FILES_UPLOADING'
export const CLEAN_FILES_TO_UPLOAD = 'SEARCH_UPLOAD_MODAL.CLEAN_FILES_TO_UPLOAD'
export const SET_BUCKET_NAME_VALIDATION_MESSAGE = 'SEARCH_UPLOAD_MODAL.SET_BUCKET_NAME_VALIDATION_MESSAGE'
export const SET_BUCKET_NAME = 'SEARCH_UPLOAD_MODAL.SET_BUCKET_NAME'

export const uploadFiles = () => {
    return (dispatch, getState) => {
        dispatch(filesUploading(true))

        const urls = stateValueExtractor.getUrls(getState())
        const authHeaders = stateValueExtractor.getAuthHeaders(getState())

        const { filesToUpload, bucketName } = getState()['searchPage']

        const BUCKET_NAME_REGEX = /^[0-9a-zA-Z\-]+$/
        if (!BUCKET_NAME_REGEX.test(bucketName)) {
            dispatch(filesUploading(false))
            dispatch(setBucketNameValidationMessage('Bucket name has illegal characters. Only numbers, letters and dashes are allowed.'))
            return
        }

        const uploadPromises = filesToUpload.map(file => new Promise((resolve, reject) => {
            const form = new FormDataPolyfill()
            form.set(file.name, file, file.name)

            fetch(urls.ambarWebApiPostFile(bucketName, file.name), {
                method: 'POST',
                body: form._asNative(),
                mode: 'cors',
                credentials: 'include',
                headers: {
                    ...authHeaders
                }
            }).then((resp) => {
                if (resp.status >= 400) {
                    throw resp
                }
                else { resolve() }
            })
                .catch((errorPayload) => reject(errorPayload))
        }))

        Promise.all(uploadPromises)
            .then((values) => {
                dispatch(filesUploading(false))
                dispatch(loadSources())
                dispatch(toggleUploadModal())
                dispatch(cleanFilesToUpload())
                dispatch(showInfo('Files succesfully uploaded'))
                analytics().event('SEARCH.UPLOAD_FILES', { count: uploadPromises.length })
            })
            .catch((errorPayload) => {
                dispatch(filesUploading(false))

                if (errorPayload.status === 507) {
                    dispatch(handleError('No free space left in your account', true))
                } else {
                    dispatch(handleError(errorPayload))
                    analytics().event('SEARCH.UPLOAD_FILES_ERROR', { error: errorPayload })
                }

                console.error('uploadFile', errorPayload)
            })
    }
}

export const toggleUploadModal = () => {
    return {
        type: TOGGLE_UPLOAD_MODAL
    }
}

export const addFilesToUpload = (files) => {
    return {
        type: ADD_FILES_TO_UPLOAD,
        files: files
    }
}

export const removeFileToUpload = (file) => {
    return {
        type: REMOVE_FILE_TO_UPLOAD,
        file: file
    }
}

export const setBucketName = (bucketName) => {
    return {
        type: SET_BUCKET_NAME,
        name: bucketName
    }
}


export const setBucketNameValidationMessage = (bucketNameValidationMessage) => {
    return {
        type: SET_BUCKET_NAME_VALIDATION_MESSAGE,
        message: bucketNameValidationMessage
    }
}

export const filesUploading = (isUploading) => {
    return {
        type: FILES_UPLOADING,
        isUploading: isUploading
    }
}

export const cleanFilesToUpload = () => {
    return {
        type: CLEAN_FILES_TO_UPLOAD
    }
}

export const ACTION_HANDLERS = {
    [TOGGLE_UPLOAD_MODAL]: (state, action) => {
        const newState = { ...state, isUploadModalOpen: !state.isUploadModalOpen }
        return newState
    },
    [ADD_FILES_TO_UPLOAD]: (state, action) => {
        const newState = { ...state, filesToUpload: [...state.filesToUpload, ...action.files] }
        return newState
    },
    [REMOVE_FILE_TO_UPLOAD]: (state, action) => {
        const newState = { ...state, filesToUpload: state.filesToUpload.filter(f => f !== action.file) }
        return newState
    },
    [SET_BUCKET_NAME]: (state, action) => {
        return { ...state, bucketName: action.name, bucketNameValidationMessage: '' }
    },
    [SET_BUCKET_NAME_VALIDATION_MESSAGE]: (state, action) => {
        return { ...state, bucketNameValidationMessage: action.message }
    },
    [FILES_UPLOADING]: (state, action) => {
        const newState = { ...state, isFilesUploading: action.isUploading }
        return newState
    },
    [CLEAN_FILES_TO_UPLOAD]: (state, action) => {
        const newState = { ...state, filesToUpload: [] }
        return newState
    }
}