(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{IMbM:function(e,t,s){"use strict";s.d(t,"a",(function(){return c}));var a=s("jmCe"),o=s("czhI").default;class c{}c.getDevices=e=>{o.get(a.a.mdashURL+"/customer?access_token="+localStorage.ktok).then((function(t){var s={},c=Object.keys(t.data.pubkeys||{}).map((function(e){var t=a.a.mdashURL+"/api/v2/m/device?access_token="+encodeURIComponent(e);return o({method:"GET",url:t}).then((function(t){s[e]=t.data})).catch((function(){}))}));Promise.all(c).then((function(){e.setState({devices:s})}))}))},c.getAllServings=e=>{o.get(a.a.mdashURL+"/customer?access_token="+localStorage.ktok).then((function(t){var s={},c=t.data.pubkeys||{},n=Object.keys(c).map((function(e){var t=a.a.mdashURL+"/api/v2/m/device/data/servings_all?access_token="+encodeURIComponent(e);return o({method:"GET",url:t}).then((function(t){s[e]=t.data})).catch((function(){}))}));Promise.all(n).then((function(){e.setState({servings:s,pubkeys:c})}))}))}},IrDC:function(e,t,s){"use strict";s.r(t),s.d(t,"default",(function(){return i}));var a=s("hosL"),o=(s("Y3FI"),s("Np7l")),c=s.n(o),n=s("jmCe"),r=s("IMbM");class i extends a.Component{constructor(e){super(e),this.kegLevel=e=>e.volSize?+(100*(e.volStart-e.volDisp)/e.volSize).toFixed(2):0}componentDidMount(){this.props.app.setState({headerName:"Sites",backlink:""}),this.props.app.state.devices&&0===Object.keys(this.props.app.state.devices).length&&this.props.app.state.devices.constructor===Object&&r.a.getDevices(this.props.app)}render(){var e,t={};for(var s in this.props.app.state.devices){var o=this.props.app.state.devices[s].shadow.state.reported.config,r=o.siteName||n.a.defaultSiteName;t[r]||(t[r]={name:r,kegs:0,low:0,empty:0}),t[r].kegs+=o.portCount||0;for(var i=0;i<o.portCount;i++){var l=o["port"+i];if(l){var p=this.kegLevel(l);p<o.emptyThreshold?t[r].empty++:p<o.lowThreshold&&t[r].low++}}}return 0==Object.keys(t).length?e=Object(a.h)("div",{class:"overflow-auto p-2"},Object(a.h)("div",{class:"h-100 d-flex align-items-center"},Object(a.h)("div",{class:"text-center w-100 text-muted font-weight-light"},Object(a.h)("i",{class:"fa fa-home fa-3x"}),Object(a.h)("br",null),"No Sites"))):((t=Object.values(t)).sort((function(e,t){return e.name>t.name?1:-1})),e=Object(a.h)("div",{class:"overflow-auto p-2"},Object(a.h)("table",{class:"w-100 table table-borderless table-sm"},Object(a.h)("tr",{class:"small border-bottom text-center"},Object(a.h)("th",{scope:"col",class:"text-left"},"Site"),Object(a.h)("th",{scope:"col"},"Kegs"),Object(a.h)("th",{scope:"col"},"Low"),Object(a.h)("th",{scope:"col"},"Empty")),t.map((function(e){return Object(a.h)("tr",{class:"text-center"},Object(a.h)("td",{class:"text-left"},Object(a.h)("a",{href:"/sites/"+e.name},e.name)),Object(a.h)("td",{style:"width: 25%"},e.kegs),Object(a.h)("td",{style:"width: 25%",class:e.low<=0?"":"bg-warning"},e.low),Object(a.h)("td",{style:"width: 25%",class:e.empty<=0?"":"bg-danger"},e.empty))}))))),Object(a.h)("div",{class:c.a.sites},e)}}},Np7l:function(e){e.exports={sites:"sites__1tU4b"}},jmCe:function(e,t){"use strict";t.a={baseURL:"http://localhost:8080/",provisionURL:"http://192.168.4.1",mdashURL:"https://mdash.net",appID:"",callTimeoutMilli:1e4,defaultSiteName:"NewSite",drinkSizes:{1e3:"Liter (1000 mL)",500:"Half Liter (500 mL)",651:"Bomber (651 mL)",568:"UK Pint (568 mL)",473:"US Pint (473 mL)",355:"US Bottle (355 mL)",0:"Custom"},drinkSizes_US:{1e3:"Liter (33.8oz)",500:"Half Liter (16.9 oz)",651:"Bomber (22.0 oz)",568:"UK Pint (19.2 oz)",473:"US Pint (16 oz)",355:"US Bottle (12 oz)",0:"Custom"},kegSizes:{9464:"Half Corny (9.5L)",18927:"Corny (18.9L)",19550:"1/6 Barrel (19.6L)",2e4:"20L",25e3:"25L",29340:"1/4 Barrel (29.3L)",3e4:"30L",40915:"Firkin (40.9L)",5e4:"50L",58670:"1/2 Barrel (58.7L)",0:"Custom"},kegSizes_US:{9464:"Half Corny (2.5 gal)",18927:"Corny (5 gal)",19550:"1/6 Barrel (5.16 gal)",2e4:"20L (5.28 gal)",25e3:"25L (6.6 gal)",29340:"1/4 Barrel (7.75 gal)",3e4:"30L (7.93 gal)",40915:"Firkin (10.81 gal)",5e4:"50L (13.21 gal)",58670:"1/2 Barrel (15.5 gal)",0:"Custom"}}}}]);
//# sourceMappingURL=route-sites.chunk.8cd25.esm.js.map