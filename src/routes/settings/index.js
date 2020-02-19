import { h, Component } from 'preact';
import { Router } from 'preact-router';
import style from './style';
import Configuration from '../../configuration';
const axios = require('axios').default;
import SpinButton from '../../components/spin-button';
import MkRow from '../../components/mkrow';
import AlertModal from '../../components/alert-modal';
import GlobalAccess from '../../global-access';

export default class Settings extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let self = this;
        let p = self.props;

        p.app.setState({
            headerName: "Settings / " + p.name + " / " + p.id + " / " + (+self.props.port + 1),
            backlink: "/sites/" + p.name
        });

        if (self.props.app.state.devices) {
            if (Object.keys(self.props.app.state.devices).length === 0 && self.props.app.state.devices.constructor === Object) {
                GlobalAccess.getDevices(self.props.app);
            }
        }
    }

    componentWillReceiveProps(p, oldprops) {
        let self = this;

        let pubkey = self.getDevicePubkeyById(p.app, p.id);
        if (!pubkey) return;
        let d = p.app.state.devices[pubkey];

        self.setState({
            pubkey: pubkey,
            c: {},
            d: d
            // please do not modify this field at all
            // or use it
            // it is used to reflect some fields into
            // others, meaning the fields used to be outside react cycle
            // this ensures it is also inside
            // it should hold all the data and take changes
            // innerData: self.state.innerData || d.shadow.state.reported
        });
    }

    recursive = (object, keys, value) => {
        let self = this;

        var key = keys.splice(0, 1)[0];

        if (typeof object !== "object") {
            return value;
        }

        return Object.assign({}, object, {
            [key]: self.recursive(object[key], keys)
        });
    }

    setNestedState = (setState, keys, value) => {
        let self = this;

        let allKeys = keys.split(".");
        setState(state => {
            self.recursive(state, allKeys, value);
        });
    }

    setKey = (obj, key, val) => {
        if (!isNaN(val)) {
            val = Number(val);
        }

        let parts = key.split(".");
        for (let i = 0; i < parts.length; i++) {
            if (i >= parts.length - 1) {
                obj[parts[i]] = val;
            } else {
                if (!obj[parts[i]]) obj[parts[i]] = {};
                obj = obj[parts[i]];
            }
        }
    }

    getKey = (obj, key) => {
        var parts = key.split(".");
        for (var i = 0; i < parts.length; i++) {
            if (!(parts[i] in obj)) return undefined;
            obj = obj[parts[i]];
        }
        return obj;
    }

    handleMkRowChange = (key, value) => {
        let self = this;
        let setNestedState = self.setNestedState.bind(null, self.setState.bind(self));

        setNestedState(key, value);
        self.setKey(self.state, key, value);
    }

    mkRowValueResolver = (k, type) => {
        let self = this;

        let r = self.state.d.shadow.state.reported;

        let value = self.getKey(self.state.c, k);
        if (value === undefined) value = self.getKey(r.config, k);
        value = type === "date" ? value.replace(/\//g, "-") : value;

        return value;
    }

    onAutoKegReset = (v) => {
        this.setState({
            autoKegResetAlertOpen: v == 1
        });
    }

    closeAutoKegResetModal = () => {
        this.setState({
            autoKegResetAlertOpen: false
        });
    }

    closeAutoKegResetModal = () => {
        this.setState({
            autoKegResetAlertOpen: false
        });
    }

    getDevicePubkeyById = (app, id) => {
        for (var k in app.state.devices) {
            var d = app.state.devices[k];
            if (d.id == id)
                return k;
        }
        return null;
    }

    drinkSizeIsCustom = (drinkSizes, drinkSize) => {
        return (
            drinkSize == 0 ||
            drinkSizes.every(function (sz) {
                return String(sz.value) !== String(drinkSize);
            })
        );
    }

    kegSizeIsCustom = (kegSizes, kegSize) => {
        return (
            kegSize == 0 ||
            kegSizes.every(function (sz) {
                return String(sz.value) !== String(kegSize);
            })
        );
    }

    mkDropdownRow = (label, k, options, onChange) => {
        let self = this;

        let r = self.state.d.shadow.state.reported;
        let localizedKegSizes = self.isDisplayUnitMetric() ? Configuration.kegSizes : Configuration.kegSizes_US;
        let value = self.getKey(self.state.c, k);
        if (value === undefined) value = self.getKey(r.config, k);
        if (k.match(/volSize$/)) {
            value = Number(value);
            if (!(value in localizedKegSizes)) {
                value = 0;
            }
        } else if (k.match(/drinkSize$/) && !(value in Configuration.drinkSizes)) {
            value = 0;
        }

        return (
            <div class="form-group row my-2">
                <label class="col-form-label col-4">
                    {label}
                </label>
                <div class="col-8">
                    <select class="form-control"
                        type="text"
                        value={value} onChange={function (ev) {
                            let v = ev.target.value;
                            self.setKey(self.state.c, k, v);
                            if (onChange) onChange(v);
                            self.setState(self.state);
                        }}>
                        {options.map(function (o) {
                            return h("option", {
                                value: o.value
                            }, o.title);
                        })}
                    </select>
                </div>
            </div>
        );
    }

    litersToML = (liters) => {
        return liters * 1000;
    }

    mLToLiters = (mL) => {
        return mL / 1000;
    }

    ouncesToLiter = (oz) => {
        return Number((oz * 0.0295735296875).toFixed(3));
    }

    literToOunces = (liters) => {
        return Number((liters / 0.0295735296875).toFixed(3));
    }

    millilitersToGallons = (liters) => {
        return Number(((liters * 0.26417) / 1000).toFixed(3));
    }

    gallonsToMilliliters = (gallons) => {
        return Number(((gallons / 0.26417) * 1000).toFixed(3));
    }

    curry = (a, b, c) => {
        let fns = [a, b, c];
        return function (val) {
            return fns.reduce(function (acc, nextFn) {
                return nextFn(acc);
            }, val);
        };
    }

    curry = (a, b) => {
        let fns = [a, b];
        return function (val) {
            return fns.reduce(function (acc, nextFn) {
                return nextFn(acc);
            }, val);
        };
    }

    isDisplayUnitMetric = () => {
        let self = this;

        let r = self.state.d.shadow.state.reported;
        let displayUnitIsMetric =
            (self.state.c.displayUnits !== undefined ?
                self.state.c.displayUnits :
                r.config.displayUnits) !== 0;

        return displayUnitIsMetric;
    }

    getPortConfigs = () => {
        let self = this;

        let r = self.state.d.shadow.state.reported;
        r.config.chipID = ((r.ota || {}).id || "").toUpperCase();
        let displayUnitIsMetric = self.isDisplayUnitMetric();

        let drinkSizes = Configuration.drinkSizes;
        let drinkSizes_US = Configuration.drinkSizes_US;
        let localizedDrinkSizes = displayUnitIsMetric ? drinkSizes : drinkSizes_US;
        let drinkSizesArray = Object.keys(localizedDrinkSizes).map(key => {
            return {
                value: Number(key),
                title: localizedDrinkSizes[key]
            };
        });

        drinkSizesArray = drinkSizesArray.sort(function (a, b) {
            return +a.value < +b.value ? 1 : -1;
        });

        let kegSizes = Configuration.kegSizes;
        let kegSizes_US = Configuration.kegSizes_US;
        let localizedKegSizes = displayUnitIsMetric ? kegSizes : kegSizes_US;
        let kegSizesArray = Object.keys(localizedKegSizes).map(key => {
            return {
                value: Number(key),
                title: localizedKegSizes[key]
            };
        });

        kegSizesArray.sort(function (a, b) {
            return +a.value < +b.value ? 1 : -1;
        });

        let portconfigs = [];

        let mkportform = (i) => {
            let ind = "port" + i;

            let dskey = ind + ".drinkSize";
            let ss = self.getKey(self.state.c, dskey);
            if (ss === undefined) ss = self.getKey(r.config, dskey);
            let isServingSizeCustom = !ss || !drinkSizes[ss];

            let kskey = ind + ".volSize";
            let ks = self.getKey(self.state.c, kskey);
            if (ks === undefined) ks = self.getKey(r.config, kskey);
            let isKegSizeCustom = !ks || !kegSizes[ks];

            // If we select keg size in the dropdown, set vol start too
            let onk = function (v) {
                self.setKey(self.state.c, ind + ".volStart", v);
                if (v == 0) {
                    self.setKey(self.state.c, ind + ".isKegSizeCustom", 1);
                } else {
                    self.setKey(self.state.c, ind + ".isKegSizeCustom", 0);
                }
                self.setState(self.state);
            };

            let ond = function (v) {
                if (v == 0) {
                    self.setKey(self.state.c, ind + ".isDrinkSizeCustom", 1);
                } else {
                    self.setKey(self.state.c, ind + ".isDrinkSizeCustom", 0);
                }
                self.setState(self.state);
            };

            let formatAndNormalizeDrinkSizes = {
                format: !displayUnitIsMetric ?
                    self.curry(self.litersToML, self.ouncesToLiter, Math.round.bind(Math)) :
                    Math.round.bind(Math),
                normalize: !displayUnitIsMetric ?
                    self.curry(self.mLToLiters, self.literToOunces, Math.round.bind(Math)) :
                    Math.round.bind(Math)
            };
            let formatAndNormalizeKegSizes = {
                format: !displayUnitIsMetric ?
                    self.curry(self.gallonsToMilliliters, Math.round.bind(Math)) :
                    self.curry(self.litersToML, Math.round.bind(Math)),
                normalize: !displayUnitIsMetric ?
                    self.curry(self.millilitersToGallons, Math.round.bind(Math)) :
                    self.curry(self.mLToLiters, Math.round.bind(Math))
            };

            portconfigs.push(
                <div>
                    <div class={style.portConfig}>
                        <hr />
                        Port {i + 1}
                    </div>

                    <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Name"
                        key={ind + ".userName"} k={ind + ".userName"} />

                    <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Description"
                        key={ind + ".userDesc"} k={ind + ".userDesc"} />

                    {self.mkDropdownRow("Keg Size", ind + ".volSize", kegSizesArray, onk)}

                    {self.kegSizeIsCustom(kegSizesArray, self.getKey(self.state.c, ind + ".volSize") === undefined ?
                        self.getKey(r.config, ind + ".volSize") :
                        self.getKey(self.state.c, ind + ".volSize")) ?
                        <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label=""
                            key={ind + ".volSize"} k={ind + ".volSize"} badge={displayUnitIsMetric ? "L" : "gal"}
                            extraProps={formatAndNormalizeKegSizes} />
                        : null}

                    <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label={"Keg Volume Start " + (displayUnitIsMetric ? "(L)" : "(gal)")}
                        key={ind + ".volStart"} k={ind + ".volStart"} extraProps={formatAndNormalizeKegSizes} />

                    {self.mkDropdownRow("Serving Size", ind + ".drinkSize", drinkSizesArray, ond)}

                    {self.drinkSizeIsCustom(drinkSizesArray,
                        self.getKey(self.state.c, ind + ".drinkSize") === undefined ?
                            self.getKey(r.config, ind + ".drinkSize") :
                            self.getKey(self.state.c, ind + ".drinkSize")
                    ) ?
                        <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label=""
                            key={ind + ".drinkSize"} k={ind + ".drinkSize"} badge={displayUnitIsMetric ? "mL" : "oz"}
                            extraProps={formatAndNormalizeDrinkSizes} />
                        : null}

                    <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Cal. Offset %"
                        key={ind + ".calOffset"} k={ind + ".calOffset"} />

                    <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Date Tapped"
                        key={ind + ".dateTapped"} k={ind + ".dateTapped"} extraProps={{ type: "date" }} />

                    <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Date Cleaned"
                        key={ind + ".dateCleaned"} k={ind + ".dateCleaned"} extraProps={{ type: "date" }} />

                    <div class="form-group row my-2">
                        <label class="col-form-label col-4">Volume Reset</label>
                        <div class="col-8">
                            <SpinButton class="btn-block btn-warning" icon="fa-minus-square" title="Reset Keg Volume"
                                onClick={function () {
                                    let ok = confirm("Sure to reset this volume?");
                                    if (ok) {
                                        let url =
                                            Configuration.mdashURL +
                                            "/api/v2/m/device/rpc/Kegtron.ResetVolume" +
                                            "?access_token=" +
                                            encodeURIComponent(self.state.pubkey);

                                        return axios({
                                            method: "POST",
                                            url: url,
                                            data: {
                                                port: i
                                            }
                                        })
                                            .then(function () {
                                                // Reset dateTapped and dateCleaned
                                                url = url.replace("/rpc/Kegtron.ResetVolume", "");
                                                let c = {};
                                                c["port" + i] = {
                                                    dateCleaned: null,
                                                    dateTapped: null
                                                };
                                                let data = {
                                                    shadow: {
                                                        state: {
                                                            desired: {
                                                                config: c
                                                            }
                                                        }
                                                    }
                                                };
                                                return axios({
                                                    method: "POST",
                                                    url: url,
                                                    data: data
                                                });
                                            })
                                            .catch(function () { })
                                            .then(function () {
                                                setTimeout(t => {
                                                    GlobalAccess.getDevices(self.props.app)
                                                }, 250);
                                            });
                                    }
                                }} />
                        </div>
                    </div>
                </div>
            );
        }

        for (let i = 0; i < r.config.portCount; i++) mkportform(i);

        return portconfigs;
    }

    removeUnNecessaryProps = (data) => {
        let dataToProcess = Object.assign({}, data);

        let keysToRemove = [
            "isKegSizeCustom",
            "isDrinkSizeCustom",
            "isServingSizeCustom"
        ];
        Object.keys(dataToProcess).forEach(function (nextKey) {
            keysToRemove.forEach(key => delete dataToProcess[nextKey][key]);
        });
        console.log(dataToProcess);

        return dataToProcess;
    }

    saveConfiguration = () => {
        let self = this;

        let url =
            Configuration.mdashURL +
            "/api/v2/m/device?access_token=" +
            encodeURIComponent(self.state.pubkey);

        let data = {
            shadow: {
                state: {
                    desired: {
                        config: self.removeUnNecessaryProps(self.state.c)
                    }
                }
            }
        };

        return axios({
            method: "POST",
            url: url,
            data: data
        })
            .then(function (res) {
                // If we've updated site name, refresh UI
                if (self.state.c.siteName) {
                    Router.route(
                        "/config/" +
                        self.state.c.siteName +
                        "/" +
                        self.props.id +
                        "/" +
                        self.props.port
                    );
                    self.props.name = self.state.c.siteName;
                    self.componentDidMount();
                }
                setTimeout(t => {
                    GlobalAccess.getDevices(self.props.app);
                }, 750);
            })
            .catch(function () { });
    }

    render() {
        let self = this;

        if (!self.state.d) {
            return (
                <div class={style.settings}>
                    <div class="h-100 d-flex align-items-center">
                        <div class="text-center w-100 text-muted">
                            <span class="fa fa-refresh fa-spin fa-2x" />
                            <br />
                            {/* Initialising device... */}
                        </div>
                    </div>
                </div>
            );
        } else {
            let r = self.state.d.shadow.state.reported;
            let portconfigs = self.getPortConfigs();

            return (
                <div class={style.settings}>
                    <div class="overflow-auto p-2 font-weight-light">
                        <div class="px-2 my-2">
                            {self.state.d.id}:
                            <b class={r.online ? "text-success font-weight-bold" : "font-weight-bold text-danger"}>
                                {r.online ? " online" : " offline"}
                            </b>
                        </div>

                        <hr />

                        <form class="form px-2">
                            <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Site Name" k="siteName" />

                            <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver}
                                label="Alert Email" k="alertEmail" />

                            {self.mkDropdownRow("Low Alarm", "lowThresholdAlertEna",
                                [{ value: 0, title: "Disable" }, { value: 1, title: "Enable" }])}

                            <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver}
                                label="Low Threshold %" k="lowThreshold" />

                            {self.mkDropdownRow("Empty Alarm", "emptyThresholdAlertEna",
                                [{ value: 0, title: "Disable" }, { value: 1, title: "Enable" }])}

                            <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver}
                                label="Empty Threshold %" k="emptyThreshold" />

                            <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Ports"
                                k="portCount" extraProps={{ disabled: true }} />

                            <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Hardware"
                                k="hwRev" extraProps={{ disabled: true }} />

                            <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Firmware"
                                k="fwRev" extraProps={{ disabled: true }} />

                            <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Serial Number"
                                k="chipID" extraProps={{ disabled: true }} />

                            <MkRow onChange={self.handleMkRowChange} valueResolver={self.mkRowValueResolver} label="Model"
                                k="modelNum" extraProps={{ disabled: true }} />

                            {self.mkDropdownRow("Display Units", "displayUnits",
                                [{ value: 0, title: "US Customary" }, { value: 1, title: "Metric" }])}

                            {self.mkDropdownRow("Cleaning Mode", "cleanEna",
                                [{ value: 0, title: "Disable" }, { value: 1, title: "Enable" }])}

                            {self.mkDropdownRow("Beacon Mode", "beaconEna", [{ value: 0, title: "Disable" }, { value: 1, title: "Enable" }])}

                            {self.mkDropdownRow("Auto Keg Reset", "autoCounterRstEna",
                                [{ value: 0, title: "Disable" }, { value: 1, title: "Enable" }], self.onAutoKegReset)}

                            <AlertModal open={self.state.autoKegResetAlertOpen} onClose={self.closeAutoKegResetModal}>
                                For best Auto Keg Reset performance,
                                ensure Reset Keg Volume is applied when the first keg is tapped.
                                Calibrating your tap is also recommended.
                            </AlertModal>

                            {portconfigs}

                            <SpinButton class="btn-block btn-primary mt-5" title="Save Configuration" icon="fa-save"
                                onClick={self.saveConfiguration} />
                        </form>
                    </div>
                </div>
            );
        }
    }
}
