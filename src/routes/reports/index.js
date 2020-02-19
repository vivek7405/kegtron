import { h, Component } from 'preact';
import SpinButton from '../../components/spin-button';
import style from './style';
import GlobalAccess from '../../global-access';
import moment from 'moment/moment';

export default class Reports extends Component {
    constructor(props) {
        let dateFmt = "YYYY-MM-DD";
        super(props);

        this.state = {
            start: moment().format(dateFmt),
            end: moment().format(dateFmt),
            selectedDateOption: "today",
            servingsByKegChecked: true,
            servingsByTimeChecked: false
        }
    }

    componentDidMount() {
        let self = this;

        self.props.app.setState({
            headerName: "Reports",
            backlink: ""
        });

        if (self.props.app.state.servings) {
            if (Object.keys(self.props.app.state.servings).length === 0 && self.props.app.state.servings.constructor === Object)
                GlobalAccess.getAllServings(self.props.app);
        }

        if (self.props.app.state.devices) {
            if (Object.keys(self.props.app.state.devices).length === 0 && self.props.app.state.devices.constructor === Object)
                GlobalAccess.getDevices(self.props.app);
        }
    }

    getHeader = () => {
        let self = this;

        let div = <div>
            <div class="col-12 d-flex justify-content-center form-inline" style="flex-wrap: wrap">
                <div class="d-flex form-inline">
                    <input type="radio" name="servings" value="keg" checked={self.state.servingsByKegChecked} onChange={self.servingsByChanged} />
                    &nbsp;<label class="col-form-label">Servings By Keg</label>
                </div>
                <div class="d-flex form-inline" style="margin-left: 3%">
                    <input type="radio" name="servings" value="time" checked={self.state.servingsByTimeChecked} onChange={self.servingsByChanged} />
                    &nbsp;<label class="col-form-label">Servings By Time</label>
                </div>
            </div>

            <br />

            <div class="col-12 d-flex justify-content-center" style="flex-wrap: wrap">
                <div class="col-4 d-flex justify-content-center form-inline">
                    <label class="col-form-label">
                        Range
                    </label>

                    <select class="form-control" style="margin-left: 2%" type="text" value={self.state.selectedDateOption} onChange={self.dateOptionChanged}>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="weekToDate">Week to Date</option>
                        <option value="lastWeek">Last Week</option>
                        <option value="monthToDate">Month To Date</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="yearToDate">Year to Date</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>

                {self.state.selectedDateOption == "custom" &&
                    <div class="col-4 d-flex justify-content-center form-inline">
                        <label class="col-form-label">Start</label>
                        <input class="form-control" style="margin-left: 2%" type="date" value={self.state.start} onChange={self.startDateChanged} />
                    </div>}

                {self.state.selectedDateOption == "custom" &&
                    <div class="col-4 d-flex justify-content-center form-inline">
                        <label class="col-form-label">End</label>
                        <input class="form-control" style="margin-left: 2%" type="date" value={self.state.end} onChange={self.endDateChanged} />
                    </div>}

                {self.state.selectedDateOption != "custom" &&
                    <div class="col-4 d-flex justify-content-center form-inline">
                        <label class="col-form-label">Start</label>
                        <input disabled class="form-control" style="margin-left: 2%" type="date" value={self.state.start} onChange={self.startDateChanged} />
                    </div>}

                {self.state.selectedDateOption != "custom" &&
                    <div class="col-4 d-flex justify-content-center form-inline">
                        <label class="col-form-label">End</label>
                        <input disabled class="form-control" style="margin-left: 2%" type="date" value={self.state.end} onChange={self.endDateChanged} />
                    </div>}
            </div>

            <br />

            <div class="col-12 d-flex justify-content-center" style="flex-wrap: wrap">
                <SpinButton class="d-inline-block ml-3 btn-warning font-weight-light"
                    style="background-color: antiquewhite"
                    icon="fa-print"
                    title="Print"
                    onClick={self.print} />

                <SpinButton class="d-inline-block ml-3 btn-warning font-weight-light"
                    style="background-color: antiquewhite"
                    icon="fa-file-excel-o"
                    title="Export As CSV"
                    onClick={self.exportAsCSV} />
            </div>
        </div>

        return div;
    }

