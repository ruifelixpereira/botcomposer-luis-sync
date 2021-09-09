
const httpRequest = require("./http-request");
const urlPath = '/luis/authoring/v3.0-preview/apps';

exports.default = {
    async show(param) {
        let url = buildUrl(param.endpoint) + `/${param.appId}`;
        return httpRequest.default.get(url, param.subscriptionKey);
    },
    async exportVersion(param, versionId, format = 'json') {
        let url = buildUrl(param.endpoint) + `/${param.appId}/versions/${versionId}/export?format=${format}`;
        return httpRequest.default.get(url, param.subscriptionKey);
    }
};

const buildUrl = function (url) {
    return url + urlPath;
};
