import { stateValueExtractor, titles, analytics } from 'utils'
import { setAuth } from 'routes/AuthLayout/modules/AuthLayout'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { push } from 'react-router-redux'
import 'whatwg-fetch'

const CHANGE_FIELD = 'LOGIN.CHANGE_FIELD'

export const performLogin = (nextUrl = '/') => {
    return (dispatch, getState) => {

        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())
        const localization = stateValueExtractor.getLocalization(getState())

        dispatch(changeField('fetching', true))
        dispatch(changeField('emailError', ''))        
        dispatch(changeField('passwordError', ''))        

        const loginData = {
            email: getState()['login'].email,
            password: getState()['login'].password
        }        

        if (!loginData.email) {
            dispatch(changeField('emailError', localization.loginPage.emailRequiredLabel))           
        }

        if (!loginData.password) {
            dispatch(changeField('passwordError', localization.loginPage.passwordRequiredLabel))            
        }

        if (!loginData.password || !loginData.email) {
            dispatch(changeField('fetching', false))
            return
        }
        
        fetch(urls.ambarWebApiLogin(), {
            ...defaultSettings,
            method: 'POST',
            body: JSON.stringify(loginData)
            })
            .then((resp) => resp.json())
            .then((data) => {
                dispatch(changeField('fetching', false))                
                dispatch(changeField('password', ''))

                if (data.message) {
                    dispatch(changeField('passwordError', data.message))
                } else {
                    dispatch(changeField('email', ''))
                    dispatch(setAuth(loginData.email, data.token, data.ttl))
                    dispatch(push(nextUrl))
                    analytics().event('LOGIN.PERFORM')
                }
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(changeField('password', ''))
                dispatch(handleError(errorPayload))
                console.error('performLogin', errorPayload)
            })
    }
}

export const changeEmail = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('email', value))
    }
}

export const changePassword = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('password', value))
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
    password: '',
    fetching: false,
    passwordError: '',
    emailError: ''    
}

export default function loginPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}