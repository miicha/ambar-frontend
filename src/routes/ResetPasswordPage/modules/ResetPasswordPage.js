import { stateValueExtractor, titles, validators, analytics } from 'utils'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { push } from 'react-router-redux'
import 'whatwg-fetch'

const CHANGE_FIELD = 'RESET_PASSWORD.CHANGE_FIELD'

export const performPasswordReset = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())
        const localization = stateValueExtractor.getLocalization(getState())

        dispatch(changeField('fetching', true))
        dispatch(changeField('error', ''))

        const email = getState()['resetPassword'].email
        let isValid = true

        if (!email) {
            dispatch(changeField('error', localization.resetPasswordPage.emailRequiredLabel))
            isValid = false
        } else if (!validators.isValidEmail(email)) {
            dispatch(changeField('error', localization.resetPasswordPage.emailAddressInvalidLabel))
            isValid = false
        }

        if (!isValid) {
            dispatch(changeField('fetching', false))
            return
        }

        fetch(urls.ambarWebApiResetPassword(), {
            ...defaultSettings,
            method: 'POST',
            body: JSON.stringify({ email: email })
        })
            .then((resp) => {
                if (resp.status === 200) { return {}}  
                else if (resp.status === 500) {throw resp}
                else { return resp.json()}                          
            })
            .then((data) => {
                dispatch(changeField('fetching', false))

                if (data.message) {
                    dispatch(changeField('error', data.message))
                } else {
                    dispatch(changeField('email', ''))
                    dispatch(push('/check-email'))
                    analytics().event('RESET_PASSWORD.PERFORM')
                }
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(handleError(errorPayload))
                console.error('performPasswordReset', errorPayload)
            })
    }
}

export const changeEmail = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('email', value))
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
    fetching: false,
    error: ''
}

export default function resetPasswordPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}