import { stateValueExtractor, titles, validators, analytics } from 'utils'
import { setAuth } from 'routes/AuthLayout/modules/AuthLayout'
import { handleError } from 'routes/CoreLayout/modules/CoreLayout'
import { push } from 'react-router-redux'
import 'whatwg-fetch'

const CHANGE_FIELD = 'SIGNUP.CHANGE_FIELD'

export const tryToIdentifyUser = (id) =>  {
    return (dispatch, getState) => {
        if (id) { 
            analytics().identify(id)
        }
    }
}

export const performSignup = () => {
    return (dispatch, getState) => {
        const urls = stateValueExtractor.getUrls(getState())
        const defaultSettings = stateValueExtractor.getDefaultSettings(getState())
        const localization = stateValueExtractor.getLocalization(getState())

        dispatch(changeField('fetching', true))
        dispatch(changeField('nameError', ''))
        dispatch(changeField('emailError', ''))

        let isValid = true
        const signupData = {
            name: getState()['signup'].name,
            email: getState()['signup'].email,
            langAnalyzer: getState()['signup'].langAnalyzer
        }

        if (!signupData.name) {
            dispatch(changeField('nameError', localization.signupPage.nameRequiredLabel))    
            isValid = false        
        }

        if (!signupData.email) {
            dispatch(changeField('emailError', localization.signupPage.emailRequiredLabel))
            isValid = false
        } else if (!validators.isValidEmail(signupData.email)) {
            dispatch(changeField('emailError', localization.signupPage.emailAddressInvalidLabel))
            isValid = false
        }

        if (!isValid) {
            dispatch(changeField('fetching', false))
            return
        }

        fetch(urls.ambarWebApiSignup(), {
            ...defaultSettings,
            method: 'POST',
            body: JSON.stringify(signupData)
            })
            .then((resp) => {
                if (resp.status === 200) { return {}}  
                else if (resp.status === 500) {throw resp}
                else { return resp.json()}              
            })
            .then((data) => {
                dispatch(changeField('fetching', false))
                
                if (data.message) {
                    dispatch(changeField('emailError', data.message))                    
                } else {
                    dispatch(changeField('name', ''))
                    dispatch(changeField('email', ''))
                    dispatch(push('/check-email'))
                    analytics().event('SIGNUP.PERFORM')
                    analytics().userSet({
                        $name: signupData.name,
                        $email: signupData.email,
                        langAnalyzer: signupData.langAnalyzer,
                        plan: 'free'
                    })
                    analytics().alias(signupData.email)
                }
            })
            .catch((errorPayload) => {
                dispatch(changeField('fetching', false))
                dispatch(handleError(errorPayload))
                console.error('performSignup', errorPayload)
            })
    }
}

export const changeEmail = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('email', value))
    }
}

export const changeName = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('name', value))
    }
}

export const changeLangAnalyzer = (value) => {
    return (dispatch, getState) => {
        dispatch(changeField('langAnalyzer', value))
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
    name: '',
    langAnalyzer: 'ambar_en',
    fetching: false,
    nameError: '',
    emailError: ''
}

export default function signupPageReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}