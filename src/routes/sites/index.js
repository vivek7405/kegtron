import { h, Component } from 'preact';
import Router from 'preact-router';
import style from './style';
import Configuration from '../../configuration';
import GlobalAccess from '../../global-access';

export default class Sites extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let self = this;        

        self.props.app.setState({
            headerName: "Sites",
            backlink: ""
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

    render() {
        let self = this;
        let sites = {};

        for (let k in self.props.app.state.devices) {
            let d = self.props.app.state.devices[k],
                c = d.shadow.state.reported.config,
                name = c.siteName || Configuration.defaultSiteName;
            if (!sites[name]) sites[name] = {
                name: name,
                kegs: 0,
                low: 0,
                empty: 0
            };
            sites[name].kegs += c.portCount || 0;
            for (let i = 0; i < c.portCount; i++) {
                let keg = c["port" + i];
                if (!keg) continue;
                let level = self.kegLevel(keg);
                if (level < c.emptyThreshold) {
                    sites[name].empty++;
                } else if (level < c.lowThreshold) {
                    sites[name].low++;
                }
            }
        }

        let table;

        if (Object.keys(sites).length == 0) {
            table = <div class="overflow-auto p-2">
                <div class="h-100 d-flex align-items-center">
                    <div class="text-center w-100 text-muted font-weight-light">
                        <i class="fa fa-home fa-3x"></i>
                        <br />
                        No Sites
                    </div>
                </div>
            </div>;
        } else {
            sites = Object.values(sites);
            sites.sort(function (a, b) {
                return a.name > b.name ? 1 : -1;
            });

            table = <div class="overflow-auto p-2">
                <table class="w-100 table table-borderless table-sm">
                    <tr class="small border-bottom text-center">
                        <th scope="col" class="text-left">
                            Site
                            </th>
                        <th scope="col">
                            Kegs
                            </th>
                        <th scope="col">
                            Low
                            </th>
                        <th scope="col">
                            Empty
                            </th>
                    </tr>

                    {sites.map(function (v) {
                        return h(
                            "tr", {
                            class: "text-center"
                        },
                            <td class="text-left">
                                <a href={"/sites/" + v.name}>{v.name}</a>
                            </td>,
                            <td style="width: 25%">
                                {v.kegs}
                            </td>,
                            <td style="width: 25%" class={v.low <= 0 ? "" : "bg-warning"}>
                                {v.low}
                            </td>,
                            <td style="width: 25%" class={v.empty <= 0 ? "" : "bg-danger"}>
                                {v.empty}
                            </td>
                        );
                    })}
                </table>
            </div>;
        }

        return (
            <div class={style.sites}>
                {table}
            </div>
        );
    };
}
