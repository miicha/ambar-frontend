import { push } from 'react-router-redux'
import { titles, stateValueExtractor, urls, analytics } from 'utils'
import 'whatwg-fetch'

const CHANGE_FIELD = 'AUTH.CHANGE_FIELD'

export const authenticate = () => {
    return (dispatch, getState) => {
        dispatch(startLoadingIndicator())
        
        const urls = stateValueExtractor.getUrls(getState())

        const prevLocation = getState().router.locationBeforeTransitions
        const prevUrl = `${prevLocation.pathname}${prevLocation.search}`

        const email = localStorage.email ? localStorage.email : ''
        const token = localStorage.token ? localStorage.token : ''

        dispatch(changeField('email', email))
        dispatch(changeField('token', token))

        checkAuth(urls.ambarWebApiCheckCredentials(), stateValueExtractor.getAuthHeaders(getState()))
            .then(authResp => {
                if (authResp) {
                    dispatch(changeField('isAuthenticated', true))
                    dispatch(changeField('allowedRoutes', authResp.routes.uiRoutes))
                    dispatch(stopLoadingIndicator())
                } else {
                    dispatch(changeField('isAuthenticated', false))
                    dispatch(push(`/login?url=${encodeURI(prevUrl.replace('&', '|'))}`))
                    dispatch(stopLoadingIndicator())
                }
            })
            .catch(error => console.error(`Failed to auth. Error: ${error}`))
    }
}

const checkAuth = (url, authHeaders) => new Promise((resolve, reject) => {
    fetch(url, {
        method: 'GET',
        headers: authHeaders
    })
        .then(resp => {
            if (resp.status === 200) {
                return resp.json()
                    .then((authResp) => {
                        resolve(authResp)
                        return
                    })
            }

            if (resp.status === 401) {
                resolve(null)
                return
            }

            throw resp
        })
        .catch(err => reject(err))
})

export const setAuth = (email, token, ttl) => {
    return (dispatch, getState) => {
        if (email != '') {
            analytics().identify(email)       
        }

        localStorage.email = email
        localStorage.token = token
        localStorage.ttl = ttl        
        dispatch(changeField('email', email))
        dispatch(changeField('token', token))
    }
}

const startLoadingIndicator = () => {
    return (dispatch, getState) => {
        dispatch(changeField('fetching', true))
    }
}

const stopLoadingIndicator = () => {
    return (dispatch, getState) => {
        dispatch(changeField('fetching', false))
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
    email: null,
    token: null,
    isAuthenticated: false,
    allowedRoutes: [],
    fetching: true
}

export default function authLayoutReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}