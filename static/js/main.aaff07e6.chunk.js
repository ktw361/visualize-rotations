(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{253:function(e,t,n){e.exports=n(284)},260:function(e,t,n){},262:function(e,t,n){},268:function(e,t){},269:function(e,t){},277:function(e,t){},278:function(e,t){},279:function(e,t){},280:function(e,t){},284:function(e,t,n){"use strict";n.r(t);var a=n(30),r=n.n(a),o=n(229),u=n.n(o),l=(n(260),n(1)),i=n(6),c=n(10),m=n(2),s=n(9),h=n(5),p=(n(262),n(69));function f(e){var t=p.k(2*Math.PI),n=p.i([e],0,1),a=p.i([e],0,1),r=p.i([e],0,1),o=p.o([p.o([p.c(p.f(t,n)),p.l(p.f(t,n)),p.p([e])],1),p.o([p.l(p.f(t,n).mul(-1)),p.c(p.f(t,n)),p.p([e])],1),p.o([p.p([e]),p.p([e]),p.h([e])],1)],1),u=p.o([p.c(a.mul(t)).mul(p.n(r)),p.l(a.mul(t)).mul(p.n(r)),p.n(r.mul(-1).add(1))],1),l=p.d(3,3,[e]),i=u.expandDims(2).mul(2).mul(u.expandDims(1)),c=l.sub(i);return p.e(c,o).mul(-1)}var d=n(68),g=n(71),_=n(224),b=n(287);function E(e){var t=new d.Matrix4,n=e.rot_mat;t.set(n[0],n[1],n[2],-n[2],n[3],n[4],n[5],-n[5],n[6],n[7],n[8],-n[8],0,0,0,1);var a=new d.Vector3,o=new d.Quaternion,u=new d.Vector3;return t.decompose(a,o,u),r.a.createElement("axesHelper",{args:[e.size],position:[a.x,a.y,a.z],quaternion:[o.x,o.y,o.z,o.w]})}function v(e){for(var t=e.rot_mats,n=e.size,a=e.nums,o=[],u=0;u<a;++u)o.push(r.a.createElement(E,{key:u,rot_mat:t.slice(9*u,9*u+9),size:n}));return r.a.createElement(r.a.Fragment,null,o)}function y(){var e=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?.2:.05;return r.a.createElement("mesh",{position:[0,0,0]},r.a.createElement("sphereGeometry",{args:[1,32,16]}),r.a.createElement("meshStandardMaterial",{depthTest:!1,wireframe:!0,transparent:!0,color:16777215,opacity:e}))}function S(e){var t=Object(a.useRef)(),n=Object(a.useRef)();return Object(a.useEffect)(function(){n.rot=!0}),Object(g.a)(function(e,a){n.rot&&(t.current.rotation.y+=.5*a)}),r.a.createElement("group",{ref:t,onClick:function(){n.rot=!1}},r.a.createElement(y,null),r.a.createElement(v,{rot_mats:e.rot_mats.dataSync(),nums:e.num_rots,size:.05}))}function w(e){var t=2.5,n=Object(g.k)().camera;return Object(a.useEffect)(function(){n.fov=75,n.near=.1,n.far=1e3,n.aspect=window.innerWidth/window.innerHeight,n.lookAt(0,0,0);var e=function(e,n){var a=new d.Vector3;return a.x=t*Math.sin(e*Math.PI/360)*Math.cos(n*Math.PI/360),a.y=t*Math.sin(n*Math.PI/360),a.z=t*Math.cos(e*Math.PI/360)*Math.cos(n*Math.PI/360),a}(0,120);n.position.set(e.x,e.y,e.z)}),null}var x=function(e){return r.a.createElement(_.a,null,r.a.createElement("color",{args:[0],attach:"background"}),r.a.createElement("ambientLight",null),r.a.createElement(b.a,{enablePan:!1,maxPolarAngle:Math.PI/2,minDistance:.5,maxDistance:10}),r.a.createElement(w,null),r.a.createElement(S,{rot_mats:e.rot_mats,num_rots:e.num_rots}))},j="avro",C="spiral",O=j,M={num_rots:100},k={num_sphere_pts:100,num_xy_rots:3};function I(e){var t=Object(a.useState)(M.num_rots),n=Object(h.a)(t,2),o=n[0],u=n[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement("label",{htmlFor:"num_rots"},"Number of Rotations:"),r.a.createElement("input",{type:"text",id:"num_rots",value:o,onChange:function(e){return u(e.target.value)}}),r.a.createElement("button",{onClick:function(){e.onSettingChange(j,{num_rots:parseInt(o)})}},"Refresh"))}function P(e){var t=Object(a.useState)(k.num_sphere_pts),n=Object(h.a)(t,2),o=n[0],u=n[1],l=Object(a.useState)(k.num_xy_rots),i=Object(h.a)(l,2),c=i[0],m=i[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,r.a.createElement("label",{htmlFor:"num_sphere_pts"},"Number of Sphere Points:"),r.a.createElement("input",{type:"text",id:"num_sphere_pts",value:o,onChange:function(e){return u(e.target.value)}})),r.a.createElement("div",null,r.a.createElement("label",{htmlFor:"num_xy_pts"},"Number of XY Rotations:"),r.a.createElement("input",{type:"text",id:"num_xy_rots",value:c,onChange:function(e){return m(e.target.value)}}),r.a.createElement("button",{onClick:function(){e.onSettingChange(C,{num_sphere_pts:parseInt(o),num_xy_rots:parseInt(c)})}},"Refresh")))}function R(e){return e.method===j?r.a.createElement(I,{onSettingChange:e.onSettingChange}):e.method===C?r.a.createElement(P,{onSettingChange:e.onSettingChange}):void 0}function z(e){var t=Object(a.useState)(O),n=Object(h.a)(t,2),o=n[0],u=n[1];return r.a.createElement("div",{style:{color:"white",backgroundColor:"transparent",position:"absolute",top:"0px"}},r.a.createElement("div",null,r.a.createElement("label",{htmlFor:"method-select"},"Generation Method:"),r.a.createElement("select",{id:"method-select",onChange:function(t){var n=t.target.value;u(n),n===j?e.onSettingChange(n,M):n===C&&e.onSettingChange(n,k)}},r.a.createElement("option",{value:j},"Random-Avro"),r.a.createElement("option",{value:C},"Spiral"))),r.a.createElement(R,{method:o,onSettingChange:e.onSettingChange}))}function A(){return r.a.createElement("div",{style:{color:"white",backgroundColor:"transparent",position:"absolute",bottom:"0px"}},r.a.createElement("p",null,"Is mobile = ",navigator.userAgent.mobile),r.a.createElement("p",null,"Reference:"),r.a.createElement("ol",null,r.a.createElement("li",null,'J Avro. "Fast Random Rotation Matrices." (1992)'),r.a.createElement("li",null,r.a.createElement("a",{href:"https://gist.github.com/zhifanzhu/a1d2a108ad6ea81b853a67d2420b01be"},"Spiral method."))))}var F=function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={rot_mats:f(M.num_rots),num_rots:M.num_rots},n}return Object(s.a)(t,e),Object(i.a)(t,[{key:"onSettingChange",value:function(e,t){if(e===j){var n=f(t.num_rots);this.setState({num_rots:t.num_rots}),this.setState({rot_mats:n})}else if(e===C){var a=function(e,t){function n(e){return e.div(p.g(e,2,1,!0))}function a(e,t){var n=p.m(e,3,1),a=Object(h.a)(n,3),r=a[0],o=a[1],u=a[2],l=p.m(t,3,1),i=Object(h.a)(l,3),c=i[0],m=i[1],s=i[2],f=o.mul(s).sub(u.mul(m)),d=u.mul(c).sub(r.mul(s)),g=r.mul(m).sub(o.mul(c));return p.b([f,d,g],1)}var r,o=e;r=o>=6e5?214:o>=4e5?75:o>=11e3?27:o>=890?10:o>=177?3.33:o>=24?1.33:.33;var u=p.j(0,o),l=u.mul(2*Math.PI/1.618033988749895),i=p.a(u.add(r).mul(-2/(o-1+2*r)).add(1)),c=p.c(l).mul(p.l(i)),m=p.l(l).mul(p.l(i)),s=p.c(i),f=p.o([c,m,s],1),d=n(a(f,p.o([p.p([o]),p.h([o]),p.p([o])],1))),g=n(a(d,f)),_=p.o([g,d,f],2),b=p.j(0,t).mul(2*Math.PI/t),E=p.o([p.o([p.c(b),p.l(b),p.p([t])],1),p.o([p.l(b).mul(-1),p.c(b),p.p([t])],1),p.o([p.p([t]),p.p([t]),p.h([t])],1)],1),v=e*t;return E=E.expandDims(1).tile([1,e,1,1]).reshape([v,3,3]),(_=_.expandDims(0).tile([t,1,1,1]).reshape([v,3,3])).matMul(E)}(t.num_sphere_pts,t.num_xy_rots);this.setState({num_rots:t.num_sphere_pts*t.num_xy_rots}),this.setState({rot_mats:a})}}},{key:"render",value:function(){return r.a.createElement("div",{style:{width:window.innerWidth,height:window.innerHeight}},r.a.createElement(x,{rot_mats:this.state.rot_mats,num_rots:this.state.num_rots}),r.a.createElement(z,{onSettingChange:this.onSettingChange.bind(this)}),r.a.createElement(A,null))}}]),t}(r.a.Component);u.a.createRoot(document.getElementById("root")).render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(F,null)))}},[[253,2,1]]]);
//# sourceMappingURL=main.aaff07e6.chunk.js.map