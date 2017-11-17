import { stateValueExtractor, titles, validators, analytics } from 'utils'
import { setAuth } from 'routes/AuthLayout/modules/AuthLayout'
import { handleError, showInfo } from 'routes/CoreLayout/modules/CoreLayout'
import { push } from 'react-router-redux'
import 'whatwg-fetch'

const CHANGE_FIELD = 'SET_PASSWORD.CHANGE_FIELD'
const linkIsBrokenError = 'Your link is broken or expired. Please, request another one.'

export const checkThatLinkIsValid = (email, token) => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())
        const localization = stateValueExtractor.getLocalization(getState())

        dispatch(changeField('fetching', true))

        if (!email || !token) {
            dispatch(handleError(localization.setPasswordPage.brokenLinkLabel, true))
            return
        }

        dispatch(changeEmail(email))
        dispatch(changeToken(token))

        const linkData = {
            email: email,
            setPasswordKey: token
        }

        fetch(urls.ambarWebApiCheckSetPasswordLink(), {
            ...defaultSettings,
            method: 'POST',
            body: JSON.stringify(linkData)
        })
            .then((resp) => {
                if (resp.status === 200) { return {} }

                if (resp.status === 400 || resp.status === 409) { return { message: localization.setPasswordPage.brokenLinkLabel } }

                throw resp
            })
            .then((data) => {
                if (data.message) {
                    dispatch(showInfo(data.message))
                } else {
                    dispatch(changeField('fetching', false))
                }
            })
            .catch((errorPayload) => {
                dispatch(handleError(errorPayload))
                console.error('checkThatLinkIsValid', errorPayload)
            })
    }
}

export const performPasswordSet = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())
        const localization = stateValueExtractor.getLocalization(getState())

        dispatch(changeField('fetching', true))
        dispatch(changeField('passwordError', ''))
        dispatch(changeField('passwordConfirmationError', ''))

        let isValid = true
        const signupData = {
            email: getState()['setPassword'].email,
            setPasswordKey: getState()['setPassword'].token,
            password: getState()['setPassword'].password,
            passwordConfirmation: getState()['setPassword'].passwordConfirmation,
        }

        if (!signupData.email || !signupData.setPasswordKey) {
            dispatch(handleError(linkIsBrokenError, true))
            isValid = false
        }

        if (!signupData.password) {
            dispatch(changeField('passwordError', localization.setPasswordPage.passwordRequiredLabel))
            isValid = false
        } else if (!validators.isStrongPassword(signupData.password)) {
            dispatch(changeField('passwordError', localization.setPasswordPage.passwordWeakLabel))
            isValid = false
        }

        if (signupData.password !== signupData.passwordConfirmation) {
            dispatch(changeField('passwordConfirmationError', localization.setPasswordPage.diffPasswordsLabel))
            isValid = false
        }

        if (!isValid) {
            dispatch(changeField('fetching', false))
            return
        }

        fetch(urls.ambarWebApiSetPassword(), {
            ...defaultSettings,
            method: 'POST',
            body: JSON.stringify(signupData)
        })
            .then((resp) => resp.json())
            .then((data) => {
                dispatch(changeField('fetching', false))

                if (data.message) {
                    dispatch(changeField('passwordConfirmationError', data.message))
                } else {                   
                    dispatch(changeField('password', ''))
                    dispatch(changeField('passwordConfirmation', ''))
                    dispatch(setAuth(signupData.email, data.token, data.ttl))
                    dispatch(push('/account'))
                    analytics().event('SET_PASSWORD.PERFORM')
                }
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(changeField('password', ''))
                dispatch(changeField('passwordConfirmation', ''))
                dispatch(handleError(errorPayload))
                console.error('performSignup', errorPayload)
            })
    }
}

const changeEmail = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('email', value))
    }
}

const changeToken = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('token', value))
    }
}

export const changePassword = (value) => {
    return (dispatch, getState) => {
        const localization = stateValueExtractor.getLocalization(getState())
        dispatch(changeField('password', value))

        if (!value) {
            return
        }

         if (!validators.doesPasswordHaveOneDigit(value)) {
            dispatch(changeField('passwordError', localization.setPasswordPage.addDigitsLabel))
            return
        }

        if (!validators.doesPasswordHaveOneLowerChar(value)) {
            dispatch(changeField('passwordError', localization.setPasswordPage.addLowerCaseCharLabel))
            return
        }

        if (!validators.doesPasswordHaveOneUpperChar(value)) {
            dispatch(changeField('passwordError', localization.setPasswordPage.addUpperCaseCharLabel))
            return
        }

        if (!validators.doesPasswordHaveMinLength(value)) {
            dispatch(changeField('passwordError', localization.setPasswordPage.tooShortPasswordLabel))
            return
        }

        if (!validators.isStrongPassword(value)) {
            dispatch(changeField('passwordError', localization.setPasswordPage.passwordWeakLabel))
            return
        }

        dispatch(changeField('passwordError', ''))
    }
}

export const changePasswordConfirmation = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('passwordConfirmation', value))
        const newPassword = getState()['setPassword'].password
        const localization = stateValueExtractor.getLocalization(getState())

        if (!value || !newPassword) {
            return
        }

        if (value !== newPassword) {
            dispatch(changeField('passwordConfirmationError', localization.setPasswordPage.diffPasswordsLabel))
        } else {
            dispatch(changeField('passwordConfirmationError', ''))
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
    email: '',
    token: '',
    password: '',
    passwordConfirmation: '',
    fetching: false,
    passwordError: '',
    passwordConfirmationError: ''
}

export default function setPasswordPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}