    dateOptionChanged = ev => {
        let dateFmt = "YYYY-MM-DD";
        let selectedDateOption = ev.srcElement.value;
        let start;
        let end;

        if (selectedDateOption == "today") {
            start = moment().format(dateFmt);
            end = moment().format(dateFmt);
        } else if (selectedDateOption == "yesterday") {
            start = moment().add(-1, "days").format(dateFmt);
            end = moment().add(-1, "days").format(dateFmt);
        } else if (selectedDateOption == "weekToDate") {
            start = moment().startOf('isoWeek').format(dateFmt);
            end = moment().format(dateFmt);
        } else if (selectedDateOption == "lastWeek") {
            start = moment().subtract(1, 'weeks').startOf('isoWeek').format(dateFmt);
            end = moment().subtract(1, 'weeks').endOf('isoWeek').format(dateFmt);
        } else if (selectedDateOption == "monthToDate") {
            start = moment().startOf('month').format(dateFmt);
            end = moment().format(dateFmt);
        } else if (selectedDateOption == "lastMonth") {
            start = moment().subtract(1, "months").startOf('month').format(dateFmt);
            end = moment().subtract(1, "months").endOf('month').format(dateFmt);
        } else if (selectedDateOption == "yearToDate") {
            start = moment().startOf('year').format(dateFmt);
            end = moment().format(dateFmt);
        } else {
            start = "";
            end = "";
        }

        this.setState({
            selectedDateOption: selectedDateOption,
            start: start,
            end: end
        });
    }

    startDateChanged = ev => {
        this.setState({
            start: ev.srcElement.value
        });
    }

    endDateChanged = ev => {
        this.setState({
            end: ev.srcElement.value
        });
    }

    servingsByChanged = ev => {
        let self = this;
        self.setState({
            servingsByKegChecked: !self.state.servingsByKegChecked,
            servingsByTimeChecked: !self.state.servingsByTimeChecked
        });
    }

    print = () => {
        var divContents = document.getElementById("nodeToRenderAsPDF").innerHTML;
        var printWindow = window.open('', '', 'height=400,width=800');
        printWindow.document.write('<html><head><title>Kegtron Serving Report</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(divContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    downloadCSV = (csv, filename) => {
        let csvFile;
        let downloadLink;

        csvFile = new Blob([csv], { type: "text/csv" });            // CSV FILE
        downloadLink = document.createElement("a");                 // Download link
        downloadLink.download = filename;                           // File name
        downloadLink.href = window.URL.createObjectURL(csvFile);    // Create a link to the file
        downloadLink.style.display = "none";                        // Make sure that the link is not displayed
        document.body.appendChild(downloadLink);                    // Add the link to DOM
        downloadLink.click();                                       // Download
    }

    exportAsCSV = () => {
        let div = document.getElementById("servingsForCSV");
        let fileName = "Kegtron Serving Report.csv";

        let csv = [];
        let rows = div.querySelectorAll("table tr");

        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th");

            for (let j = 0; j < cols.length; j++)
                row.push(cols[j].innerText);

            csv.push(row.join(","));
        }

        this.downloadCSV(csv.join("\n").replace("Serving Report: ", ""), fileName);
    }

    mlToUnits = (val, c) => {
        if (c) {
            if (c.displayUnits)
                return +val + " mL"; // metric
            else
                return (+val * 0.033814).toFixed(1) + " oz";
        } else
            return +val + " mL"; // metric
    }

    mlToUnitsWoUnit = (val, c) => {
        if (c) {
            if (c.displayUnits)
                return +val; // metric
            else
                return (+val * 0.033814).toFixed(1);
        } else
            return +val; // metric
    }

    mlToUnits2 = (val, c) => {
        if (c) {
            if (c.displayUnits)
                return (val / 1000.0).toFixed(2) + " L";
            else
                return (val / 3785.41).toFixed(2) + " gal";
        } else
            return (val / 1000.0).toFixed(2) + " L";
    }

