import Configuration from './configuration';
const axios = require('axios').default;

export default class GlobalAccess {
    static getDevices = (app) => {
        axios
            .get(
                Configuration.mdashURL + "/customer?access_token=" + localStorage.ktok
            )
            .then(function (res) {
                var devices = {},
                    pubkeys = res.data.pubkeys || {};
                var keys = Object.keys(pubkeys);
                var pending = keys.map(function (k) {
                    var url =
                        Configuration.mdashURL +
                        "/api/v2/m/device?access_token=" +
                        encodeURIComponent(k);
                    return axios({
                        method: "GET",
                        url: url
                    })
                        .then(function (res) {
                            devices[k] = res.data;
                        })
                        .catch(function () { });
                });
                Promise.all(pending).then(function () {
                    app.setState({
                        devices: devices
                    });
                })
            });
    }

    static getAllServings = (app) => {
        axios
            .get(
                Configuration.mdashURL + "/customer?access_token=" + localStorage.ktok
            )
            .then(function (res) {
                var servings = {}, pubkeys = res.data.pubkeys || {};

                var keys = Object.keys(pubkeys);
                var pending = keys.map(function (k) {
                    var url = Configuration.mdashURL + "/api/v2/m/device/data/servings_all?access_token=" + encodeURIComponent(k);
                    return axios({
                        method: "GET",
                        url: url
                    })
                        .then(function (res) {
                            servings[k] = res.data;
                        })
                        .catch(function () { });
                });
                Promise.all(pending).then(function () {
                    app.setState({
                        servings: servings,
                        pubkeys: pubkeys
                    });
                })
            });
    }
}