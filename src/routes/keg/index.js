import { h, Component } from 'preact';
import Router from 'preact-router';
import style from './style';
import Configuration from '../../configuration';
import GlobalAccess from '../../global-access';
const axios = require('axios').default;
import Graph from '../../components/graph';
import moment from 'moment/moment';

export default class Keg extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount = () => {
        let self = this;
        let dateFmt = "YYYY-MM-DD HH:MM";

        if (self.props.app.state.devices) {
            if (Object.keys(self.props.app.state.devices).length === 0 && self.props.app.state.devices.constructor === Object) {
                GlobalAccess.getDevices(self.props.app);
            }
        }

        self.props.app.setState({
            headerName: "Sites / " + self.props.name + " / " + self.props.id + " / " + (+self.props.port + 1),
            backlink: "/sites/" + self.props.name
        });

        self.setState({
            end: "now",
            start: moment()
                .add(-5, "days")
                .format(dateFmt)
        });
    }

    componentWillReceiveProps = (p) => {
        let self = this;

        let pubkey = self.getDevicePubkeyById(p.app, p.id);
        if (!pubkey) return;
        if (!self.ws) {
            let url =
                Configuration.mdashURL.replace(/^http/, "ws") +
                "/api/v2/m/device/notify" +
                "?access_token=" +
                pubkey;
            self.ws = self.websocket(url);
            self.ws.onmessage = function (m) {
                GlobalAccess.getDevices(self.props.app);
            };
        }
        let d = p.app.state.devices[pubkey];
        self.setState({
            pubkey: pubkey,
            d: d,
            data: []
        });
        self.getServingHistory(pubkey);
    }

    componentWillUnmount = () => {
        let self = this;
        if (self.ws) self.ws.close();
    }

    getDevicePubkeyById = (app, id) => {
        for (let k in app.state.devices) {
            let d = app.state.devices[k];
            if (d.id == id)
                return k;
        }

        return null;
    }

    getServingHistory = (pubkey) => {
        let self = this;

        return axios
            .get(
                Configuration.mdashURL +
                "/api/v2/m/device/data/servings" +
                "?access_token=" +
                pubkey
            )
            .then(function (res) {
                let data = [];
                for (let i = 0; i < res.data.rows.length; i++) {
                    let row = JSON.parse(res.data.rows[i][3]);
                    //let device = res.data.rows[i][1];
                    //console.log(device, props.port, row.port, props.port == row.port);
                    if (row.port != self.props.port) continue;
                    row.timestamp = moment.utc(res.data.rows[i][0]).local();
                    debugger;
                    data.push(row);
                }
                self.setState({
                    data: data
                });
            });
    }

    websocket = (url) => {
        // let l = window.location, proto = l.protocol.replace('http', 'ws');
        // let wsURI = proto + '//' + l.host + l.pathname + uri;
        let wrapper = {
            shouldReconnect: true,
            close: function () {
                wrapper.shouldReconnect = false;
                wrapper.ws.close();
            }
        };
        let reconnect = function () {
            let msg,
                ws = new WebSocket(url);
            ws.onmessage = function (ev) {
                try {
                    msg = JSON.parse(ev.data);
                } catch (e) {
                    console.log("Invalid ws frame:", ev.data); // eslint-disable-line
                }
                if (msg) wrapper.onmessage(msg);
            };
            ws.onclose = function () {
                window.clearTimeout(wrapper.tid);
                if (wrapper.shouldReconnect) {
                    wrapper.tid = window.setTimeout(reconnect, 1000);
                }
            };
            wrapper.ws = ws;
        };
        reconnect();
        return wrapper;
    }

    mlToUnits = (val, c) => {
        if (c.displayUnits) {
            return +val + " mL"; // metric
        } else {
            return (+val * 0.033814).toFixed(1) + " oz";
        }
    }

    mlToUnits2 = (val, c) => {
        if (c.displayUnits) {
            return (val / 1000.0).toFixed(2) + " L";
        } else {
            return (val / 3785.41).toFixed(2) + " gal";
        }
    }

    getFilteredData = () => {
        let self = this;
        
        let start = moment(self.state.start, "YYYY-MM-DDThh:mm");
        let end = self.state.end == "now" ? moment().local() : self.state.end;

        let data = (this.state.data || []).filter(entry => {
            return (
                entry.timestamp.isAfter(moment(start)) &&
                entry.timestamp.isBefore(moment(end))
            );
        });

        return data;
    }

    getEventsTable = (data, r) => {
        let self = this;
        let c = r.config || {};

        let eventsTable = <div class="table-responsive" style="max-height: 15em">
            <table class="table table-sm table-borderless small text-nowrap">
                <tr>
                    <th>Timestamp</th>
                    <th>Serving Size</th>
                    <th>Level</th>
                </tr>

                {data.map(function (row) {
                    return h("tr", {},
                        <td>{row.timestamp.format("YYYY-MM-DD HH:mm")}</td>,
                        <td>{self.mlToUnits(row.vol, c)}</td>,
                        <td>{(row.level || 0).toFixed(1)}%</td>
                    );
                })}
            </table>
        </div>;

        return eventsTable;
    }

    getInfoTable = (p, r, data) => {
        let self = this;

        let c = r.config || {};
        let US = c.displayUnits;
        let temp = !US ? ((c.temp * 9) / 5.0 + 32).toFixed(1) : c.temp.toFixed(1);
        let pict = !US ? "\u2109" : "\u2103";

        let infoTable = <div class="table-responsive">
            <table class="table table-sm table-borderless small">
                <tr>
                    <td>Description</td>
                    <th class="text-right">
                        {p.userDesc}
                    </th>
                </tr>

                <tr>
                    <td>Status</td>
                    <th class={"text-right " + (r.online ? "text-success" : "text-danger")}>
                        {r.online ? "online" : "offline"}
                    </th>
                </tr>

                <tr>
                    <td>Temperature</td>
                    <th class="text-right">
                        {temp}{pict}
                    </th>
                </tr>

                <tr>
                    <td>Humidity</td>
                    <th class="text-right">
                        {(c.humidity * 1).toFixed(1)}%
                    </th>
                </tr>

                <tr>
                    <td>Model</td>
                    <th class="text-right">
                        {c.modelNum}
                    </th>
                </tr>

                <tr>
                    <td>Port</td>
                    <th class="text-right">
                        {parseInt(self.props.port) + 1}
                    </th>
                </tr>

                <tr>
                    <td>Keg Size</td>
                    <th class="text-right">
                        {self.mlToUnits2(p.volSize, c)}
                    </th>
                </tr>

                <tr>
                    <td>Starting Volume</td>
                    <th class="text-right">
                        {self.mlToUnits2(p.volStart, c)}
                    </th>
                </tr>

                <tr>
                    <td>Last Cleaned</td>
                    <th class="text-right">
                        {p.dateCleaned ? moment(p.dateCleaned).fromNow() : "-"}
                    </th>
                </tr>

                <tr>
                    <td>Days on Tap</td>
                    <th class="text-right">
                        {p.dateTapped ? moment(p.dateTapped || undefined).fromNow().replace(" ago", "") : "-"}
                    </th>
                </tr>

                <tr>
                    <td>Kegs Served</td>
                    <th class="text-right">
                        {p.kegsServed || 0}
                    </th>
                </tr>

                <tr>
                    <td>Volume Served</td>
                    <th class="text-right">
                        {self.mlToUnits2(p.volDisp, c)}
                    </th>
                </tr>

                <tr>
                    <td>Last Served</td>
                    <th class="text-right">
                        {data.length == 0 ? "-" : self.mlToUnits(data[0].vol, c)}
                    </th>
                </tr>
            </table>
        </div>;

        return infoTable;
    }

    getInfoDiv = (p) => {
        let W = 120,
            H = 240,
            left = p.volStart - p.volDisp || 0;

        if (p.volSize)
            left /= p.volSize;

        let H2 = (H - 20) * (left < 0 ? 0 : left),
            pc = parseInt((100 * left).toFixed(0));

        let info = <div class="float-left mr-5" style="margin: auto">
            <svg class="mr-2 bg-light" width={W} height={H}>
                <rect fill="#333" x="0" y="0" width={W} height={H} rx={W / 10} />
                <rect fill="#79f" x="10" y={H - H2 - 10} width={W - 20} height={H2} />
                <text textAnchor="middle" x={pc < 10 ? "35%" : pc === 100 ? "16%" : "25%"} y={H / 2} fill="#ff0" style="font-weight: bold; font-size: 200%">{pc}%</text>
            </svg>
        </div>;

        return info;
    }

    getGraphToolBar = () => {
        let self = this;

        let startFilteringInputValue = String(self.state.start).includes("T") ?
            self.state.start :
            moment(self.state.start).format("YYYY-MM-DDThh:mm");

        let endFilteringInputValue =
            self.state.end == "now" ?
                moment().format("YYYY-MM-DDThh:mm") :
                String(self.state.end).includes("T") ?
                    self.state.end :
                    moment(self.state.end).format("YYYY-MM-DDThh:mm");

        let graphToolbar = <div class="form-inline">
            <span class="mr-5">Graph</span>

            <label class="mr-2 small">Start:</label>
            <input class="form-control form-control-sm" type="datetime-local" value={startFilteringInputValue}
                onChange={
                    function (ev) {
                        self.setState({
                            start: ev.target.value
                        })
                    }
                } />

            <label class="mx-2 small">End:</label>
            <input class="form-control form-control-sm" type="datetime-local" value={endFilteringInputValue}
                onChange={
                    function (ev) {
                        self.setState({
                            end: ev.target.value
                        })
                    }
                } />
        </div>;

        return graphToolbar;
    }

    render() {
        let self = this;

        let r = (((self.state.d || {}).shadow || {}).state || {}).reported || {};
        let c = r.config || {};
        let p = c["port" + self.props.port] || {};
        let data = self.getFilteredData();

        return (
            <div class="overflow-auto p-2">
                <div class="font-weight-light card-deck">
                    <div class="card my-2">
                        <div class="card-header font-weight-bold">
                            {"Port " + (+self.props.port + 1) + ": " + (p.userName || "")}
                        </div>
                        <div class="card-body d-flex">
                            {self.getInfoDiv(p)}
                            {self.getInfoTable(p, r, data)}
                        </div>
                    </div>
                    <div class="card my-2">
                        <div class="card-header font-weight-bold">
                            Serving History
                    </div>
                        <div class="card-body">
                            {self.getEventsTable(data, r)}
                        </div>
                    </div>
                </div>

                <div class="font-weight-light card-deck">
                    <div class="card my-2">
                        <div class="card-header font-weight-bold">
                            {self.getGraphToolBar()}
                        </div>
                        <div class="card-body table-responsive">
                            <Graph data={data} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