    getServingsForCSV = () => {
        let self = this;
        let devices = self.props.app.state.devices;
        let totalServingCount = 0;
        let tableRows = new Array();
        let table;
        let c;

        if (Object.keys(devices).length != 0) {
            for (let pubkey in self.props.app.state.pubkeys) {
                let deviceId = devices[pubkey].id;
                let deviceConfig = devices[pubkey].shadow.state.reported.config;
                c = deviceConfig;

                let servings = self.props.app.state.servings[pubkey];   // All Servings of device with public id pubkey

                if (servings != undefined && servings.rows.length > 0) {
                    for (let i = 0; i < deviceConfig.portCount; i++) {

                        let portName = "port" + i;
                        let port = deviceConfig[portName];
                        if (port == undefined) continue;

                        let userName = port.userName;   //Keg Name                        

                        let servingCount = 0;
                        for (let r in servings.rows) {
                            let serving = servings.rows[r];
                            let device_id = serving[1];

                            if (deviceId == device_id) {
                                let servingDetails = JSON.parse(serving[3]);

                                if (servingDetails.port == i && servingDetails.vol > 0) {
                                    let timestamp = moment.utc(serving[0]).local().format("YYYY-MM-DD");
                                    if (timestamp >= self.state.start && timestamp <= self.state.end) {
                                        let timestamp = moment.utc(serving[0]).local().format("YYYY-MM-DD");
                                        if (timestamp >= self.state.start && timestamp <= self.state.end) {
                                            timestamp = moment.utc(serving[0]).local().format("YYYY-MM-DD HH:mm");
                                            let servingDetails = JSON.parse(serving[3]);

                                            tableRows.push(<tr><td>{timestamp}</td><td>{userName}</td><td>{self.mlToUnitsWoUnit(servingDetails.vol, deviceConfig)}</td></tr>);
                                        }

                                        servingCount++;
                                    }
                                }
                            }
                        }

                        if (servingCount > 0) {
                            totalServingCount += servingCount;
                        }
                    }
                }
            }

            if (totalServingCount > 0) {
                let unit = "mL";
                if (c) {
                    if (c.displayUnits)
                        unit = "mL";
                    else
                        unit = "oz";
                }

                table = <table border="1" style="text-align: center; width: 100%">
                    <tr>
                        <th>Date / Time</th>
                        <th>Keg Name</th>
                        <th>Serving Size ({unit})</th>
                    </tr>

                    {tableRows}
                </table>;
            } else {
                table = <table border="0"><tr><td>No data available for selected range.</td></tr></table>;
            }
        }

        return table;
    }

