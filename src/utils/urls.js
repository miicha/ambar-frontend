const init = (apiHost) => {

    return {
        apiHost: apiHost,
        ambarWebApiSearchByStringQuery: (query, page, size) => `${apiHost}/api/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`,
        ambarWebApiLoadContentHightlight: (sha256, query) => `${apiHost}/api/search/${sha256}/?query=${encodeURIComponent(query)}`,
        ambarWebApiGetFile: (metaId) => `${apiHost}/api/files/${metaId}`,
        ambarWebApiGetFileText: (metaId) => `${apiHost}/api/files/${metaId}/text`,

        ambarWebApiGetCrawlers: () => `${apiHost}/api/crawlers`,
        ambarWebApiGetCrawler: (crawlerId) => `${apiHost}/api/crawlers/${crawlerId}`,
        ambarWebApiUpdateCrawler: (crawlerId) => `${apiHost}/api/crawlers/${crawlerId}`,
        ambarWebApiCreateCrawler: (crawlerId) => `${apiHost}/api/crawlers/${crawlerId}`,
        ambarWebApiStartStopCrawler: (crawlerId, startStopCommand) => `${apiHost}/api/crawlers/${crawlerId}/${startStopCommand}`,
        ambarWebApiDeleteCrawler: (crawlerId) => `${apiHost}/api/crawlers/${crawlerId}`,
        ambarWebApiGetCrawlerLog: (crawlerId, recordsCount) => `${apiHost}/api/logs/?sourceId=${crawlerId}&recordsCount=${recordsCount}`,

        ambarWebApiGetDropboxCrawler: () => `${apiHost}/api/crawlers/account/dropbox`,
        ambarWebApiCreateDropboxCrawler: () => `${apiHost}/api/crawlers/account/dropbox`,
        ambarWebApiDeleteDropboxCrawler: () => `${apiHost}/api/crawlers/account/dropbox/delete`,

        dropboxApiAuthorize: (dropbox) => `https://www.dropbox.com/1/oauth2/authorize?response_type=token&client_id=${dropbox.dropboxClientId}&redirect_uri=${dropbox.dropboxRedirectUri}`,

        ambarWebApiGetStats: () => `${apiHost}/api/stats`,
        ambarWebApiGetInfo: () => `${apiHost}/api/`,
        ambarWebApiGetSources: () => `${apiHost}/api/sources`,
        ambarWebApiGetFilesBySourceId: (sourceId) => `${apiHost}/api/files?sourceId=${sourceId}`,
        ambarWebApiPostFile: (sourceId, fileName) => `${apiHost}/api/files/${sourceId}/${fileName}`,
        ambarWebApiGetThumbnail: (sha) => `${apiHost}/api/thumbs/${sha}`,

        ambarWebApiLogin: () => `${apiHost}/api/users/login`,
        ambarWebApiLogout: () => `${apiHost}/api/users/logout`,
        ambarWebApiSignup: () => `${apiHost}/api/users`,
        ambarWebApiUserInfo: () => `${apiHost}/api/users`,
        ambarWebApiDeleteUser: () => `${apiHost}/api/users`,
        ambarWebApiCheckCredentials: () => `${apiHost}/api/users/check`,
        ambarWebApiCheckSetPasswordLink: () => `${apiHost}/api/users/password/set/allowed`,
        ambarWebApiSetPassword: () => `${apiHost}/api/users/password/set`,
        ambarWebApiResetPassword: () => `${apiHost}/api/users/password/reset`,
        ambarWebApiChangePassword: () => `${apiHost}/api/users/password/change`,
        googlePreviewFile: (downloadUri, urls) => `https://docs.google.com/viewer?url=${encodeURI(urls.ambarWebApiGetFile(downloadUri))}`,

        ambarWebApiAddTagToFile: (fileId) => `${apiHost}/api/tags/${fileId}`,
        ambarWebApiDeleteTagFromFile: (fileId) => `${apiHost}/api/tags/${fileId}`,

        getParamsFromQuery: (query) => {
            if (!query) {
                return {};
            }

            return (/^[?#]/.test(query) ? query.slice(1) : query)
                .split('&')
                .reduce((params, param) => {
                    let [key, value] = param.split('=');
                    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                    return params;
                }, {})
        }
    }
}

export default (apiHost) => {
    if (!apiHost) {
        throw new Error('Can not initialize config. ApiHost is undefined')
    }

    return init(apiHost)
}
