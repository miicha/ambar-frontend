const mixpanelAnalytics = {
    event: (name, data) => mixpanel.track(name, data),
    register: (data) => mixpanel.register(data),
    userSet: (data) => mixpanel.people.set(data),
    userIncrement: (key) => mixpanel.people.increment(key, 1),
    alias: (newId) => mixpanel.alias(newId),
    identify: (id) => mixpanel.identify(id),
    reset: () => mixpanel.reset()
}

const dummyAnalytics = {
    event: (name, data) => { },
    register: (data) => { },
    userSet: (data) => { },
    userIncrement: (key) => { },
    alias: (newId) => { },
    identify: (id) => { },
    reset: () => { }
}

let analytics = dummyAnalytics

export default (token = null) => {
    if (token && token != '') {
        mixpanel.init(token)
        analytics = mixpanelAnalytics
    }

    return analytics
}





