(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{IMbM:function(e,t,o){"use strict";o.d(t,"a",(function(){return n}));var s=o("jmCe"),a=o("czhI").default,n=function(){};n.getDevices=function(e){a.get(s.a.mdashURL+"/customer?access_token="+localStorage.ktok).then((function(t){var o={},n=Object.keys(t.data.pubkeys||{}).map((function(e){var t=s.a.mdashURL+"/api/v2/m/device?access_token="+encodeURIComponent(e);return a({method:"GET",url:t}).then((function(t){o[e]=t.data})).catch((function(){}))}));Promise.all(n).then((function(){e.setState({devices:o})}))}))},n.getAllServings=function(e){a.get(s.a.mdashURL+"/customer?access_token="+localStorage.ktok).then((function(t){var o={},n=t.data.pubkeys||{},r=Object.keys(n).map((function(e){var t=s.a.mdashURL+"/api/v2/m/device/data/servings_all?access_token="+encodeURIComponent(e);return a({method:"GET",url:t}).then((function(t){o[e]=t.data})).catch((function(){}))}));Promise.all(r).then((function(){e.setState({servings:o,pubkeys:n})}))}))}},IrDC:function(e,t,o){"use strict";o.r(t),o.d(t,"default",(function(){return i}));var s=o("hosL"),a=(o("Y3FI"),o("Np7l")),n=o.n(a),r=o("jmCe"),c=o("IMbM"),i=function(e){function t(t){var o;return(o=e.call(this,t)||this).kegLevel=function(e){return e.volSize?+(100*(e.volStart-e.volDisp)/e.volSize).toFixed(2):0},o}var o,a;a=e,(o=t).prototype=Object.create(a.prototype),o.prototype.constructor=o,o.__proto__=a;var i=t.prototype;return i.componentDidMount=function(){this.props.app.setState({headerName:"Sites",backlink:""}),this.props.app.state.devices&&0===Object.keys(this.props.app.state.devices).length&&this.props.app.state.devices.constructor===Object&&c.a.getDevices(this.props.app)},i.render=function(){var e,t={};for(var o in this.props.app.state.devices){var a=this.props.app.state.devices[o].shadow.state.reported.config,c=a.siteName||r.a.defaultSiteName;t[c]||(t[c]={name:c,kegs:0,low:0,empty:0}),t[c].kegs+=a.portCount||0;for(var i=0;i<a.portCount;i++){var l=a["port"+i];if(l){var p=this.kegLevel(l);p<a.emptyThreshold?t[c].empty++:p<a.lowThreshold&&t[c].low++}}}return 0==Object.keys(t).length?e=Object(s.h)("div",{class:"overflow-auto p-2"},Object(s.h)("div",{class:"h-100 d-flex align-items-center"},Object(s.h)("div",{class:"text-center w-100 text-muted font-weight-light"},Object(s.h)("i",{class:"fa fa-home fa-3x"}),Object(s.h)("br",null),"No Sites"))):((t=Object.values(t)).sort((function(e,t){return e.name>t.name?1:-1})),e=Object(s.h)("div",{class:"overflow-auto p-2"},Object(s.h)("table",{class:"w-100 table table-borderless table-sm"},Object(s.h)("tr",{class:"small border-bottom text-center"},Object(s.h)("th",{scope:"col",class:"text-left"},"Site"),Object(s.h)("th",{scope:"col"},"Kegs"),Object(s.h)("th",{scope:"col"},"Low"),Object(s.h)("th",{scope:"col"},"Empty")),t.map((function(e){return Object(s.h)("tr",{class:"text-center"},Object(s.h)("td",{class:"text-left"},Object(s.h)("a",{href:"/sites/"+e.name},e.name)),Object(s.h)("td",{style:"width: 25%"},e.kegs),Object(s.h)("td",{style:"width: 25%",class:e.low<=0?"":"bg-warning"},e.low),Object(s.h)("td",{style:"width: 25%",class:e.empty<=0?"":"bg-danger"},e.empty))}))))),Object(s.h)("div",{class:n.a.sites},e)},t}(s.Component)},Np7l:function(e){e.exports={sites:"sites__1tU4b"}},jmCe:function(e,t){"use strict";t.a={baseURL:"http://localhost:8080/",provisionURL:"http://192.168.4.1",mdashURL:"https://mdash.net",appID:"",callTimeoutMilli:1e4,defaultSiteName:"NewSite",drinkSizes:{1e3:"Liter (1000 mL)",500:"Half Liter (500 mL)",651:"Bomber (651 mL)",568:"UK Pint (568 mL)",473:"US Pint (473 mL)",355:"US Bottle (355 mL)",0:"Custom"},drinkSizes_US:{1e3:"Liter (33.8oz)",500:"Half Liter (16.9 oz)",651:"Bomber (22.0 oz)",568:"UK Pint (19.2 oz)",473:"US Pint (16 oz)",355:"US Bottle (12 oz)",0:"Custom"},kegSizes:{9464:"Half Corny (9.5L)",18927:"Corny (18.9L)",19550:"1/6 Barrel (19.6L)",2e4:"20L",25e3:"25L",29340:"1/4 Barrel (29.3L)",3e4:"30L",40915:"Firkin (40.9L)",5e4:"50L",58670:"1/2 Barrel (58.7L)",0:"Custom"},kegSizes_US:{9464:"Half Corny (2.5 gal)",18927:"Corny (5 gal)",19550:"1/6 Barrel (5.16 gal)",2e4:"20L (5.28 gal)",25e3:"25L (6.6 gal)",29340:"1/4 Barrel (7.75 gal)",3e4:"30L (7.93 gal)",40915:"Firkin (10.81 gal)",5e4:"50L (13.21 gal)",58670:"1/2 Barrel (15.5 gal)",0:"Custom"}}}}]);
//# sourceMappingURL=route-sites.chunk.74a81.js.map