    getServingsByKeg = () => {
        let self = this;
        let devices = self.props.app.state.devices;
        let divs = new Array();
        let grandTotalRows = new Array();
        let grandTotalServingCount = 0;
        let grandTotalVol = 0;
        let c = undefined;

        if (Object.keys(devices).length != 0) {
            for (let pubkey in self.props.app.state.pubkeys) {
                let deviceId = devices[pubkey].id;
                let deviceConfig = devices[pubkey].shadow.state.reported.config;
                c = deviceConfig;

                let servings = self.props.app.state.servings[pubkey];
                if (servings != undefined && servings.rows.length > 0) {
                    servings.rows.sort();

                    for (let i = 0; i < deviceConfig.portCount; i++) {
                        let tableRows = new Array();

                        let portName = "port" + i;
                        let port = deviceConfig[portName];
                        let div;
                        if (port == undefined) continue;

                        let userName = port.userName;   //Keg Name
                        let userDesc = port.userDesc;
                        let kegSize = self.mlToUnits2(port.volSize, deviceConfig);
                        let daysOnTap = port.dateTapped ? moment(port.dateTapped || undefined).fromNow().replace(" ago", "") : "-";

                        div = <table border="0">
                            <tr>
                                <td>Name</td>
                                <td>: <b>{userName}</b></td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>: <b>{userDesc}</b></td>
                            </tr>
                            <tr>
                                <td>Keg Size</td>
                                <td>: <b>{kegSize}</b></td>
                            </tr>
                            <tr>
                                <td>Days On Tap</td>
                                <td>: <b>{daysOnTap}</b></td>
                            </tr>
                        </table>

                        let servingCount = 0;
                        let totalVol = 0;
                        for (let r in servings.rows) {
                            let serving = servings.rows[r];
                            let device_id = serving[1];

                            if (deviceId == device_id) {
                                let timestamp = moment.utc(serving[0]).local().format("YYYY-MM-DD");
                                if (timestamp >= self.state.start && timestamp <= self.state.end) {
                                    timestamp = moment.utc(serving[0]).local().format("YYYY-MM-DD HH:mm");
                                    let topic = serving[2];
                                    let servingDetails = JSON.parse(serving[3]);
                                    if (servingDetails.port == i && servingDetails.vol > 0) {
                                        tableRows.push(<tr><td>{timestamp}</td><td>{self.mlToUnits(servingDetails.vol, deviceConfig)}</td></tr>);
                                        totalVol += servingDetails.vol;
                                        servingCount++;
                                    }
                                }
                            }
                        }

                        if (servingCount > 0) {
                            grandTotalServingCount += servingCount;
                            grandTotalVol += totalVol;

                            let table = <table border="1" style="text-align: center; width: 100%">
                                <tr>
                                    <th>Date / Time</th>
                                    <th>Serving Size</th>
                                </tr>

                                {tableRows}
                            </table>

                            divs.push(<div>{div}</div>);
                            divs.push(<table border="0"><tr><td><br /></td></tr></table>);
                            divs.push(<div>{table}</div>);
                            divs.push(<table border="0"><tr><td><br /></td></tr></table>);
                            divs.push(<table border="0"><tr><td><b>Total Servings: </b>{servingCount}, <b>Total Volume: </b>{self.mlToUnits2(totalVol, deviceConfig)}</td></tr></table>);
                            divs.push(<table border="0"><tr><td><br /><br /></td></tr></table>);

                            grandTotalRows.push(<tr><td>{userName}</td><td>{servingCount}</td><td>{self.mlToUnits2(totalVol, deviceConfig)}</td></tr>);
                        }
                    }
                }
            }

            if (grandTotalRows.length > 0) {
                divs.splice(0, 0, <table border="0" style="text-align: center; width: 100%"><tr><td style="font-size: x-large"><b>Serving Report: {self.state.start} - {self.state.end}</b><br /><br /></td></tr></table>);
                divs.splice(0, 0, <table border="0" style="text-align: center; width: 100%"><tr><td><br /><img src="/assets/images/KegtronLogoBlack.png" height="24" /><br /></td></tr></table>);

                let grandTotalTable = <table border="1" style="text-align: center; width: 100%">
                    <tr>
                        <th>Keg Name</th>
                        <th>Servings</th>
                        <th>Volume Served</th>
                    </tr>

                    {grandTotalRows}
                </table>

                divs.push(<table border="0" style="text-align: center; width: 100%"><tr><td style="font-size: x-large"><b>Grand Total</b><br /><br /></td></tr></table>);
                divs.push(<div style="text-align: center">{grandTotalTable}</div>);
                divs.push(<table border="0"><tr><td><br /></td></tr></table>);
                divs.push(<table border="0"><tr><td><b>Total Servings: </b>{grandTotalServingCount}, <b>Total Volume: </b>{self.mlToUnits2(grandTotalVol, c)}</td></tr></table>);
                divs.push(<table border="0"><tr><td><br /><br /></td></tr></table>);
            } else {
                divs = new Array();
                divs.push(<table border="0"><tr><td>No data available for selected range.</td></tr></table>);
            }
        }

        return divs;
    }

