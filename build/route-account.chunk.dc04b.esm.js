(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{DbVQ:function(t,e,s){"use strict";s.r(e),s.d(e,"default",(function(){return u}));var a=s("hosL"),o=(s("Y3FI"),s("nT/K")),n=s.n(o),r=s("jmCe"),c=s("eWb4"),l=s("IMbM"),i=s("czhI").default;class u extends a.Component{constructor(t){super(t),this.onPasswordInput=t=>{this.setState({pass:t.target.value})},this.onRetypePasswordInput=t=>{this.setState({pass2:t.target.value})},this.onPasswordChange=()=>{var t=this;if(!confirm("Sure to update your password?"))return Promise.resolve();var e=r.a.mdashURL+"/customer?access_token="+encodeURIComponent(localStorage.ktok);return i({method:"POST",url:e,data:{password:t.state.pass}}).catch((function(){})).then((function(){setTimeout(l.a.getDevices(t.props.app),250)}))},this.state={pass:"",pass2:""}}componentDidMount(){this.props.app.setState({headerName:"Account",backlink:""})}render(){return Object(a.h)("div",{class:n.a.account},Object(a.h)("div",{class:"overflow-auto p-2 font-weight-light"},Object(a.h)("div",{class:"px-2 my-2"},Object(a.h)("b",null,"Change Password")),Object(a.h)("hr",null),Object(a.h)("form",{class:"form px-2"},Object(a.h)("div",{class:"form-group row my-2"},Object(a.h)("label",{class:"col-form-label col-4"},"Password"),Object(a.h)("div",{class:"col-8"},Object(a.h)("input",{type:"password",value:this.state.pass,placeholder:"Type Password",class:"form-control",onInput:this.onPasswordInput}))),Object(a.h)("div",{class:"form-group row my-2"},Object(a.h)("label",{class:"col-form-label col-4"},"Retype Password"),Object(a.h)("div",{class:"col-8"},Object(a.h)("input",{type:"password",value:this.state.pass2,placeholder:"Type Password",class:"form-control",onInput:this.onRetypePasswordInput})))),Object(a.h)(c.a,{class:"btn-block btn-primary mt-3",disabled:!this.state.pass||!this.state.pass2||this.state.pass!=this.state.pass2,icon:"fa-save",title:"Change Password",onClick:this.onPasswordChange})))}}},IMbM:function(t,e,s){"use strict";s.d(e,"a",(function(){return n}));var a=s("jmCe"),o=s("czhI").default;class n{}n.getDevices=t=>{o.get(a.a.mdashURL+"/customer?access_token="+localStorage.ktok).then((function(e){var s={},n=Object.keys(e.data.pubkeys||{}).map((function(t){var e=a.a.mdashURL+"/api/v2/m/device?access_token="+encodeURIComponent(t);return o({method:"GET",url:e}).then((function(e){s[t]=e.data})).catch((function(){}))}));Promise.all(n).then((function(){t.setState({devices:s})}))}))},n.getAllServings=t=>{o.get(a.a.mdashURL+"/customer?access_token="+localStorage.ktok).then((function(e){var s={},n=e.data.pubkeys||{},r=Object.keys(n).map((function(t){var e=a.a.mdashURL+"/api/v2/m/device/data/servings_all?access_token="+encodeURIComponent(t);return o({method:"GET",url:e}).then((function(e){s[t]=e.data})).catch((function(){}))}));Promise.all(r).then((function(){t.setState({servings:s,pubkeys:n})}))}))}},jmCe:function(t,e){"use strict";e.a={baseURL:"http://localhost:8080/",provisionURL:"http://192.168.4.1",mdashURL:"https://mdash.net",appID:"",callTimeoutMilli:1e4,defaultSiteName:"NewSite",drinkSizes:{1e3:"Liter (1000 mL)",500:"Half Liter (500 mL)",651:"Bomber (651 mL)",568:"UK Pint (568 mL)",473:"US Pint (473 mL)",355:"US Bottle (355 mL)",0:"Custom"},drinkSizes_US:{1e3:"Liter (33.8oz)",500:"Half Liter (16.9 oz)",651:"Bomber (22.0 oz)",568:"UK Pint (19.2 oz)",473:"US Pint (16 oz)",355:"US Bottle (12 oz)",0:"Custom"},kegSizes:{9464:"Half Corny (9.5L)",18927:"Corny (18.9L)",19550:"1/6 Barrel (19.6L)",2e4:"20L",25e3:"25L",29340:"1/4 Barrel (29.3L)",3e4:"30L",40915:"Firkin (40.9L)",5e4:"50L",58670:"1/2 Barrel (58.7L)",0:"Custom"},kegSizes_US:{9464:"Half Corny (2.5 gal)",18927:"Corny (5 gal)",19550:"1/6 Barrel (5.16 gal)",2e4:"20L (5.28 gal)",25e3:"25L (6.6 gal)",29340:"1/4 Barrel (7.75 gal)",3e4:"30L (7.93 gal)",40915:"Firkin (10.81 gal)",5e4:"50L (13.21 gal)",58670:"1/2 Barrel (15.5 gal)",0:"Custom"}}},"nT/K":function(t){t.exports={account:"account__6VdwB"}}}]);
//# sourceMappingURL=route-account.chunk.dc04b.esm.js.map