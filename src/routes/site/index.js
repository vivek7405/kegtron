import { h, Component } from 'preact';
import Router from 'preact-router';
import style from './style';
import Configuration from '../../configuration';
import GlobalAccess from '../../global-access';

export default class Sites extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sortColumn: 2,
            direction: 1
        }
    }

    componentDidMount() {
        let self = this;

        self.props.app.setState({
            headerName: "Sites / " + self.props.name,
            backlink: "/sites"
        });

        if (self.props.app.state.devices) {
            if (Object.keys(self.props.app.state.devices).length === 0 && self.props.app.state.devices.constructor === Object) {
                GlobalAccess.getDevices(self.props.app);
            }
        }
    }

    kegLevel = (keg) => {
        return keg.volSize ?
            +((100 * (keg.volStart - keg.volDisp)) / keg.volSize).toFixed(2) :
            0;
    }

    mlToUnits = (val, isMetric) => {
        if (isMetric) {
            return (val / 1000.0).toFixed(2) + " L";
        } else {
            return (val / 3785.41).toFixed(2) + " gal";
        }
    }

    th = (label, sortColumn, cls) => {
        let self = this;

        return (
            <th style={sortColumn === undefined ? "" : "cursor: pointer"}
                class={cls || ""}
                onClick={function () {
                    if (sortColumn === undefined) return;
                    let direction = self.state.sortColumn == sortColumn ? self.state.direction * -1 : 1;
                    self.setState({
                        sortColumn: sortColumn,
                        direction: direction
                    });
                }}>
                {label}
            </th>
        );
    }

    getBar = (c, lvl) => {
        let bg = "";
        if (c.lowThreshold > 0 && lvl < c.lowThreshold) bg = " bg-warning";
        if (c.emptyThreshold > 0 && lvl < c.emptyThreshold) bg = " bg-danger";
        if (lvl < 0) bg = " text-danger";

        let bar = <div class="progress mt-1" style="min-width: 8em">
            <div class={"progress-bar" + bg}
                style={"width:" + (lvl < 0 ? 0 : lvl) + "%"}
                role="progressbar">
                <span class="px-2">{lvl}%</span>
            </div>
        </div >;

        return bar;
    }

    getKegs = () => {
        let self = this;
        let devices = self.props.app.state.devices,
            kegs = [];

        let mkdevices = function (k) {
            let d = devices[k],
                r = d.shadow.state.reported,
                c = r.config,
                name = c.siteName || Configuration.defaultSiteName;
            if (name != self.props.name) return;

            for (let i = 0; i < c.portCount; i++) {
                c["port" + i].d = d;
                c["port" + i].port = i;
                c["port" + i].r = r;
                kegs.push(c["port" + i]);
            }
        };

        for (let k in devices) mkdevices(k);
        kegs.sort(function (a, b) {
            let l1 = a.userName,
                l2 = b.userName;
            if (self.state.sortColumn == 1) {
                l1 = a.r.online;
                l2 = b.r.online;
            } else if (self.state.sortColumn == 2) {
                l1 = self.kegLevel(a);
                l2 = self.kegLevel(b);
            } else if (self.state.sortColumn == 3) {
                l1 = a.volDisp;
                l2 = b.volDisp;
            } else if (self.state.sortColumn == 4) {
                l1 = a.volStart - a.volDisp;
                l2 = b.volStart - b.volDisp;
            } else if (self.state.sortColumn == 5) {
                if (a.drinkSize > 0) l1 = (a.volStart - a.volDisp) / a.drinkSize;
                if (b.drinkSize > 0) l2 = (b.volStart - b.volDisp) / b.drinkSize;
            } else if (self.state.sortColumn == 6) {
                l1 = a.volSize;
                l2 = b.volSize;
            }
            if (l1 == l2) return a.userName > b.userName ? 1 : -1;
            return l1 > l2 ? 1 * self.state.direction : -1 * self.state.direction;
        });

        return kegs;
    }

    render() {
        let self = this;
        let kegs = self.getKegs();
        debugger;
        return (
            <div class={style.site}>
                <div class="overflow-auto p-2">
                    <div class="h-100">
                        <table class="w-100 table table-borderless table-sm mt-2">
                            <tr class="small border-bottom">
                                {self.th("Name", 0)}
                                {self.th("Status", 1)}
                                {self.th("Level", 2, "w-25")}
                                {self.th("Vol Served", 3)}
                                {self.th("Vol Remain", 4)}
                                {self.th("Servings Remain", 5)}
                                {self.th("Size", 6)}
                                <th></th>
                            </tr>

                            {kegs.map(function (v) {
                                let volLeft = v.volStart - v.volDisp;
                                let lvl = self.kegLevel(v);
                                let drinksLeft = v.drinkSize ? parseInt(volLeft / v.drinkSize) : 0;
                                let r = v.r;
                                let c = r.config;
                                let isMetric = r.config.displayUnits || 0;
                                let bar = self.getBar(c, lvl);

                                return h(
                                    "tr", {},
                                    <td>
                                        <a href={"/sites/" + self.props.name + "/" + v.d.id + "/" + v.port}>
                                            {v.userName || "Port " + (v.port + 1)}
                                        </a>
                                    </td>,
                                    <td class={r.online ? "text-success" : "text-danger"}>
                                        <b>
                                            {r.online ? "online" : "offline"}
                                        </b>
                                    </td>,
                                    <td>
                                        {bar}
                                    </td>,
                                    <td>
                                        {self.mlToUnits(v.volDisp, isMetric)}
                                    </td>,
                                    <td class={volLeft <= 0 ? "bg-danger text-light" : ""}>
                                        {self.mlToUnits(volLeft, isMetric)}
                                    </td>,
                                    <td class={drinksLeft <= 0 ? "bg-danger text-light" : ""}>
                                        {drinksLeft}
                                    </td>,
                                    <td>
                                        {self.mlToUnits(v.volSize, isMetric)}
                                    </td>,
                                    <td>
                                        <a href={"/config/" + self.props.name + "/" + v.d.id + "/" + v.port}>
                                            <span class="fa fa-cog" />
                                        </a>
                                    </td>
                                )
                            })}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
