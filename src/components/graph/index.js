import { h, Component } from 'preact';
import style from './style';
import Configuration from '../../configuration';
import GlobalAccess from '../../global-access';
const axios = require('axios').default;
import moment from 'moment/moment';

export default class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 400
        }
    }

    ref = (el) => {
        let self = this;
        
        setTimeout(t => {
            if (el && el.clientWidth && el.clientWidth != 0) {
                self.setState({
                    width: el.clientWidth
                });
            }
        }, 1);
    }

    getRows = () => {
        let rows = this.props.data.reverse().map(function (row) {
            return {
                x: row.timestamp,
                y: row.level,
                vol: row.vol
            };
        });

        return rows;
    }

    getMaxX = (rows) => {
        let max_x = Math.max.apply(
            null,
            rows.map(function (row) {
                return row.x;
            })
        );

        if (max_x > 0)
            max_x = moment(max_x).add(1, "hour").startOf("hour");

        return max_x;
    }

    getMaxY = (rows) => {
        let max_y = Math.max.apply(
            null,
            rows.map(function (row) {
                return row.y || 0;
            })
        );

        return max_y;
    }

    getMinX = (rows) => {
        let min_x = Math.min.apply(
            null,
            rows.map(function (row) {
                return row.x;
            })
        );

        if (min_x > 0)
            min_x = moment(min_x).startOf("hour");

        return min_x;
    }

    getGridLabelsPointsArr = (rows, min_x, max_x, xtics, max_y, ytics, W, H, bh, th) => {
        let self = this;

        let grid = [],
            labels = [],
            points = [];

        for (let i = 0; i <= ytics; i++) {
            let y = (i * (H - bh - th)) / ytics;
            grid.push(["M", 0, y + th].join(" "));
            grid.push(["L", W, y + th].join(" "));
            if (rows.length == 0) continue;
            if (i < ytics)
                labels.push(
                    h(
                        "text", {
                        x: 2,
                        y: y + th + 9,
                        class: "label"
                    },
                        ((ytics - i) * max_y) / ytics
                    )
                );
        }

        for (let i = 0; i < xtics; i++) {
            let x = (i * W) / xtics;
            grid.push(["M", x, 0].join(" "));
            grid.push(["L", x, H - bh].join(" "));
            if (rows.length == 0) continue;
            let t = moment(min_x + ((max_x - min_x) * i) / xtics);
            labels.push(
                h(
                    "text", {
                    x: x + 2,
                    y: H - 12,
                    class: "label"
                },
                    t.format("YYYY-DD-MM")
                )
            );
            labels.push(
                h("text", {
                    x: x + 2,
                    y: H - 2,
                    class: "label"
                }, t.format("hh:mm:ss"))
            );
        }

        points = rows.map(function (row, i) {
            return ["L", self.mkx(row.x, W, max_x, min_x), self.mky(row.y, H, max_y, bh, th)].join(" ");
        });

        let gridLabelsPointsArr = [grid, labels, points];

        return gridLabelsPointsArr;
    }

    mkx = function (x, W, max_x, min_x) {
        return parseInt((W * (x - min_x)) / (max_x - min_x) || 0);
    }

    mky = function (y, H, max_y, bh, th) {
        return parseInt((H - bh - th) * (1 - y / (max_y || 1)) || 0) + th;
    }

    getServings = (rows, max_x, min_x, W, th) => {
        let self = this;

        let max_vol = Math.max.apply(null, rows.map(function (row) { return row.vol || 0; }));

        let servings = rows.map(function (row, i) {
            let x = self.mkx(row.x, W, max_x, min_x);
            let y = ((th * (row.vol || 1)) / (max_vol || 1)).toFixed(0);
            return ["M", x, th, "L", x, th - y].join(" ");
        });

        return servings;
    }

    render() {
        let self = this;

        let H = 280, ytics = 5, xtics = 5, bh = 25, th = 120, W = self.state.width;
        let rows = self.getRows(), max_x = self.getMaxX(rows), min_x = self.getMinX(rows), max_y = 100; //self.getMaxY(rows);        

        if (moment.duration(max_x - min_x).asHours() < 2) {
            xtics = 6;
        } else {
            while (moment.duration(max_x - min_x).asHours() % xtics > 0) {
                min_x = min_x.add(-1, "hour");
            }
        }

        let gridLabelsPointsArr = self.getGridLabelsPointsArr(rows, min_x, max_x, xtics, max_y, ytics, W, H, bh, th);
        let grid = gridLabelsPointsArr[0], labels = gridLabelsPointsArr[1], points = gridLabelsPointsArr[2];
        
        let path = rows[0] ? ["M", self.mkx(rows[0].x, W, max_x, min_x), self.mky(rows[0].y, H, max_y, bh, th)].join(" ") : "M 0 0";
        let servings = self.getServings(rows, max_x, min_x, W, th);

        return (
            <div class="w-100" style={"height: " + H + "px"} ref={self.ref}>
                <svg fill="none" class="h-100 w-100">
                    {h(
                        "style", {},
                        ".label {fill: #777; font: italic 10px sans-serif;}" +
                        ".title {fill: #555; font: bold 14px sans-serif;}"
                    )}

                    {labels}

                    <path d={"M 0 " + th + " L 0 0 L " + W + " 0"} stroke="#ccc" />
                    <rect x="0" y={th} width={W} height={H - th - bh} fill="#fafafa" />

                    <text x="30" y="20" stroke="#aaa">
                        Serving History
                    </text>

                    <text x="30" y={th + 20} stroke="#aaa">
                        Volume History
                    </text>

                    <path d={servings.join(" ")} stroke="blue" stroke-width="7" />
                    <path d={grid.join(" ")} stroke="#ccc" stroke-width="0.5" />
                    <path d={path + points.join(" ")} stroke="#3cc" stroke-width="2" />
                </svg>
            </div>
        );
    }
}