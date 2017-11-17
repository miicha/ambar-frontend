import { stateValueExtractor, errors, validators, analytics } from 'utils/'
import { push } from 'react-router-redux'
import { setAuth } from 'routes/AuthLayout/modules/AuthLayout'
import { handleError, showInfo } from 'routes/CoreLayout/modules/CoreLayout'
import { startLoadingIndicator, stopLoadingIndicator } from 'routes/MainLayout/modules/MainLayout'
import 'whatwg-fetch'

const CHANGE_FIELD = 'ACCOUNT.CHANGE_FIELD'

export const performPasswordChange = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())
        const localization = stateValueExtractor.getLocalization(getState())

        const changePasswordData = {
            password: getState()['accountPage'].oldPassword,
            newPassword: getState()['accountPage'].newPassword,
            newPasswordConfirmation: getState()['accountPage'].newPasswordConfirmation
        }

        dispatch(changeField('oldPasswordError', ''))
        dispatch(changeField('newPasswordError', ''))
        dispatch(changeField('newPasswordConfirmationError', ''))

        let isValid = true

        if (!changePasswordData.password) {
            dispatch(changeField('oldPasswordError', localization.accountPage.fieldRequiredLabel))
            isValid = false
        }

        if (!changePasswordData.newPassword) {
            dispatch(changeField('newPasswordError', localization.accountPage.fieldRequiredLabel))
            isValid = false
        } else if (!validators.isStrongPassword(changePasswordData.newPassword)) {
            dispatch(changeField('newPasswordError', localization.accountPage.weakPasswordLabel))
            isValid = false
        }

        if (!changePasswordData.newPasswordConfirmation) {
            dispatch(changeField('newPasswordConfirmationError', localization.accountPage.fieldRequiredLabel))
            isValid = false
        } else if (changePasswordData.newPassword !== changePasswordData.newPasswordConfirmation) {
            dispatch(changeField('newPasswordConfirmationError', localization.accountPage.differentPasswordsLabel))
            isValid = false
        }

        if (!isValid) {
            return
        }

        dispatch(startLoadingIndicator())
        dispatch(changeField('fetching', true))

        fetch(urls.ambarWebApiChangePassword(), {
            ...defaultSettings,
            method: 'POST',
            body: JSON.stringify(changePasswordData)
        })
            .then((resp) => {
                if (resp.status === 200) { return {} }
                else if (resp.status === 500) { throw new Error(resp) }
                else { return resp.json() }
            })
            .then((data) => {
                dispatch(changeField('fetching', false))
                dispatch(stopLoadingIndicator())

                if (data.message) {
                    dispatch(changeField('newPasswordConfirmationError', data.message))
                } else {
                    dispatch(changeField('oldPassword', ''))
                    dispatch(changeField('newPassword', ''))
                    dispatch(changeField('newPasswordConfirmation', ''))
                    dispatch(showInfo(localization.accountPage.passwordChangedLabel))
                    analytics().event('ACCOUNT.PASSWORD_CHANGED')
                }
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(stopLoadingIndicator())
                dispatch(handleError(errorPayload))
                console.error('performPasswordChange', errorPayload)
            })
    }
}

export const performLogout = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(changeField('fetching', true))

        fetch(urls.ambarWebApiLogout(), {
            ...defaultSettings,
            method: 'POST'
        })
            .then((resp) => {
                if (resp.status === 200) { return }
                throw resp
            })
            .then(() => {
                dispatch(changeField('fetching', false))
                dispatch(setAuth('', '', ''))
                dispatch(push('/login'))
                analytics().event('ACCOUNT.LOGOUT')
                analytics().reset()
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(handleError(errorPayload))
                console.error('performLogout', errorPayload)
            })
    }
}

export const toggleRemoveUserAccountDialog = () => {
    return (dispatch, getState) => {
        const curState = getState()['accountPage'].showRemoveUserAccountDialog
        dispatch(changeField('showRemoveUserAccountDialog', !curState))
    }
}

export const removeUserAccount = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(changeField('fetching', true))
        dispatch(startLoadingIndicator())

        fetch(urls.ambarWebApiDeleteUser(), {
            ...defaultSettings,
            method: 'DELETE'
        })
            .then((resp) => {
                if (resp.status === 200) { return }
                throw resp
            })
            .then(() => {
                dispatch(changeField('fetching', false))
                dispatch(setAuth('', '', ''))
                dispatch(push('/signup'))
                analytics().event('ACCOUNT.DELETE')
                analytics().reset()
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(stopLoadingIndicator())
                dispatch(handleError(errorPayload))
                console.error('deleteUser', errorPayload)
            })

    }
}

export const loadDropboxCrawler = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(changeField('fetching', true))
        dispatch(startLoadingIndicator())

        fetch(urls.ambarWebApiGetDropboxCrawler(), {
            ...defaultSettings,
            method: 'GET'
        })
            .then((resp) => {
                if (resp.status === 404) {
                    dispatch(changeField('dropboxCrawler', undefined))
                    dispatch(changeField('fetching', false))
                    dispatch(stopLoadingIndicator())
                    return
                }

                return resp.json()
                    .then((crawler) => {
                        dispatch(changeField('dropboxCrawler', crawler))
                        dispatch(changeField('fetching', false))
                        dispatch(stopLoadingIndicator())
                    })
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(stopLoadingIndicator())
                dispatch(handleError(errorPayload))
                console.error('loadDropboxCrawler', errorPayload)
            })
    }
}

