import urls from './urls.js'

export const getUrls = (state) => state['core'].urls 

export const getAuthHeaders = (state) => {
    return {
        'ambar-email': state['auth'].email,
        'ambar-email-token': state['auth'].token
    }
}

export const getDefaultSettings = (state) => {
    return {
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...getAuthHeaders(state)
        }
    }
}