    getServingsByTime = () => {
        let self = this;
        let devices = self.props.app.state.devices;
        let divs = new Array();
        let grandTotalRows = new Array();
        let grandTotalServingCount = 0;
        let grandTotalVol = 0;
        let tableRows = new Array();
        let c;

        if (Object.keys(devices).length != 0) {
            for (let pubkey in self.props.app.state.pubkeys) {
                let deviceId = devices[pubkey].id;
                let deviceConfig = devices[pubkey].shadow.state.reported.config;
                c = deviceConfig;

                let servings = self.props.app.state.servings[pubkey];   // All Servings of device with public id pubkey

                if (servings != undefined && servings.rows.length > 0) {
                    for (let i = 0; i < deviceConfig.portCount; i++) {

                        let portName = "port" + i;
                        let port = deviceConfig[portName];
                        if (port == undefined) continue;

                        let userName = port.userName;   //Keg Name                        

                        let servingCount = 0;
                        let totalVol = 0;
                        for (let r in servings.rows) {
                            let serving = servings.rows[r];
                            let device_id = serving[1];

                            if (deviceId == device_id) {
                                let servingDetails = JSON.parse(serving[3]);

                                if (servingDetails.port == i && servingDetails.vol > 0) {
                                    let timestamp = moment.utc(serving[0]).local().format("YYYY-MM-DD");
                                    if (timestamp >= self.state.start && timestamp <= self.state.end) {
                                        let timestamp = moment.utc(serving[0]).local().format("YYYY-MM-DD");
                                        if (timestamp >= self.state.start && timestamp <= self.state.end) {
                                            timestamp = moment.utc(serving[0]).local().format("YYYY-MM-DD HH:mm");
                                            let servingDetails = JSON.parse(serving[3]);

                                            tableRows.push(<tr><td>{timestamp}</td><td>{userName}</td><td>{self.mlToUnits(servingDetails.vol, deviceConfig)}</td></tr>);
                                        }

                                        totalVol += servingDetails.vol;
                                        servingCount++;
                                    }
                                }
                            }
                        }

                        if (servingCount > 0) {
                            grandTotalServingCount += servingCount;
                            grandTotalVol += totalVol;

                            grandTotalRows.push(<tr><td>{userName}</td><td>{servingCount}</td><td>{self.mlToUnits2(totalVol, deviceConfig)}</td></tr>);
                        }
                    }
                }
            }

            if (grandTotalRows.length > 0) {
                divs.push(<table border="0" style="text-align: center; width: 100%"><tr><td><br /><img src="/assets/images/KegtronLogoBlack.png" height="24" /><br /></td></tr></table>);
                divs.push(<table border="0" style="text-align: center; width: 100%"><tr><td style="font-size: x-large"><b>Serving Report: {self.state.start} - {self.state.end}</b><br /><br /></td></tr></table>);

                let table = <table border="1" style="text-align: center; width: 100%">
                    <tr>
                        <th>Date / Time</th>
                        <th>Keg Name</th>
                        <th>Serving Size</th>
                    </tr>

                    {tableRows}
                </table>;

                divs.push(table);

                let grandTotalTable = <table border="1" style="text-align: center; width: 100%">
                    <tr>
                        <th>Keg Name</th>
                        <th>Servings</th>
                        <th>Volume Served</th>
                    </tr>

                    {grandTotalRows}
                </table>;

                divs.push(<table border="0"><tr><td><br /><br /></td></tr></table>);
                divs.push(<table border="0" style="text-align: center; width: 100%"><tr><td style="font-size: x-large"><b>Grand Total</b><br /><br /></td></tr></table>);
                divs.push(<div style="text-align: center">{grandTotalTable}</div>);
                divs.push(<table border="0"><tr><td><br /></td></tr></table>);
                divs.push(<table border="0"><tr><td><b>Total Servings: </b>{grandTotalServingCount}, <b>Total Volume: </b>{self.mlToUnits2(grandTotalVol, c)}</td></tr></table>);
                divs.push(<table border="0"><tr><td><br /><br /></td></tr></table>);
            } else {
                divs = new Array();
                divs.push(<table border="0"><tr><td>No data available for selected range.</td></tr></table>);
            }
        }

        return divs;
    }

    render() {
        let self = this;

        return (
            <div class="overflow-auto p-2">
                <div class="card-deck col-12">
                    <div class="card">
                        <div class="card-header font-weight-bold">
                            {self.getHeader()}
                        </div>

                        <div id="nodeToRenderAsPDF" class="card-body table-responsive">
                            {self.state.servingsByKegChecked && self.getServingsByKeg()}
                            {self.state.servingsByTimeChecked && self.getServingsByTime()}
                        </div>

                        <div id="servingsForCSV" style="display: none">{self.getServingsForCSV()}</div>
                    </div>
                </div>
            </div>
        );
    }
}
