(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"3Om4":function(t){t.exports={addDevice:"addDevice__3BlMH"}},AY3n:function(t,e,i){"use strict";i.r(e),i.d(e,"default",(function(){return c}));var n=i("hosL"),s=(i("Y3FI"),i("3Om4")),o=i.n(s),a=i("jmCe"),r=i("eWb4"),l=i("czhI").default;class c extends n.Component{constructor(t){super(t),this.unmounted=!1,this.scan=()=>{var t=this;return new Promise((function(e,i){var n=0;!function s(){l({url:a.a.provisionURL+"/GetKey",timeout:a.a.callTimeoutMilli}).then((function(n){var s=n.data.result;s?(t.setState({step:1,public_key:s}),e()):i(n.data.error)}),(function(){t.unmounted||setTimeout(s,500)})),n++,console.log("attempt",n)}()}))},this.onSSIDInput=t=>{this.setState({ssid:t.target.value})},this.onPasswordInput=t=>{this.setState({pass:t.target.value})},this.configureDeviceWifi=()=>{var t=this,e=JSON.stringify({ssid:t.state.ssid,pass:t.state.pass});return l({method:"POST",url:a.a.provisionURL+"/setup",timeout:a.a.callTimeoutMilli,data:e}).then((function(e){e.data.result?t.setState({step:2}):alert("Error: "+e.data.error)}))},this.registerDevice=()=>{var t=this,e=a.a.mdashURL+"/customer?access_token="+localStorage.ktok;return l.get(e).then((function(i){var n=i.data;return n.pubkeys||(n.pubkeys={}),n.pubkeys[t.state.public_key]={},l({method:"POST",url:e,data:n})})).then((function(){location.href="https://"+location.host+location.pathname})).catch((function(t){alert("Error registering device ("+t+"). Join your WiFi network and retry.")}))},this.backToStep0=()=>{this.setState({step:0})},this.backToStep1=()=>{this.setState({step:1})},this.state={step:0,ssid:"",pass:"",public_key:""}}componentDidMount(){this.props.app.setState({headerName:"Add Device",backlink:""})}componentWillUnmount(){this.unmounted=!0}render(){var t;return t=0===this.state.step?Object(n.h)("div",null,Object(n.h)("div",{class:"p-2 text-muted font-weight-light lead"},"Go to your phone settings",Object(n.h)("br",null),"Join WiFi network Kegtron-XXXX",Object(n.h)("br",null),"Return to this screen and press the Scan button"),Object(n.h)(r.a,{class:"btn-block btn-primary border font-weight-light",title:"Scan",icon:"fa-search",onClick:this.scan})):1===this.state.step?Object(n.h)("div",null,Object(n.h)("a",{href:location.href,class:"link text-decoration-none",onClick:this.backToStep0},Object(n.h)("span",{class:"fa fa-arrow-left"}),"back"),Object(n.h)("div",{class:"p-2 text-muted font-weight-light lead mt-2"},"Found new device"),Object(n.h)("input",{class:"form-control mb-2",type:"text",placeholder:"WiFi network name",onInput:this.onSSIDInput}),Object(n.h)("input",{class:"form-control mb-2",type:"text",placeholder:"WiFi password",onInput:this.onPasswordInput}),Object(n.h)(r.a,{class:"btn-block btn-primary font-weight-light",title:"Configure device WiFi",icon:"fa-save",disabled:!this.state.ssid,onClick:this.configureDeviceWifi})):2===this.state.step?Object(n.h)("div",null,Object(n.h)("a",{href:location.href,class:"link text-decoration-none",onClick:this.backToStep1},Object(n.h)("span",{class:"fa fa-arrow-left"}),"back"),Object(n.h)("div",{class:"p-2 text-muted font-weight-light lead mt-2"},"WiFi settings applied. Go to your phone settings,",Object(n.h)("br",null),"Join back to your WiFi network,",Object(n.h)("br",null),"Return to this screen and click on Register Device."),Object(n.h)("input",{class:"form-control mb-2",type:"text",placeholder:"WiFi network name",onInput:this.onSSIDInput}),Object(n.h)("input",{class:"form-control mb-2",type:"text",placeholder:"WiFi password",onInput:this.onPasswordInput}),Object(n.h)(r.a,{class:"btn-block btn-primary border font-weight-light",title:"Register Device",icon:"fa-plus-circle",onClick:this.registerDevice})):Object(n.h)("div",null),Object(n.h)("div",{class:o.a.addDevice},Object(n.h)("div",{class:"overflow-auto p-2"},t))}}},jmCe:function(t,e){"use strict";e.a={baseURL:"http://localhost:8080/",provisionURL:"http://192.168.4.1",mdashURL:"https://mdash.net",appID:"",callTimeoutMilli:1e4,defaultSiteName:"NewSite",drinkSizes:{1e3:"Liter (1000 mL)",500:"Half Liter (500 mL)",651:"Bomber (651 mL)",568:"UK Pint (568 mL)",473:"US Pint (473 mL)",355:"US Bottle (355 mL)",0:"Custom"},drinkSizes_US:{1e3:"Liter (33.8oz)",500:"Half Liter (16.9 oz)",651:"Bomber (22.0 oz)",568:"UK Pint (19.2 oz)",473:"US Pint (16 oz)",355:"US Bottle (12 oz)",0:"Custom"},kegSizes:{9464:"Half Corny (9.5L)",18927:"Corny (18.9L)",19550:"1/6 Barrel (19.6L)",2e4:"20L",25e3:"25L",29340:"1/4 Barrel (29.3L)",3e4:"30L",40915:"Firkin (40.9L)",5e4:"50L",58670:"1/2 Barrel (58.7L)",0:"Custom"},kegSizes_US:{9464:"Half Corny (2.5 gal)",18927:"Corny (5 gal)",19550:"1/6 Barrel (5.16 gal)",2e4:"20L (5.28 gal)",25e3:"25L (6.6 gal)",29340:"1/4 Barrel (7.75 gal)",3e4:"30L (7.93 gal)",40915:"Firkin (10.81 gal)",5e4:"50L (13.21 gal)",58670:"1/2 Barrel (15.5 gal)",0:"Custom"}}}}]);
//# sourceMappingURL=route-add-device.chunk.f2446.esm.js.map