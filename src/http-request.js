
const axios = require("axios");
let headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': ''
};
exports.default = {
    async get(url, subscriptionKey) {
        const resp = await httpRequest(subscriptionKey, {
            method: 'GET',
            url,
            headers
        });
        return resp.data;
    },
    async post(url, subscriptionKey, body, extraHeaders = {}) {
        headers = Object.assign(Object.assign({}, headers), extraHeaders);
        const resp = await httpRequest(subscriptionKey, {
            method: 'POST',
            url,
            data: body,
            headers
        });
        return resp.data;
    },
    async put(url, subscriptionKey, body) {
        const resp = await httpRequest(subscriptionKey, {
            method: 'PUT',
            url,
            data: body,
            headers
        });
        return isJSON(resp.data) ? resp.data : { code: 'Success' };
    },
    async delete(url, subscriptionKey) {
        const resp = await httpRequest(subscriptionKey, {
            method: 'DELETE',
            url,
            headers
        });
        return isJSON(resp.data) ? resp.data : { code: 'Success' };
    }
};
const httpRequest = async function (subscriptionKey, config) {
    var _a, _b, _c, _d;
    setSubscriptionKey(subscriptionKey);
    try {
        return await axios.default(config);
    }
    catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            let message = (_d = (_c = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : '';
            throw Error(`Code: ${error.response.statusText} ${message}`);
        }
        else {
            // Something happened in setting up the request that triggered an Error
            throw Error(error.message);
        }
    }
};
const setSubscriptionKey = function (subscriptionKey) {
    headers['Ocp-Apim-Subscription-Key'] = subscriptionKey;
};

const isJSON = function (jsonObject) {
    try {
        JSON.parse(jsonObject + '');
    }
    catch (error) {
        return false;
    }
    return true;
};