export const initDropboxCrawler = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        const integrations = getState()['core'].integrations

        window.open(urls.dropboxApiAuthorize(integrations.dropbox), '_self')
        analytics().event('ACCOUNT.START_DROPBOX_INTEGRATION')
    }
}

export const deleteDropboxCrawler = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(changeField('fetching', true))
        dispatch(startLoadingIndicator())

        fetch(urls.ambarWebApiDeleteDropboxCrawler(), {
            ...defaultSettings,
            method: 'DELETE'
        })
            .then((resp) => {
                if (resp.status === 200) {
                    dispatch(changeField('dropboxCrawler', undefined))
                    dispatch(changeField('fetching', false))
                    dispatch(stopLoadingIndicator())
                    analytics().event('ACCOUNT.DISABLE_DROPBOX_INTEGRATION')
                    return
                }

                throw new Error('Error deleting Dropbox!')
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(stopLoadingIndicator())
                dispatch(handleError(errorPayload))
                console.error('deleteDropboxCrawler', errorPayload)
            })
    }
}

export const loadUserInfo = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())

        dispatch(changeField('fetching', true))
        dispatch(startLoadingIndicator())

        fetch(urls.ambarWebApiUserInfo(), {
            ...defaultSettings,
            method: 'GET'
        })
            .then((resp) => {
                if (resp.status === 200) { return resp.json() }
                throw resp
            })
            .then((data) => {
                let lang = data.lang_analyzer === 'ambar_en'
                    ? 'English'
                    : data.lang_analyzer === 'ambar_ru'
                        ? 'Russian'
                        : data.lang_analyzer === 'ambar_it'
                            ? 'Italian'
                            : data.lang_analyzer === 'ambar_de'
                                ? 'German'
                                : data.lang_analyzer === 'ambar_pl'
                                    ? 'Polish'
                                    : data.lang_analyzer === 'ambar_cjk'
                                        ? 'CJK'
                                        : data.lang_analyzer === 'ambar_cn'
                                            ? 'Chinese'
                                                : 'Berberian'

                let plan = data.plan === 'unlim'
                    ? 'Unlimited'
                    : data.plan === 'pro'
                        ? 'Pro'
                        : 'Free'

                dispatch(changeField('fetching', false))
                dispatch(stopLoadingIndicator())
                dispatch(changeField('email', data.email))
                dispatch(changeField('name', data.name))
                dispatch(changeField('plan', plan))
                dispatch(changeField('storageMax', data.storage_max))
                dispatch(changeField('storageUsed', data.storage_used))
                dispatch(changeField('langAnalyzer', lang))
                dispatch(changeField('isDefaultUser', data.isDefaultUser))
                dispatch(loadDropboxCrawler())
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(stopLoadingIndicator())
                dispatch(handleError(errorPayload))
                console.error('loadUserInfo', errorPayload)
            })
    }
}

export const changeOldPassword = (value) => changeField('oldPassword', value)

export const changeNewPassword = (value) => {
    return (dispatch, getState) => {
        const localization = stateValueExtractor.getLocalization(getState())
        dispatch(changeField('newPassword', value))

        if (!value) {
            return
        }

        if (!validators.doesPasswordHaveOneDigit(value)) {
            dispatch(changeField('newPasswordError', localization.accountPage.addDigitsLabel))
            return
        }

        if (!validators.doesPasswordHaveOneLowerChar(value)) {
            dispatch(changeField('newPasswordError', localization.accountPage.addLowerCaseCharLabel))
            return
        }

        if (!validators.doesPasswordHaveOneUpperChar(value)) {
            dispatch(changeField('newPasswordError', localization.accountPage.addUpperCaseCharLabel))
            return
        }

        if (!validators.doesPasswordHaveMinLength(value)) {
            dispatch(changeField('newPasswordError', localization.accountPage.tooShortPasswordLabel))
            return
        }

        if (!validators.isStrongPassword(value)) {
            dispatch(changeField('newPasswordError', localization.accountPage.weakPasswordLabel))
            return
        }

        dispatch(changeField('newPasswordError', ''))
    }
}

export const changeNewPasswordConfirmation = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('newPasswordConfirmation', value))
        const newPassword = getState()['accountPage'].newPassword
        const localization = stateValueExtractor.getLocalization(getState())

        if (!value || !newPassword) {
            return
        }

        if (value !== newPassword) {
            dispatch(changeField('newPasswordConfirmationError', localization.accountPage.differentPasswordsLabel))
        } else {
            dispatch(changeField('newPasswordConfirmationError', ''))
        }
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
    fetching: false,
    email: '',
    name: '',
    isDefaultUser: true,
    storageMax: 0,
    storageUsed: 0,
    plan: '',
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
    oldPasswordError: '',
    newPasswordError: '',
    newPasswordConfirmationError: '',
    langAnalyzer: '',
    showRemoveUserAccountDialog: false,

    dropboxCrawler: undefined
}

export default function accountPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}