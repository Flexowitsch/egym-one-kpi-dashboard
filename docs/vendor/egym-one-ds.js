/* EGYM One Design System 0.1.25 — bundled from @egym-private/egym-one-design-system-web.
   Components: eo-card, eo-label, eo-alert, eo-button, eo-divider, eo-tooltip. Regenerate with `npm run vendor`. */
function h(o,e,t,r){var n=arguments.length,i=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(o,e,t,r);else for(var a=o.length-1;a>=0;a--)(s=o[a])&&(i=(n<3?s(i):n>3?s(e,t,i):s(e,t))||i);return n>3&&i&&Object.defineProperty(e,t,i),i}var $o=`:host {
  width: 100%;
}

.header {
  padding: var(--eo-dimension-padding-block-default) var(--eo-dimension-padding-inline-default);
}

eo-divider {
  padding: var(--eo-dimension-padding-block-small) 0;
}`;var Co=`:host {
  color: var(--eo-divider-color, var(--eo-color-border-hinted));
  width: 100%;
  height: 2px;
  display: flex;
}
:host::before {
  content: "";
  width: 100%;
  height: 100%;
  background-color: currentColor;
}

:host([orientation=horizontal]) {
  width: 100%;
  height: 2px;
}

:host([orientation=horizontal][thickness=thin]) {
  height: 1px;
}

:host([orientation=vertical]) {
  width: 2px;
  height: 100%;
}

:host([orientation=vertical][thickness=thin]) {
  width: 1px;
}`;var vt=globalThis,bt=vt.ShadowRoot&&(vt.ShadyCSS===void 0||vt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ko=Symbol(),Po=new WeakMap,gt=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==ko)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(bt&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=Po.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Po.set(t,e))}return e}toString(){return this.cssText}},A=o=>new gt(typeof o=="string"?o:o+"",void 0,ko);var Oo=(o,e)=>{if(bt)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),n=vt.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=t.cssText,o.appendChild(r)}},Ut=bt?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return A(t)})(o):o;var{is:Fr,defineProperty:Gr,getOwnPropertyDescriptor:Zr,getOwnPropertyNames:Xr,getOwnPropertySymbols:Yr,getPrototypeOf:Kr}=Object,yt=globalThis,Ro=yt.trustedTypes,Jr=Ro?Ro.emptyScript:"",Qr=yt.reactiveElementPolyfillSupport,Ye=(o,e)=>o,Ke={toAttribute(o,e){switch(e){case Boolean:o=o?Jr:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},xt=(o,e)=>!Fr(o,e),To={attribute:!0,type:String,converter:Ke,reflect:!1,useDefault:!1,hasChanged:xt};Symbol.metadata??=Symbol("metadata"),yt.litPropertyMetadata??=new WeakMap;var ie=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=To){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),n=this.getPropertyDescriptor(e,r,t);n!==void 0&&Gr(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){let{get:n,set:i}=Zr(this.prototype,e)??{get(){return this[t]},set(s){this[t]=s}};return{get:n,set(s){let a=n?.call(this);i?.call(this,s),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??To}static _$Ei(){if(this.hasOwnProperty(Ye("elementProperties")))return;let e=Kr(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ye("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ye("properties"))){let t=this.properties,r=[...Xr(t),...Yr(t)];for(let n of r)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,n]of t)this.elementProperties.set(r,n)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let n=this._$Eu(t,r);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let n of r)t.unshift(Ut(n))}else e!==void 0&&t.push(Ut(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Oo(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,r);if(n!==void 0&&r.reflect===!0){let i=(r.converter?.toAttribute!==void 0?r.converter:Ke).toAttribute(t,r.type);this._$Em=e,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(e,t){let r=this.constructor,n=r._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let i=r.getPropertyOptions(n),s=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Ke;this._$Em=n;let a=s.fromAttribute(t,i.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(e,t,r,n=!1,i){if(e!==void 0){let s=this.constructor;if(n===!1&&(i=this[e]),r??=s.getPropertyOptions(e),!((r.hasChanged??xt)(i,t)||r.useDefault&&r.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:n,wrapped:i},s){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),i!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[n,i]of r){let{wrapped:s}=i,a=this[n];s!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,i,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};ie.elementStyles=[],ie.shadowRootOptions={mode:"open"},ie[Ye("elementProperties")]=new Map,ie[Ye("finalized")]=new Map,Qr?.({ReactiveElement:ie}),(yt.reactiveElementVersions??=[]).push("2.1.2");var Xt=globalThis,zo=o=>o,wt=Xt.trustedTypes,Lo=wt?wt.createPolicy("lit-html",{createHTML:o=>o}):void 0,jo="$lit$",de=`lit$${Math.random().toFixed(9).slice(2)}$`,Io="?"+de,en=`<${Io}>`,_e=document,Qe=()=>_e.createComment(""),et=o=>o===null||typeof o!="object"&&typeof o!="function",Yt=Array.isArray,tn=o=>Yt(o)||typeof o?.[Symbol.iterator]=="function",qt=`[ 	
\f\r]`,Je=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Do=/-->/g,Mo=/>/g,we=RegExp(`>|${qt}(?:([^\\s"'>=/]+)(${qt}*=${qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Bo=/'/g,No=/"/g,Uo=/^(?:script|style|textarea|title)$/i,Kt=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),m=Kt(1),ii=Kt(2),si=Kt(3),J=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Ho=new WeakMap,Ee=_e.createTreeWalker(_e,129);function qo(o,e){if(!Yt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Lo!==void 0?Lo.createHTML(e):e}var on=(o,e)=>{let t=o.length-1,r=[],n,i=e===2?"<svg>":e===3?"<math>":"",s=Je;for(let a=0;a<t;a++){let l=o[a],p,c,d=-1,v=0;for(;v<l.length&&(s.lastIndex=v,c=s.exec(l),c!==null);)v=s.lastIndex,s===Je?c[1]==="!--"?s=Do:c[1]!==void 0?s=Mo:c[2]!==void 0?(Uo.test(c[2])&&(n=RegExp("</"+c[2],"g")),s=we):c[3]!==void 0&&(s=we):s===we?c[0]===">"?(s=n??Je,d=-1):c[1]===void 0?d=-2:(d=s.lastIndex-c[2].length,p=c[1],s=c[3]===void 0?we:c[3]==='"'?No:Bo):s===No||s===Bo?s=we:s===Do||s===Mo?s=Je:(s=we,n=void 0);let u=s===we&&o[a+1].startsWith("/>")?" ":"";i+=s===Je?l+en:d>=0?(r.push(p),l.slice(0,d)+jo+l.slice(d)+de+u):l+de+(d===-2?a:u)}return[qo(o,i+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},tt=class o{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let i=0,s=0,a=e.length-1,l=this.parts,[p,c]=on(e,t);if(this.el=o.createElement(p,r),Ee.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=Ee.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let d of n.getAttributeNames())if(d.endsWith(jo)){let v=c[s++],u=n.getAttribute(d).split(de),E=/([.?@])?(.*)/.exec(v);l.push({type:1,index:i,name:E[2],strings:u,ctor:E[1]==="."?Wt:E[1]==="?"?Ft:E[1]==="@"?Gt:Be}),n.removeAttribute(d)}else d.startsWith(de)&&(l.push({type:6,index:i}),n.removeAttribute(d));if(Uo.test(n.tagName)){let d=n.textContent.split(de),v=d.length-1;if(v>0){n.textContent=wt?wt.emptyScript:"";for(let u=0;u<v;u++)n.append(d[u],Qe()),Ee.nextNode(),l.push({type:2,index:++i});n.append(d[v],Qe())}}}else if(n.nodeType===8)if(n.data===Io)l.push({type:2,index:i});else{let d=-1;for(;(d=n.data.indexOf(de,d+1))!==-1;)l.push({type:7,index:i}),d+=de.length-1}i++}}static createElement(e,t){let r=_e.createElement("template");return r.innerHTML=e,r}};function Me(o,e,t=o,r){if(e===J)return e;let n=r!==void 0?t._$Co?.[r]:t._$Cl,i=et(e)?void 0:e._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(o),n._$AT(o,t,r)),r!==void 0?(t._$Co??=[])[r]=n:t._$Cl=n),n!==void 0&&(e=Me(o,n._$AS(o,e.values),n,r)),e}var Vt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,n=(e?.creationScope??_e).importNode(t,!0);Ee.currentNode=n;let i=Ee.nextNode(),s=0,a=0,l=r[0];for(;l!==void 0;){if(s===l.index){let p;l.type===2?p=new ot(i,i.nextSibling,this,e):l.type===1?p=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(p=new Zt(i,this,e)),this._$AV.push(p),l=r[++a]}s!==l?.index&&(i=Ee.nextNode(),s++)}return Ee.currentNode=_e,n}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},ot=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,n){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Me(this,e,t),et(e)?e===b||e==null||e===""?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==J&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):tn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&et(this._$AH)?this._$AA.nextSibling.data=e:this.T(_e.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,n=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=tt.createElement(qo(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(t);else{let i=new Vt(n,this),s=i.u(this.options);i.p(t),this.T(s),this._$AH=i}}_$AC(e){let t=Ho.get(e.strings);return t===void 0&&Ho.set(e.strings,t=new tt(e)),t}k(e){Yt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,n=0;for(let i of e)n===t.length?t.push(r=new o(this.O(Qe()),this.O(Qe()),this,this.options)):r=t[n],r._$AI(i),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=zo(e).nextSibling;zo(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Be=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,n,i){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(e,t=this,r,n){let i=this.strings,s=!1;if(i===void 0)e=Me(this,e,t,0),s=!et(e)||e!==this._$AH&&e!==J,s&&(this._$AH=e);else{let a=e,l,p;for(e=i[0],l=0;l<i.length-1;l++)p=Me(this,a[r+l],t,l),p===J&&(p=this._$AH[l]),s||=!et(p)||p!==this._$AH[l],p===b?e=b:e!==b&&(e+=(p??"")+i[l+1]),this._$AH[l]=p}s&&!n&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Wt=class extends Be{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}},Ft=class extends Be{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}},Gt=class extends Be{constructor(e,t,r,n,i){super(e,t,r,n,i),this.type=5}_$AI(e,t=this){if((e=Me(this,e,t,0)??b)===J)return;let r=this._$AH,n=e===b&&r!==b||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,i=e!==b&&(r===b||n);n&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Zt=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){Me(this,e)}};var rn=Xt.litHtmlPolyfillSupport;rn?.(tt,ot),(Xt.litHtmlVersions??=[]).push("3.3.3");var Vo=(o,e,t)=>{let r=t?.renderBefore??e,n=r._$litPart$;if(n===void 0){let i=t?.renderBefore??null;r._$litPart$=n=new ot(e.insertBefore(Qe(),i),i,void 0,t??{})}return n._$AI(o),n};var Jt=globalThis,w=class extends ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Vo(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}};w._$litElement$=!0,w.finalized=!0,Jt.litElementHydrateSupport?.({LitElement:w});var nn=Jt.litElementPolyfillSupport;nn?.({LitElement:w});(Jt.litElementVersions??=[]).push("4.2.2");var $=o=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(o,e)}):customElements.define(o,e)};var sn={attribute:!0,type:String,converter:Ke,reflect:!1,hasChanged:xt},an=(o=sn,e,t)=>{let{kind:r,metadata:n}=t,i=globalThis.litPropertyMetadata.get(n);if(i===void 0&&globalThis.litPropertyMetadata.set(n,i=new Map),r==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(t.name,o),r==="accessor"){let{name:s}=t;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(s,l,o,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,o,a),a}}}if(r==="setter"){let{name:s}=t;return function(a){let l=this[s];e.call(this,a),this.requestUpdate(s,l,o,!0,a)}}throw Error("Unsupported decorator location: "+r)};function f(o){return(e,t)=>typeof t=="object"?an(o,e,t):((r,n,i)=>{let s=n.hasOwnProperty(i);return n.constructor.createProperty(i,r),s?Object.getOwnPropertyDescriptor(n,i):void 0})(o,e,t)}var Se=(o,e,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(o,e,t),t);function Ne(o,e){return(t,r,n)=>{let i=s=>s.renderRoot?.querySelector(o)??null;if(e){let{get:s,set:a}=typeof r=="object"?t:n??(()=>{let l=Symbol();return{get(){return this[l]},set(p){this[l]=p}}})();return Se(t,r,{get(){let l=s.call(this);return l===void 0&&(l=i(this),(l!==null||this.hasUpdated)&&a.call(this,l)),l}})}return Se(t,r,{get(){return i(this)}})}}var rt=class extends w{constructor(...e){super(...e),this.orientation="horizontal",this.thickness="default"}static{this.styles=[A(Co)]}render(){return b}};h([f({type:String,reflect:!0})],rt.prototype,"orientation",void 0);h([f({type:String,reflect:!0})],rt.prototype,"thickness",void 0);rt=h([$("eo-divider")],rt);var nt=class extends w{constructor(...e){super(...e),this.hasDivider=!0,this.slot="header"}static{this.styles=[A($o)]}render(){return m`
      <div class="header">
        <slot></slot>
      </div>
      ${this.hasDivider?m`<eo-divider></eo-divider>`:b}
    `}};h([f({type:Boolean,reflect:!0,attribute:"has-divider"})],nt.prototype,"hasDivider",void 0);h([f({type:String,reflect:!0,attribute:"slot"})],nt.prototype,"slot",void 0);nt=h([$("eo-card-header")],nt);var Wo=`:host {
  width: 100%;
}

.footer {
  padding: var(--eo-dimension-padding-block-default) var(--eo-dimension-padding-inline-default);
}`;var Et=class extends w{constructor(...e){super(...e),this.slot="footer"}static{this.styles=[A(Wo)]}render(){return m`
      <div class="footer">
        <slot></slot>
      </div>
    `}};h([f({type:String,reflect:!0,attribute:"slot"})],Et.prototype,"slot",void 0);Et=h([$("eo-card-footer")],Et);var Fo=`:host {
  padding: var(--eo-dimension-padding-block-small) var(--eo-dimension-padding-inline-default);
}`;var Qt=class extends w{static{this.styles=[A(Fo)]}render(){return m`
      <div class="content">
        <slot></slot>
      </div>
    `}};Qt=h([$("eo-card-content")],Qt);var Go=`:host {
  display: block;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: var(--eo-dimension-border-radius-default);
  background: var(--eo-color-surface-default);
  box-shadow: var(--shadow-level-3-bottom-ambient-x, 0) var(--shadow-level-3-bottom-ambient-y, 0) var(--shadow-level-3-bottom-ambient-blur, 0) var(--shadow-level-3-bottom-ambient-spread, 0) var(--shadow-level-3-bottom-ambient-color, rgba(255, 255, 255, 0)), var(--shadow-level-3-bottom-base-x, 0) var(--shadow-level-3-bottom-base-y, 4px) var(--shadow-level-3-bottom-base-blur, 6px) var(--shadow-level-3-bottom-base-spread, 0) var(--shadow-level-3-bottom-base-color, rgba(0, 0, 0, 0.1));
}

:host([full-height]) {
  height: 100%;
}
:host([full-height]) .container {
  height: 100%;
}`;var _t=class extends w{constructor(...e){super(...e),this.fullHeight=!1}static{this.styles=[A(Go)]}render(){return m`
      <div class="container">
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `}};h([f({type:Boolean,reflect:!0,attribute:"full-height"})],_t.prototype,"fullHeight",void 0);_t=h([$("eo-card")],_t);var Zo=`:host {
  display: inline-flex;
}

.label {
  display: inline-flex;
  align-items: center;
  align-self: stretch;
  padding: var(--eo-dimension-padding-block-small) var(--eo-dimension-padding-inline-small);
  gap: var(--eo-dimension-gap-small);
  border-radius: var(--eo-dimension-border-radius-small);
  background: var(--eo-color-surface-accent-subtle);
  color: var(--eo-color-content-accent);
}
.label .label-text {
  font-family: var(--eo-typography-marginal-25-font-family);
  font-size: var(--eo-typography-marginal-25-font-size);
  line-height: var(--eo-typography-marginal-25-line-height);
  letter-spacing: var(--eo-typography-marginal-25-letter-spacing);
  font-weight: var(--eo-typography-font-weight-medium);
}

:host([disabled]) .label {
  background: var(--eo-color-surface-disabled);
  color: var(--eo-color-content-disabled);
}

:host([size=large]) .label .label-text {
  font-family: var(--eo-typography-action-label-50-font-family);
  font-size: var(--eo-typography-action-label-50-font-size);
  line-height: var(--eo-typography-action-label-50-line-height);
  letter-spacing: var(--eo-typography-action-label-50-letter-spacing);
  font-weight: var(--eo-typography-font-weight-medium);
}

:host(:not([disabled])[emphasized]) .label {
  background: var(--eo-color-surface-accent);
  color: var(--eo-color-content-on-accent);
}

:host(:not([disabled])[intent=neutral]) .label {
  background: var(--eo-color-surface-subtle);
  color: var(--eo-color-content-subtle);
}

:host(:not([disabled])[intent=neutral][emphasized]) .label {
  background: var(--eo-color-surface-emphasized);
  color: var(--eo-color-content-utility-on-utility);
}

:host(:not([disabled])[intent=info]) .label {
  background: var(--eo-color-surface-utility-info-subtle);
  color: var(--eo-color-content-utility-info);
}

:host(:not([disabled])[intent=info][emphasized]) .label {
  background: var(--eo-color-surface-utility-info);
  color: var(--eo-color-content-utility-on-utility);
}

:host(:not([disabled])[intent=positive]) .label {
  background: var(--eo-color-surface-utility-positive-subtle);
  color: var(--eo-color-content-utility-positive);
}

:host(:not([disabled])[intent=positive][emphasized]) .label {
  background: var(--eo-color-surface-utility-positive);
  color: var(--eo-color-content-utility-on-utility);
}

:host(:not([disabled])[intent=warning]) .label {
  background: var(--eo-color-surface-utility-warning-subtle);
  color: var(--eo-color-content-emphasized);
}

:host(:not([disabled])[intent=warning][emphasized]) .label {
  background: var(--eo-color-surface-utility-warning);
  color: var(--eo-color-content-emphasized);
}

:host(:not([disabled])[intent=negative]) .label {
  background: var(--eo-color-surface-utility-negative-subtle);
  color: var(--eo-color-content-utility-negative);
}

:host(:not([disabled])[intent=negative][emphasized]) .label {
  background: var(--eo-color-surface-utility-negative);
  color: var(--eo-color-content-utility-on-utility);
}

slot[name=leading-icon]::slotted(*),
slot[name=trailing-icon]::slotted(*) {
  width: var(--eo-dimension-size-icon-smallest);
  height: var(--eo-dimension-size-icon-smallest);
}

:host([size=large]) slot[name=leading-icon]::slotted(*),
:host([size=large]) slot[name=trailing-icon]::slotted(*) {
  width: var(--eo-dimension-size-icon-small);
  height: var(--eo-dimension-size-icon-small);
}`;var Ae=class extends w{constructor(...e){super(...e),this.disabled=!1,this.intent="brand",this.size="default",this.emphasized=!1}static{this.styles=[A(Zo)]}render(){return m`
      <label class="label">
        ${this.renderLeadingIcon()}
        <span class="label-text">
          <slot></slot>
        </span>
        ${this.renderTrailingIcon()}
      </label>
    `}renderLeadingIcon(){return m`<slot name="leading-icon"></slot>`}renderTrailingIcon(){return m`<slot name="trailing-icon"></slot>`}};h([f({type:Boolean,reflect:!0})],Ae.prototype,"disabled",void 0);h([f({type:String,reflect:!0})],Ae.prototype,"intent",void 0);h([f({type:String,reflect:!0})],Ae.prototype,"size",void 0);h([f({type:Boolean,reflect:!0})],Ae.prototype,"emphasized",void 0);Ae=h([$("eo-label")],Ae);var he=class extends Event{constructor(e,t,r,n){super("context-request",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t,this.callback=r,this.subscribe=n??!1}};var He=class{constructor(e,t,r,n){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(i,s)=>{this.unsubscribe&&(this.unsubscribe!==s&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=i,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(i,s)),this.unsubscribe=s},this.host=e,t.context!==void 0){let i=t;this.context=i.context,this.callback=i.callback,this.subscribe=i.subscribe??!1}else this.context=t,this.callback=r,this.subscribe=n??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new he(this.context,this.host,this.t,this.subscribe))}};var St=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,t=!1){let r=t||!Object.is(e,this.o);this.o=e,r&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(let[t,{disposer:r}]of this.subscriptions)t(this.o,r)},e!==void 0&&(this.value=e)}addCallback(e,t,r){if(!r)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:t});let{disposer:n}=this.subscriptions.get(e);e(this.value,n)}clearCallbacks(){this.subscriptions.clear()}};var eo=class extends Event{constructor(e,t){super("context-provider",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t}},je=class extends St{constructor(e,t,r){super(t.context!==void 0?t.initialValue:r),this.onContextRequest=n=>{if(n.context!==this.context)return;let i=n.contextTarget??n.composedPath()[0];i!==this.host&&(n.stopPropagation(),this.addCallback(n.callback,i,n.subscribe))},this.onProviderRequest=n=>{if(n.context!==this.context||(n.contextTarget??n.composedPath()[0])===this.host)return;let i=new Set;for(let[s,{consumerHost:a}]of this.subscriptions)i.has(s)||(i.add(s),a.dispatchEvent(new he(this.context,a,s,!0)));n.stopPropagation()},this.host=e,t.context!==void 0?this.context=t.context:this.context=t,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new eo(this.context,this.host))}};function At({context:o}){return(e,t)=>{let r=new WeakMap;if(typeof t=="object")return{get(){return e.get.call(this)},set(n){return r.get(this).setValue(n),e.set.call(this,n)},init(n){return r.set(this,new je(this,{context:o,initialValue:n})),n}};{e.constructor.addInitializer((s=>{r.set(s,new je(s,{context:o}))}));let n=Object.getOwnPropertyDescriptor(e,t),i;if(n===void 0){let s=new WeakMap;i={get(){return s.get(this)},set(a){r.get(this).setValue(a),s.set(this,a)},configurable:!0,enumerable:!0}}else{let s=n.set;i={...n,set(a){r.get(this).setValue(a),s?.call(this,a)}}}return void Object.defineProperty(e,t,i)}}}function $e({context:o,subscribe:e}){return(t,r)=>{typeof r=="object"?r.addInitializer((function(){new He(this,{context:o,callback:n=>{t.set.call(this,n)},subscribe:e})})):t.constructor.addInitializer((n=>{new He(n,{context:o,callback:i=>{n[r]=i},subscribe:e})}))}}var Ct="intent-context-key";var Pt="size-context-key";var Xo=`:host {
  padding: var(--eo-dimension-padding-block-medium) var(--eo-dimension-padding-inline-default);
  color: var(--eo-color-content-accent);
  display: flex;
  gap: var(--eo-dimension-gap-default);
  align-items: center;
}

:host([type=alert]) {
  border-radius: var(--eo-dimension-border-radius-default);
  background: var(--eo-color-surface-accent-subtle);
  border: var(--eo-dimension-border-width-default) solid var(--eo-color-border-accent-subtle);
}

:host([type=banner]) {
  background: var(--eo-color-surface-accent-subtle);
  border: none;
}

:host([type=plain]) {
  background: transparent;
  border: none;
}

.container {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  gap: var(--eo-dimension-gap-default);
  flex: 1 0 0;
}

.text-container {
  font-family: var(--eo-typography-body-50-font-family);
  font-size: var(--eo-typography-body-50-font-size);
  line-height: var(--eo-typography-body-50-line-height);
  letter-spacing: var(--eo-typography-body-50-letter-spacing);
  font-weight: var(--eo-typography-font-weight-medium);
  flex-grow: 1;
  flex-shrink: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:host([type=alert][intent=neutral]),
:host([type=banner][intent=neutral]) {
  background: var(--eo-color-surface-default);
  color: var(--eo-color-content-emphasized);
  border-color: var(--eo-color-border-subtle);
}

:host([type=alert][intent=info]),
:host([type=banner][intent=info]) {
  background: var(--eo-color-surface-utility-info-subtle);
  color: var(--eo-color-content-utility-info);
  border-color: var(--eo-color-border-utility-info-subtle);
}

:host([type=alert][intent=positive]),
:host([type=banner][intent=positive]) {
  background: var(--eo-color-surface-utility-positive-subtle);
  color: var(--eo-color-content-utility-positive);
  border-color: var(--eo-color-border-utility-positive-subtle);
}

:host([type=alert][intent=warning]),
:host([type=banner][intent=warning]) {
  background: var(--eo-color-surface-utility-warning-subtle);
  color: var(--eo-color-content-emphasized);
  border-color: var(--eo-color-border-utility-warning-subtle);
}

:host([type=alert][intent=negative]),
:host([type=banner][intent=negative]) {
  background: var(--eo-color-surface-utility-negative-subtle);
  color: var(--eo-color-content-utility-negative);
  border-color: var(--eo-color-border-utility-negative-subtle);
}

:host([type=plain][intent=neutral]) {
  color: var(--eo-color-content-emphasized);
}

:host([type=plain][intent=info]) {
  color: var(--eo-color-content-utility-info);
}

:host([type=plain][intent=positive]) {
  color: var(--eo-color-content-utility-positive);
}

:host([type=plain][intent=warning]) {
  color: var(--eo-color-content-emphasized);
}

:host([type=plain][intent=negative]) {
  color: var(--eo-color-content-utility-negative);
}

:host([content=text-long-action]) {
  flex-direction: column;
  align-items: flex-end;
}
:host([content=text-long-action]) .container {
  align-self: stretch;
}

slot[name=icon]::slotted(*) {
  flex-grow: 0;
  flex-shrink: 0;
  width: var(--eo-dimension-size-icon-small);
  height: var(--eo-dimension-size-icon-small);
}

slot[name=action]::slotted(*) {
  flex-grow: 0;
  flex-shrink: 0;
}

:host([size=small]) {
  padding: var(--eo-dimension-padding-block-default) var(--eo-dimension-padding-inline-default);
}`;var ue=class extends w{constructor(...e){super(...e),this.type="alert",this.content="text",this.intent="brand",this.buttonSize="small",this.size="default"}static{this.styles=[A(Xo)]}render(){return m`
      <div class="container">
        <slot name="icon"></slot>
        <div class="text-container">
          <slot></slot>
        </div>
      </div>
      <slot name="action"></slot>
    `}};h([f({type:String,reflect:!0})],ue.prototype,"type",void 0);h([f({type:String,reflect:!0})],ue.prototype,"content",void 0);h([At({context:Ct}),f({type:String,reflect:!0})],ue.prototype,"intent",void 0);h([At({context:Pt}),f({type:String})],ue.prototype,"buttonSize",void 0);h([f({type:String,reflect:!0})],ue.prototype,"size",void 0);ue=h([$("eo-alert")],ue);var Yo=`:host {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  user-select: none;
  display: inline-flex;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  cursor: pointer;
  position: relative;
  padding: var(--eo-dimension-padding-action-block) var(--eo-dimension-padding-action-inline);
  gap: var(--eo-dimension-gap-default);
  border-radius: var(--eo-dimension-border-radius-round);
  min-height: var(--eo-dimension-size-touch-target-default);
  box-sizing: border-box;
  border: none;
}
:host(:not([hierarchy=free])) .button {
  height: var(--eo-dimension-size-touch-target-default);
}
.button:focus, .button:focus-visible {
  outline: none;
}
.button .label {
  font-family: var(--eo-typography-action-label-100-font-family);
  font-size: var(--eo-typography-action-label-100-font-size);
  line-height: var(--eo-typography-action-label-100-line-height);
  letter-spacing: var(--eo-typography-action-label-100-letter-spacing);
  font-weight: var(--eo-typography-font-weight-medium);
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  position: relative;
}
.button::before {
  content: "";
  position: absolute;
  min-height: var(--eo-dimension-size-touch-target-default);
  min-width: var(--eo-dimension-size-touch-target-default);
  width: 100%;
}

:host([size=small]) .button {
  min-height: var(--eo-dimension-size-touch-target-small);
  height: var(--eo-dimension-size-touch-target-small);
  padding: var(--eo-dimension-gap-default, 8px) var(--eo-dimension-padding-action-inline-small, 16px);
}
:host([size=small]) .button .label {
  font-family: var(--eo-typography-action-label-50-font-family);
  font-size: var(--eo-typography-action-label-50-font-size);
  line-height: var(--eo-typography-action-label-50-line-height);
  letter-spacing: var(--eo-typography-action-label-50-letter-spacing);
  font-weight: var(--eo-typography-font-weight-medium);
}

:host([full-width]:not([content=icon])) {
  width: 100%;
}
:host([full-width]:not([content=icon])) .button {
  width: 100%;
}

:host([disabled]) .button {
  background: var(--eo-color-surface-disabled);
  cursor: not-allowed;
  color: var(--eo-color-content-disabled);
}

:host([disabled][hierarchy=secondary]) .button {
  border: var(--eo-dimension-border-width-default) solid var(--eo-color-border-disabled);
}

:host([disabled][hierarchy=tertiary]) .button,
:host([disabled][hierarchy=free]) .button {
  background: var(--eo-color-surface-transparent);
}

:host(:not([disabled])) .button {
  background: var(--eo-color-surface-accent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-accent-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-accent-pressed);
  color: var(--eo-color-content-on-accent);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-subtle);
}

:host(:not([disabled])[hierarchy=secondary]) .button {
  background: var(--eo-color-surface-transparent);
  border: var(--eo-dimension-border-width-default) solid var(--eo-color-border-accent);
  --eo-ripple-hovered-color: var(--eo-color-surface-accent-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-accent-subtle-pressed);
  color: var(--eo-color-content-accent);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-accent);
}

:host(:not([disabled])[hierarchy=tertiary]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-accent-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-accent-subtle-pressed);
  color: var(--eo-color-content-accent);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-accent);
}

:host(:not([disabled])[hierarchy=free]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-transparent);
  --eo-ripple-pressed-color: var(--eo-color-surface-transparent);
  color: var(--eo-color-content-accent);
}
:host(:not([disabled])[hierarchy=free]) .button:hover {
  color: var(--eo-color-content-accent-hovered);
}
:host(:not([disabled])[hierarchy=free]) .button:active {
  color: var(--eo-color-content-accent-pressed);
}
:host(:not([disabled])[hierarchy=free]) .button {
  --eo-divider-color: var(--eo-component-button-color-border-seperator-accent);
}

:host(:not([disabled])[intent=neutral]) .button {
  background: var(--eo-color-surface-emphasized);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-emphasized-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-emphasized-pressed);
  color: var(--eo-color-content-on-emphasized);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-subtle);
}

:host(:not([disabled])[hierarchy=secondary][intent=neutral]) .button {
  background: var(--eo-color-surface-transparent);
  border: var(--eo-dimension-border-width-default) solid var(--eo-color-border-emphasized);
  --eo-ripple-hovered-color: var(--eo-color-surface-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-subtle-pressed);
  color: var(--eo-color-content-emphasized);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host(:not([disabled])[hierarchy=tertiary][intent=neutral]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-subtle-pressed);
  color: var(--eo-color-content-emphasized);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host(:not([disabled])[hierarchy=free][intent=neutral]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-transparent);
  --eo-ripple-pressed-color: var(--eo-color-surface-transparent);
  color: var(--eo-color-content-emphasized);
}
:host(:not([disabled])[hierarchy=free][intent=neutral]) .button:hover {
  color: var(--eo-component-button-color-content-free-emphasized-hovered);
}
:host(:not([disabled])[hierarchy=free][intent=neutral]) .button:active {
  color: var(--eo-color-content-emphasized);
}
:host(:not([disabled])[hierarchy=free][intent=neutral]) .button {
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host(:not([disabled])[intent=subtle]) .button {
  background: var(--eo-color-surface-subtle);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-subtle-pressed);
  color: var(--eo-color-content-emphasized);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host(:not([disabled])[hierarchy=secondary][intent=subtle]) .button {
  background: var(--eo-color-surface-transparent);
  border: var(--eo-dimension-border-width-default) solid var(--eo-color-border-subtle);
  --eo-ripple-hovered-color: var(--eo-color-surface-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-subtle-pressed);
  color: var(--eo-color-content-emphasized);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host(:not([disabled])[hierarchy=tertiary][intent=subtle]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-subtle-pressed);
  color: var(--eo-color-content-emphasized);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host(:not([disabled])[hierarchy=free][intent=subtle]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-transparent);
  --eo-ripple-pressed-color: var(--eo-color-surface-transparent);
  color: var(--eo-color-content-emphasized);
}
:host(:not([disabled])[hierarchy=free][intent=subtle]) .button:hover {
  color: var(--eo-component-button-color-content-free-emphasized-hovered);
}
:host(:not([disabled])[hierarchy=free][intent=subtle]) .button:active {
  color: var(--eo-color-content-emphasized);
}
:host(:not([disabled])[hierarchy=free][intent=subtle]) .button {
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host(:not([disabled])[intent=info]) .button {
  background: var(--eo-color-surface-utility-info);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-utility-info-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-utility-info-pressed);
  color: var(--eo-color-content-utility-on-utility);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-subtle);
}

:host(:not([disabled])[hierarchy=secondary][intent=info]) .button {
  background: var(--eo-color-surface-transparent);
  border: var(--eo-dimension-border-width-default) solid var(--eo-color-border-utility-info);
  --eo-ripple-hovered-color: var(--eo-color-surface-utility-info-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-utility-info-subtle-pressed);
  color: var(--eo-color-content-utility-info);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-info);
}

:host(:not([disabled])[hierarchy=tertiary][intent=info]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-utility-info-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-utility-info-subtle-pressed);
  color: var(--eo-color-content-utility-info);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-info);
}

:host(:not([disabled])[hierarchy=free][intent=info]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-transparent);
  --eo-ripple-pressed-color: var(--eo-color-surface-transparent);
  color: var(--eo-color-content-utility-info);
}
:host(:not([disabled])[hierarchy=free][intent=info]) .button:hover {
  color: var(--eo-component-button-color-content-free-info-hovered);
}
:host(:not([disabled])[hierarchy=free][intent=info]) .button:active {
  color: var(--eo-component-button-color-content-free-info-pressed);
}
:host(:not([disabled])[hierarchy=free][intent=info]) .button {
  --eo-divider-color: var(--eo-component-button-color-border-seperator-info);
}

:host(:not([disabled])[intent=positive]) .button {
  background: var(--eo-color-surface-utility-positive);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-utility-positive-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-utility-positive-pressed);
  color: var(--eo-color-content-utility-on-utility);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-subtle);
}

:host(:not([disabled])[hierarchy=secondary][intent=positive]) .button {
  background: var(--eo-color-surface-transparent);
  border: var(--eo-dimension-border-width-default) solid var(--eo-color-border-utility-positive);
  --eo-ripple-hovered-color: var(--eo-color-surface-utility-positive-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-utility-positive-subtle-pressed);
  color: var(--eo-color-content-utility-positive);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-positive);
}

:host(:not([disabled])[hierarchy=tertiary][intent=positive]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-utility-positive-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-utility-positive-subtle-pressed);
  color: var(--eo-color-content-utility-positive);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-positive);
}

:host(:not([disabled])[hierarchy=free][intent=positive]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-transparent);
  --eo-ripple-pressed-color: var(--eo-color-surface-transparent);
  color: var(--eo-color-content-utility-positive);
}
:host(:not([disabled])[hierarchy=free][intent=positive]) .button:hover {
  color: var(--eo-component-button-color-content-free-positive-hovered);
}
:host(:not([disabled])[hierarchy=free][intent=positive]) .button:active {
  color: var(--eo-component-button-color-content-free-positive-pressed);
}
:host(:not([disabled])[hierarchy=free][intent=positive]) .button {
  --eo-divider-color: var(--eo-component-button-color-border-seperator-positive);
}

:host(:not([disabled])[intent=negative]) .button {
  background: var(--eo-color-surface-utility-negative);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-utility-negative-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-utility-negative-pressed);
  color: var(--eo-color-content-utility-on-utility);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-subtle);
}

:host(:not([disabled])[hierarchy=secondary][intent=negative]) .button {
  background: var(--eo-color-surface-transparent);
  border: var(--eo-dimension-border-width-default) solid var(--eo-color-border-utility-negative);
  --eo-ripple-hovered-color: var(--eo-color-surface-utility-negative-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-utility-negative-subtle-pressed);
  color: var(--eo-color-surface-utility-negative);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-negative);
}

:host(:not([disabled])[hierarchy=tertiary][intent=negative]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-utility-negative-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-utility-negative-subtle-pressed);
  color: var(--eo-color-surface-utility-negative);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-negative);
}

:host(:not([disabled])[hierarchy=free][intent=negative]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-transparent);
  --eo-ripple-pressed-color: var(--eo-color-surface-transparent);
  color: var(--eo-color-content-utility-negative);
}
:host(:not([disabled])[hierarchy=free][intent=negative]) .button:hover {
  color: var(--eo-component-button-color-content-free-negative-hovered);
}
:host(:not([disabled])[hierarchy=free][intent=negative]) .button:active {
  color: var(--eo-component-button-color-content-free-negative-pressed);
}
:host(:not([disabled])[hierarchy=free][intent=negative]) .button {
  --eo-divider-color: var(--eo-component-button-color-border-seperator-negative);
}

:host(:not([disabled])[intent=warning]) .button {
  background: var(--eo-color-surface-emphasized);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-emphasized-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-emphasized-pressed);
  color: var(--eo-color-content-on-emphasized);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-subtle);
}

:host(:not([disabled])[hierarchy=secondary][intent=warning]) .button {
  background: var(--eo-color-surface-transparent);
  border: var(--eo-dimension-border-width-default) solid var(--eo-color-border-emphasized);
  --eo-ripple-hovered-color: var(--eo-color-surface-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-subtle-pressed);
  color: var(--eo-color-content-emphasized);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host(:not([disabled])[hierarchy=tertiary][intent=warning]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-subtle-hovered);
  --eo-ripple-pressed-color: var(--eo-color-surface-subtle-pressed);
  color: var(--eo-color-content-emphasized);
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host(:not([disabled])[hierarchy=free][intent=warning]) .button {
  background: var(--eo-color-surface-transparent);
  border: none;
  --eo-ripple-hovered-color: var(--eo-color-surface-transparent);
  --eo-ripple-pressed-color: var(--eo-color-surface-transparent);
  color: var(--eo-color-content-emphasized);
}
:host(:not([disabled])[hierarchy=free][intent=warning]) .button:hover {
  color: var(--eo-component-button-color-content-free-emphasized-hovered);
}
:host(:not([disabled])[hierarchy=free][intent=warning]) .button:active {
  color: var(--eo-color-content-emphasized);
}
:host(:not([disabled])[hierarchy=free][intent=warning]) .button {
  --eo-divider-color: var(--eo-component-button-color-border-seperator-neutral);
}

:host([hierarchy=free]) .button {
  min-height: 0;
  padding: 0;
}

:host([content=icon]) .button {
  padding: var(--eo-dimension-padding-action-icon);
  width: var(--eo-dimension-size-touch-target-default);
}

:host([content=icon][size=small]) .button {
  padding: var(--eo-dimension-padding-action-icon-small);
  width: var(--eo-dimension-size-touch-target-small);
}

slot[name=icon]::slotted(*),
slot[name=leading-icon]::slotted(*) {
  width: var(--eo-dimension-size-icon-small);
  height: var(--eo-dimension-size-icon-small);
  position: relative;
}

:host([size=small]) slot[name=icon]::slotted(*),
:host([size=small]) slot[name=leading-icon]::slotted(*) {
  width: var(--eo-dimension-size-icon-smallest);
  height: var(--eo-dimension-size-icon-smallest);
}

.divider-container {
  height: var(--eo-dimension-size-icon-small);
  position: relative;
}

:host([size=small]) .divider-container {
  height: var(--eo-dimension-size-icon-smallest);
}`;var Ko=`:host {
  box-sizing: border-box;
  color: var(--eo-focus-color, var(--eo-color-border-emphasized));
  display: none;
  pointer-events: none;
  position: absolute;
  margin: auto;
  inset: 0;
  border-radius: inherit;
  outline: var(--eo-focus-border-width, var(--eo-dimension-border-width-emphasized)) var(--eo-focus-border-style, dashed) currentColor;
  outline-offset: var(--eo-focus-outline-offset, 2px);
}

:host([visible]) {
  display: flex;
}`;var Jo=["focusin","focusout","pointerdown"],Qo=class{get target(){return this._target}set target(o){if(o){this._target=o;for(let e of Jo)this._target.addEventListener(e,this)}else if(this._target){for(let e of Jo)this._target.removeEventListener(e,this);this._target=null}}constructor(o){this._target=null,this.host=o,this.host.addController(this)}hostConnected(){this.target=this.host.parentElement}hostDisconnected(){this.target=null}handleEvent(o){switch(o.type){case"focusin":this.host.visible=this.target?.matches(":focus-visible")??!1;break;case"focusout":case"pointerdown":this.host.visible=!1;break;default:return}}};var to=class extends w{static{this.styles=[A(Ko)]}constructor(){super(),this.visible=!1;try{new Qo(this)}catch(e){console.error("Error initializing FocusRingController:",e)}}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}};h([f({type:Boolean,reflect:!0})],to.prototype,"visible",void 0);to=h([$("eo-focus-ring")],to);var er=`:host {
  display: flex;
  margin: auto;
  pointer-events: none;
}
:host[disabled] {
  display: none;
}

:host,
.touch-area {
  border-radius: inherit;
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.touch-area {
  -webkit-tap-highlight-color: transparent;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
.touch-area::before, .touch-area::after {
  content: "";
  opacity: 0;
  position: absolute;
  inset: 0;
}
.touch-area::before {
  background-color: var(--eo-ripple-hovered-color, var(--eo-color-surface-accent-hovered));
  transition: opacity 15ms linear;
  transition-property: opacity;
}
.touch-area::after {
  background: radial-gradient(closest-side, var(--eo-ripple-pressed-color, var(--eo-color-surface-accent-pressed)) max(100% - 70px, 65%), transparent 100%);
}

.hovered::before {
  opacity: 1;
}

.pressed::after {
  opacity: 1;
  transition: opacity 150ms linear;
  transition-property: opacity;
}`;var tr=["click","contextmenu","pointercancel","pointerdown","pointerenter","pointerleave","pointerup","touchend"],ln=150,cn=50,or=class{get target(){return this._target}set target(o){if(o){this._target=o;for(let e of tr)this._target.addEventListener(e,this)}else if(this._target){for(let e of tr)this._target.removeEventListener(e,this);this._target=null}}constructor(o){this._target=null,this.state=0,this.isHovered=!1,this.isPressed=!1,this.host=o,this.host.addController(this)}hostConnected(){this.target=this.host.parentElement}hostDisconnected(){this.target=null}handleEvent(o){switch(o.type){case"click":this.handleClick();break;case"contextmenu":this.handleContextmenu();break;case"pointercancel":this.handlePointercancel(o);break;case"pointerdown":this.handlePointerdown(o);break;case"pointerenter":this.handlePointerenter(o);break;case"pointerleave":this.handlePointerleave(o);break;case"pointerup":this.handlePointerup(o);break;case"touchend":this.handleTouchend();break;default:break}}shouldReactToEvent(o){if(this.host.disabled||!o.isPrimary||this.rippleStartEvent&&this.rippleStartEvent.pointerId!==o.pointerId)return!1;if(o.type==="pointerenter"||o.type==="pointerleave")return!this.isTouch(o)&&this.hoverIsSupported();let e=o.buttons===1;return this.isTouch(o)||e}isTouch({pointerType:o}){return o==="touch"}hoverIsSupported(){return typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(hover: hover)").matches}handleClick(){if(!this.host.disabled){if(this.state===3){this.triggerEndPressAnimation();return}this.state===0&&(this.triggerStartPressAnimation(),this.triggerEndPressAnimation())}}handleContextmenu(){this.host.disabled||this.triggerEndPressAnimation()}handlePointercancel(o){this.shouldReactToEvent(o)&&this.triggerEndPressAnimation()}async handlePointerdown(o){if(this.shouldReactToEvent(o)){if(this.rippleStartEvent=o,!this.isTouch(o)){this.state=3,this.triggerStartPressAnimation(o);return}this.state=1,await new Promise(e=>{setTimeout(e,ln)}),this.state===1&&(this.state=2,this.triggerStartPressAnimation(o))}}handlePointerenter(o){this.shouldReactToEvent(o)&&(this.isHovered=!0,this.host.requestUpdate())}handlePointerleave(o){this.shouldReactToEvent(o)&&(this.isHovered=!1,this.state!==0&&this.triggerEndPressAnimation(),this.host.requestUpdate())}handlePointerup(o){if(this.shouldReactToEvent(o)){if(this.state===2){this.state=3;return}this.state===1&&(this.state=3,this.triggerStartPressAnimation(this.rippleStartEvent))}}handleTouchend(){setTimeout(()=>{this.state===3&&this.triggerEndPressAnimation()},cn)}triggerStartPressAnimation(o){this.isPressed=!0,this.host.startPressAnimation(o),this.host.requestUpdate()}async triggerEndPressAnimation(){this.state=0,this.rippleStartEvent=void 0,await this.host.endPressAnimation(),this.isPressed=!1,this.host.requestUpdate()}};var kt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ot=o=>(...e)=>({_$litDirective$:o,values:e}),Ie=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var rr=Ot(class extends Ie{constructor(o){if(super(o),o.type!==kt.ATTRIBUTE||o.name!=="class"||o.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(o){return" "+Object.keys(o).filter(e=>o[e]).join(" ")+" "}update(o,[e]){if(this.st===void 0){this.st=new Set,o.strings!==void 0&&(this.nt=new Set(o.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(let r in e)e[r]&&!this.nt?.has(r)&&this.st.add(r);return this.render(e)}let t=o.element.classList;for(let r of this.st)r in e||(t.remove(r),this.st.delete(r));for(let r in e){let n=!!e[r];n===this.st.has(r)||this.nt?.has(r)||(n?(t.add(r),this.st.add(r)):(t.remove(r),this.st.delete(r)))}return J}});var pn=450,nr=225,dn=.2,hn=10,un=75,fn=.35,mn="::after",vn="forwards",Rt=class extends w{static{this.styles=[A(er)]}constructor(){super(),this.disabled=!1,this.rippleController=new or(this),this.initialSize=0,this.rippleSize="",this.rippleScale=""}render(){let e={hovered:this.rippleController.isHovered,pressed:this.rippleController.isPressed};return this.disabled?b:m`<div class="touch-area ${rr(e)}"></div> `}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}startPressAnimation(e){if(!this.touchArea)return;this.growAnimation?.cancel(),this.determineRippleSize();let{startPoint:t,endPoint:r}=this.getTranslationCoordinates(e),n=`${t.x}px, ${t.y}px`,i=`${r.x}px, ${r.y}px`;this.growAnimation=this.touchArea.animate({top:[0,0],left:[0,0],height:[this.rippleSize,this.rippleSize],width:[this.rippleSize,this.rippleSize],transform:[`translate(${n}) scale(1)`,`translate(${i}) scale(${this.rippleScale})`]},{pseudoElement:mn,duration:pn,easing:"cubic-bezier(0.2, 0, 0, 1)",fill:vn})}async endPressAnimation(){let e=this.growAnimation,t=1/0;typeof e?.currentTime=="number"?t=e.currentTime:e?.currentTime&&(t=e.currentTime.to("ms").value),!(t>=nr)&&(await new Promise(r=>{setTimeout(r,nr-t)}),this.growAnimation)}determineRippleSize(){let{height:e,width:t}=this.getBoundingClientRect(),r=Math.max(e,t),n=Math.max(fn*r,un),i=this.currentCSSZoom??1,s=Math.floor(r*dn/i),a=Math.hypot(t,e)+hn;this.initialSize=s;let l=(a+n)/s;this.rippleScale=`${l/i}`,this.rippleSize=`${s}px`}getTranslationCoordinates(e){let{height:t,width:r}=this.getBoundingClientRect(),n=this.currentCSSZoom??1,i={x:(r/n-this.initialSize)/2,y:(t/n-this.initialSize)/2},s;return e instanceof PointerEvent?s=this.getNormalizedPointerEventCoords(e):s={x:r/n/2,y:t/n/2},s={x:s.x-this.initialSize/2,y:s.y-this.initialSize/2},{startPoint:s,endPoint:i}}getNormalizedPointerEventCoords(e){let{scrollX:t,scrollY:r}=globalThis,{left:n,top:i}=this.getBoundingClientRect(),s=t+n,a=r+i,{pageX:l,pageY:p}=e,c=this.currentCSSZoom??1;return{x:(l-s)/c,y:(p-a)/c}}};h([f({type:Boolean,reflect:!0})],Rt.prototype,"disabled",void 0);h([Ne(".touch-area")],Rt.prototype,"touchArea",void 0);Rt=h([$("eo-ripple")],Rt);var ir="full-width-context-key";var sr=o=>o??b;var oe=class extends w{constructor(...e){super(...e),this.disabled=!1,this.hierarchy="primary",this.intent="brand",this.size="default",this.content="label-icon",this.hasSeparator=!1,this.fullWidth=!1}static{this.shadowRootOptions={...w.shadowRootOptions,delegatesFocus:!0}}static{this.styles=[A(Yo)]}render(){return m`
      <button
        id=${sr(this.id)}
        class="button"
        aria-label=${this.ariaLabel??b}
        ?disabled=${this.disabled}
      >
        <eo-focus-ring></eo-focus-ring>
        <eo-ripple .disabled=${this.disabled}></eo-ripple>
        ${this.renderLeadingIcon()} ${this.renderLabel()}
        ${this.renderSeparator()} ${this.renderIcon()}
      </button>
    `}renderLabel(){return this.content==="icon"?b:m`<span class="label">
          <slot></slot>
        </span>`}renderLeadingIcon(){return this.content==="icon"?b:m`<slot name="leading-icon"></slot>`}renderIcon(){return m`<slot name="icon"></slot>`}renderSeparator(){return this.content==="icon"||!this.hasSeparator?b:m`<div class="divider-container">
      <eo-divider orientation="vertical" thickness="thin"></eo-divider>
    </div>`}};h([f({type:Boolean,reflect:!0})],oe.prototype,"disabled",void 0);h([f({type:String,reflect:!0})],oe.prototype,"hierarchy",void 0);h([f({type:String,reflect:!0}),$e({context:Ct,subscribe:!0})],oe.prototype,"intent",void 0);h([f({type:String,reflect:!0}),$e({context:Pt,subscribe:!0})],oe.prototype,"size",void 0);h([f({type:String,reflect:!0})],oe.prototype,"content",void 0);h([f({type:Boolean,reflect:!0,attribute:"has-separator"})],oe.prototype,"hasSeparator",void 0);h([f({type:Boolean,reflect:!0,attribute:"full-width"}),$e({context:ir,subscribe:!0})],oe.prototype,"fullWidth",void 0);oe=h([$("eo-button")],oe);var ar=`:host {
  display: contents;
  --eo-tooltip-dismiss-focus-outline-color: var(--eo-color-border-emphasized);
}

:host([appearance=emphasized]) {
  --eo-tooltip-dismiss-focus-outline-color: var(--eo-color-border-on-emphasized);
}

.tooltip {
  display: flex;
  filter: drop-shadow(var(--eo-shadow-all-around-level-4-base-x) var(--eo-shadow-all-around-level-4-base-y) var(--eo-shadow-all-around-level-4-base-blur) var(--eo-shadow-all-around-level-4-base-color));
  position: absolute;
  z-index: 1000;
}
.tooltip[hidden] {
  display: none;
}

:host([placement^=top]) .tooltip,
:host([placement^=bottom]) .tooltip {
  flex-direction: column;
  align-items: stretch;
}

:host([placement^=left]) .tooltip,
:host([placement^=right]) .tooltip {
  flex-direction: row;
  align-items: stretch;
}

.container {
  display: flex;
  align-items: flex-start;
  gap: var(--eo-dimension-gap-default-mobile);
  padding: var(--eo-dimension-padding-block-medium-mobile);
  border-radius: var(--eo-dimension-border-radius-default);
  background: var(--eo-color-surface-default);
  color: var(--eo-color-content-emphasized);
}

:host([appearance=emphasized]) .container {
  background: var(--eo-color-surface-emphasized);
  color: var(--eo-color-content-on-emphasized);
}

.content-wrapper {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.title-wrapper {
  font-family: var(--eo-typography-body-100-font-family);
  font-size: var(--eo-typography-body-100-font-size);
  line-height: var(--eo-typography-body-100-line-height);
  letter-spacing: var(--eo-typography-body-100-letter-spacing);
  font-weight: var(--eo-typography-font-weight-bold);
  margin-bottom: var(--dimension-padding-inline-smallest-mobile);
}

.slot-wrapper {
  font-family: var(--eo-typography-body-100-font-family);
  font-size: var(--eo-typography-body-100-font-size);
  line-height: var(--eo-typography-body-100-line-height);
  letter-spacing: var(--eo-typography-body-100-letter-spacing);
  font-weight: var(--eo-typography-font-weight-regular);
  flex: 1;
  min-width: 0;
}

::slotted([slot=title]) {
  margin-bottom: var(--dimension-padding-inline-smallest-mobile);
}

::slotted([slot=actions]) {
  margin-top: var(--eo-dimension-gap-default-mobile);
}

.actions-wrapper {
  display: flex;
  align-items: center;
}

.actions-wrapper[hidden],
.title-wrapper[hidden] {
  display: none;
}

.actions-wrapper ::slotted(*) {
  flex-shrink: 0;
}

.dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 12px;
  margin: -12px;
  border: none;
  border-radius: var(--eo-dimension-border-radius-round);
  background: none;
  cursor: pointer;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}
.dismiss:focus-visible {
  outline: none;
}
.dismiss:focus-visible eo-icon-close {
  border-radius: var(--eo-dimension-border-radius-round);
  outline: var(--eo-dimension-border-width-emphasized, 2px) dashed var(--eo-tooltip-dismiss-focus-outline-color);
  outline-offset: 4px;
}
.dismiss eo-icon-close {
  pointer-events: none;
  display: block;
}

.tip-container {
  display: flex;
  flex-shrink: 0;
}

.tip {
  flex-shrink: 0;
  background: var(--eo-color-surface-default);
  -webkit-mask: no-repeat center/contain;
  mask: no-repeat center/contain;
}

:host([appearance=emphasized]) .tip {
  background: var(--eo-color-surface-emphasized);
}

:host([placement^=top]) .tip-container {
  height: 8px;
}
:host([placement^=top]) .tip {
  width: 20px;
  height: 8px;
  -webkit-mask-image: var(--tip-mask-down);
  mask-image: var(--tip-mask-down);
}

:host([placement=top-start]) .tip-container {
  justify-content: flex-start;
  padding-left: var(--eo-dimension-padding-inline-small);
}

:host([placement=top]) .tip-container {
  justify-content: center;
}

:host([placement=top-end]) .tip-container {
  justify-content: flex-end;
  padding-right: var(--eo-dimension-padding-inline-default);
}

:host([placement^=bottom]) .tip-container {
  height: 8px;
}
:host([placement^=bottom]) .tip {
  width: 20px;
  height: 8px;
  -webkit-mask-image: var(--tip-mask-up);
  mask-image: var(--tip-mask-up);
}

:host([placement=bottom-start]) .tip-container {
  justify-content: flex-start;
  padding-left: var(--eo-dimension-padding-inline-small);
}

:host([placement=bottom]) .tip-container {
  justify-content: center;
}

:host([placement=bottom-end]) .tip-container {
  justify-content: flex-end;
  padding-right: var(--eo-dimension-padding-inline-default);
}

:host([placement^=left]) .tip-container {
  width: 8px;
}
:host([placement^=left]) .tip {
  width: 8px;
  height: 20px;
  -webkit-mask-image: var(--tip-mask-right);
  mask-image: var(--tip-mask-right);
}

:host([placement=left-start]) .tip-container {
  align-items: flex-start;
  padding-top: var(--eo-dimension-padding-block-default);
}

:host([placement=left]) .tip-container {
  align-items: center;
}

:host([placement=left-end]) .tip-container {
  align-items: flex-end;
  padding-bottom: var(--eo-dimension-padding-block-default);
}

:host([placement^=right]) .tip-container {
  width: 8px;
}
:host([placement^=right]) .tip {
  width: 8px;
  height: 20px;
  -webkit-mask-image: var(--tip-mask-left);
  mask-image: var(--tip-mask-left);
}

:host([placement=right-start]) .tip-container {
  align-items: flex-start;
  padding-top: var(--eo-dimension-padding-block-default);
}

:host([placement=right]) .tip-container {
  align-items: center;
}

:host([placement=right-end]) .tip-container {
  align-items: flex-end;
  padding-bottom: var(--eo-dimension-padding-block-default);
}

@media not (prefers-reduced-motion: reduce) {
  @keyframes eo-tooltip-show {
    from {
      opacity: 0;
      translate: 0 4px;
    }
    to {
      opacity: 1;
      translate: 0 0;
    }
  }
  :host {
    animation: eo-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) both;
  }
}`;var lr="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%208'%3e%3cpath%20d='M12.2422%206.4775C11.0489%207.82%208.9512%207.82%207.7578%206.4775L3.3287%201.4948C2.4836%200.544%201.2721%200%200%200H20C18.7279%200%2017.5164%200.544%2012.2422%206.4775Z'/%3e%3c/svg%3e";var cr="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%208'%3e%3cpath%20d='M12.2422%201.5225C11.0489%200.18%208.9512%200.18%207.7578%201.5225L3.3287%206.5052C2.4836%207.456%201.2721%208%200%208H20C18.7279%208%2017.5164%207.456%2012.2422%201.5225Z'/%3e%3c/svg%3e";var pr="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%208%2020'%3e%3cpath%20d='M6.4775%2012.2422C7.82%2011.0489%207.82%208.9512%206.4775%207.7578L1.4948%203.3287C0.544%202.4836%200%201.2721%200%200V20C0%2018.7279%200.544%2017.5164%206.4775%2012.2422Z'/%3e%3c/svg%3e";var dr="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%208%2020'%3e%3cpath%20d='M1.5225%2012.2422C0.18%2011.0489%200.18%208.9512%201.5225%207.7578L6.5052%203.3287C7.456%202.4836%208%201.2721%208%200V20C8%2018.7279%207.456%2017.5164%201.5225%2012.2422Z'/%3e%3c/svg%3e";function re(o,e,t,r){var n=arguments.length,i=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(o,e,t,r);else for(var a=o.length-1;a>=0;a--)(s=o[a])&&(i=(n<3?s(i):n>3?s(e,t,i):s(e,t))||i);return n>3&&i&&Object.defineProperty(e,t,i),i}var hr="variant-context-key";var ur=`svg {
  color: var(--eo-svg-icon-color, currentcolor);
}`;var se=class extends w{constructor(...o){super(...o),this.variant="filled",this.autoVariant=!0,this.size="default"}static{this.styles=[A(ur)]}render(){let o=m`<style>
      :host {
        display: inline-flex;
        width: var(--eo-dimension-size-icon-${this.size});
        height: var(--eo-dimension-size-icon-${this.size});
      }
    </style>`;switch(this.effectiveVariant){case"outlined":return m`${o}${this.outlinedSVG}`;default:return m`${o}${this.filledSVG}`}}get effectiveVariant(){return this.autoVariant&&this.contextVariant?this.contextVariant:this.variant}updated(o){super.updated(o),this.svgElement&&(this.svgElement.setAttribute("width","100%"),this.svgElement.setAttribute("height","100%"))}};re([f({type:String})],se.prototype,"variant",void 0);re([f({type:Boolean,attribute:"auto-variant"})],se.prototype,"autoVariant",void 0);re([f({type:String})],se.prototype,"size",void 0);re([Ne("svg")],se.prototype,"svgElement",void 0);re([$e({context:hr,subscribe:!0})],se.prototype,"contextVariant",void 0);var fr=class extends se{get outlinedSVG(){return m`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <g class="close">
        <g class="icon">
          <path
            d="M18.47 4.47a.75.75 0 1 1 1.06 1.06L13.06 12l6.47 6.47.052.056a.75.75 0 0 1-1.056 1.056l-.056-.052L12 13.06l-6.47 6.47a.75.75 0 1 1-1.06-1.06L10.94 12 4.47 5.53a.75.75 0 1 1 1.06-1.06L12 10.94l6.47-6.47Z"
            class="shape"
          />
        </g>
      </g>
    </svg> `}get filledSVG(){return m`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <g class="close">
        <g class="icon">
          <path
            d="m20.414 5-7 7 7 7L19 20.414l-7-7-7 7L3.586 19l7-7-7-7L5 3.586l7 7 7-7L20.414 5Z"
            class="shape"
          />
        </g>
      </g>
    </svg> `}get componentTag(){return"eo-icon-close"}};fr=re([$("eo-icon-close")],fr);var mr="important",gn=" !"+mr,vr=Ot(class extends Ie{constructor(o){if(super(o),o.type!==kt.ATTRIBUTE||o.name!=="style"||o.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(o){return Object.keys(o).reduce((e,t)=>{let r=o[t];return r==null?e:e+`${t=t.includes("-")?t:t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(o,[e]){let{style:t}=o.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(let r of this.ft)e[r]==null&&(this.ft.delete(r),r.includes("-")?t.removeProperty(r):t[r]=null);for(let r in e){let n=e[r];if(n!=null){this.ft.add(r);let i=typeof n=="string"&&n.endsWith(gn);r.includes("-")||i?t.setProperty(r,i?n.slice(0,-11):n,i?mr:""):t[r]=n}}return J}});var O="top",M="bottom",L="right",z="left",Tt="auto",fe=[O,M,L,z],ae="start",Ce="end",gr="clippingParents",zt="viewport",Ue="popper",br="reference",oo=fe.reduce(function(o,e){return o.concat([e+"-"+ae,e+"-"+Ce])},[]),Lt=[].concat(fe,[Tt]).reduce(function(o,e){return o.concat([e,e+"-"+ae,e+"-"+Ce])},[]),bn="beforeRead",yn="read",xn="afterRead",wn="beforeMain",En="main",_n="afterMain",Sn="beforeWrite",An="write",$n="afterWrite",yr=[bn,yn,xn,wn,En,_n,Sn,An,$n];function H(o){return o?(o.nodeName||"").toLowerCase():null}function P(o){if(o==null)return window;if(o.toString()!=="[object Window]"){var e=o.ownerDocument;return e&&e.defaultView||window}return o}function G(o){var e=P(o).Element;return o instanceof e||o instanceof Element}function B(o){var e=P(o).HTMLElement;return o instanceof e||o instanceof HTMLElement}function qe(o){if(typeof ShadowRoot>"u")return!1;var e=P(o).ShadowRoot;return o instanceof e||o instanceof ShadowRoot}function Cn(o){var e=o.state;Object.keys(e.elements).forEach(function(t){var r=e.styles[t]||{},n=e.attributes[t]||{},i=e.elements[t];!B(i)||!H(i)||(Object.assign(i.style,r),Object.keys(n).forEach(function(s){var a=n[s];a===!1?i.removeAttribute(s):i.setAttribute(s,a===!0?"":a)}))})}function Pn(o){var e=o.state,t={popper:{position:e.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(e.elements.popper.style,t.popper),e.styles=t,e.elements.arrow&&Object.assign(e.elements.arrow.style,t.arrow),function(){Object.keys(e.elements).forEach(function(r){var n=e.elements[r],i=e.attributes[r]||{},s=Object.keys(e.styles.hasOwnProperty(r)?e.styles[r]:t[r]),a=s.reduce(function(l,p){return l[p]="",l},{});!B(n)||!H(n)||(Object.assign(n.style,a),Object.keys(i).forEach(function(l){n.removeAttribute(l)}))})}}var xr={name:"applyStyles",enabled:!0,phase:"write",fn:Cn,effect:Pn,requires:["computeStyles"]};function j(o){return o.split("-")[0]}var Q=Math.max,Pe=Math.min,le=Math.round;function Ve(){var o=navigator.userAgentData;return o!=null&&o.brands&&Array.isArray(o.brands)?o.brands.map(function(e){return e.brand+"/"+e.version}).join(" "):navigator.userAgent}function it(){return!/^((?!chrome|android).)*safari/i.test(Ve())}function Z(o,e,t){e===void 0&&(e=!1),t===void 0&&(t=!1);var r=o.getBoundingClientRect(),n=1,i=1;e&&B(o)&&(n=o.offsetWidth>0&&le(r.width)/o.offsetWidth||1,i=o.offsetHeight>0&&le(r.height)/o.offsetHeight||1);var s=G(o)?P(o):window,a=s.visualViewport,l=!it()&&t,p=(r.left+(l&&a?a.offsetLeft:0))/n,c=(r.top+(l&&a?a.offsetTop:0))/i,d=r.width/n,v=r.height/i;return{width:d,height:v,top:c,right:p+d,bottom:c+v,left:p,x:p,y:c}}function ke(o){var e=Z(o),t=o.offsetWidth,r=o.offsetHeight;return Math.abs(e.width-t)<=1&&(t=e.width),Math.abs(e.height-r)<=1&&(r=e.height),{x:o.offsetLeft,y:o.offsetTop,width:t,height:r}}function st(o,e){var t=e.getRootNode&&e.getRootNode();if(o.contains(e))return!0;if(t&&qe(t)){var r=e;do{if(r&&o.isSameNode(r))return!0;r=r.parentNode||r.host}while(r)}return!1}function W(o){return P(o).getComputedStyle(o)}function ro(o){return["table","td","th"].indexOf(H(o))>=0}function U(o){return((G(o)?o.ownerDocument:o.document)||window.document).documentElement}function ce(o){return H(o)==="html"?o:o.assignedSlot||o.parentNode||(qe(o)?o.host:null)||U(o)}function wr(o){return!B(o)||W(o).position==="fixed"?null:o.offsetParent}function kn(o){var e=/firefox/i.test(Ve()),t=/Trident/i.test(Ve());if(t&&B(o)){var r=W(o);if(r.position==="fixed")return null}var n=ce(o);for(qe(n)&&(n=n.host);B(n)&&["html","body"].indexOf(H(n))<0;){var i=W(n);if(i.transform!=="none"||i.perspective!=="none"||i.contain==="paint"||["transform","perspective"].indexOf(i.willChange)!==-1||e&&i.willChange==="filter"||e&&i.filter&&i.filter!=="none")return n;n=n.parentNode}return null}function ee(o){for(var e=P(o),t=wr(o);t&&ro(t)&&W(t).position==="static";)t=wr(t);return t&&(H(t)==="html"||H(t)==="body"&&W(t).position==="static")?e:t||kn(o)||e}function Oe(o){return["top","bottom"].indexOf(o)>=0?"x":"y"}function Re(o,e,t){return Q(o,Pe(e,t))}function Er(o,e,t){var r=Re(o,e,t);return r>t?t:r}function at(){return{top:0,right:0,bottom:0,left:0}}function lt(o){return Object.assign({},at(),o)}function ct(o,e){return e.reduce(function(t,r){return t[r]=o,t},{})}var On=function(e,t){return e=typeof e=="function"?e(Object.assign({},t.rects,{placement:t.placement})):e,lt(typeof e!="number"?e:ct(e,fe))};function Rn(o){var e,t=o.state,r=o.name,n=o.options,i=t.elements.arrow,s=t.modifiersData.popperOffsets,a=j(t.placement),l=Oe(a),p=[z,L].indexOf(a)>=0,c=p?"height":"width";if(!(!i||!s)){var d=On(n.padding,t),v=ke(i),u=l==="y"?O:z,E=l==="y"?M:L,x=t.rects.reference[c]+t.rects.reference[l]-s[l]-t.rects.popper[c],y=s[l]-t.rects.reference[l],C=ee(i),R=C?l==="y"?C.clientHeight||0:C.clientWidth||0:0,T=x/2-y/2,g=d[u],_=R-v[c]-d[E],S=R/2-v[c]/2+T,k=Re(g,S,_),I=l;t.modifiersData[r]=(e={},e[I]=k,e.centerOffset=k-S,e)}}function Tn(o){var e=o.state,t=o.options,r=t.element,n=r===void 0?"[data-popper-arrow]":r;n!=null&&(typeof n=="string"&&(n=e.elements.popper.querySelector(n),!n)||st(e.elements.popper,n)&&(e.elements.arrow=n))}var _r={name:"arrow",enabled:!0,phase:"main",fn:Rn,effect:Tn,requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function X(o){return o.split("-")[1]}var zn={top:"auto",right:"auto",bottom:"auto",left:"auto"};function Ln(o,e){var t=o.x,r=o.y,n=e.devicePixelRatio||1;return{x:le(t*n)/n||0,y:le(r*n)/n||0}}function Sr(o){var e,t=o.popper,r=o.popperRect,n=o.placement,i=o.variation,s=o.offsets,a=o.position,l=o.gpuAcceleration,p=o.adaptive,c=o.roundOffsets,d=o.isFixed,v=s.x,u=v===void 0?0:v,E=s.y,x=E===void 0?0:E,y=typeof c=="function"?c({x:u,y:x}):{x:u,y:x};u=y.x,x=y.y;var C=s.hasOwnProperty("x"),R=s.hasOwnProperty("y"),T=z,g=O,_=window;if(p){var S=ee(t),k="clientHeight",I="clientWidth";if(S===P(t)&&(S=U(t),W(S).position!=="static"&&a==="absolute"&&(k="scrollHeight",I="scrollWidth")),S=S,n===O||(n===z||n===L)&&i===Ce){g=M;var N=d&&S===_&&_.visualViewport?_.visualViewport.height:S[k];x-=N-r.height,x*=l?1:-1}if(n===z||(n===O||n===M)&&i===Ce){T=L;var D=d&&S===_&&_.visualViewport?_.visualViewport.width:S[I];u-=D-r.width,u*=l?1:-1}}var q=Object.assign({position:a},p&&zn),Y=c===!0?Ln({x:u,y:x},P(t)):{x:u,y:x};if(u=Y.x,x=Y.y,l){var V;return Object.assign({},q,(V={},V[g]=R?"0":"",V[T]=C?"0":"",V.transform=(_.devicePixelRatio||1)<=1?"translate("+u+"px, "+x+"px)":"translate3d("+u+"px, "+x+"px, 0)",V))}return Object.assign({},q,(e={},e[g]=R?x+"px":"",e[T]=C?u+"px":"",e.transform="",e))}function Dn(o){var e=o.state,t=o.options,r=t.gpuAcceleration,n=r===void 0?!0:r,i=t.adaptive,s=i===void 0?!0:i,a=t.roundOffsets,l=a===void 0?!0:a,p={placement:j(e.placement),variation:X(e.placement),popper:e.elements.popper,popperRect:e.rects.popper,gpuAcceleration:n,isFixed:e.options.strategy==="fixed"};e.modifiersData.popperOffsets!=null&&(e.styles.popper=Object.assign({},e.styles.popper,Sr(Object.assign({},p,{offsets:e.modifiersData.popperOffsets,position:e.options.strategy,adaptive:s,roundOffsets:l})))),e.modifiersData.arrow!=null&&(e.styles.arrow=Object.assign({},e.styles.arrow,Sr(Object.assign({},p,{offsets:e.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:l})))),e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-placement":e.placement})}var Ar={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:Dn,data:{}};var Dt={passive:!0};function Mn(o){var e=o.state,t=o.instance,r=o.options,n=r.scroll,i=n===void 0?!0:n,s=r.resize,a=s===void 0?!0:s,l=P(e.elements.popper),p=[].concat(e.scrollParents.reference,e.scrollParents.popper);return i&&p.forEach(function(c){c.addEventListener("scroll",t.update,Dt)}),a&&l.addEventListener("resize",t.update,Dt),function(){i&&p.forEach(function(c){c.removeEventListener("scroll",t.update,Dt)}),a&&l.removeEventListener("resize",t.update,Dt)}}var $r={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:Mn,data:{}};var Bn={left:"right",right:"left",bottom:"top",top:"bottom"};function We(o){return o.replace(/left|right|bottom|top/g,function(e){return Bn[e]})}var Nn={start:"end",end:"start"};function Mt(o){return o.replace(/start|end/g,function(e){return Nn[e]})}function Te(o){var e=P(o),t=e.pageXOffset,r=e.pageYOffset;return{scrollLeft:t,scrollTop:r}}function ze(o){return Z(U(o)).left+Te(o).scrollLeft}function no(o,e){var t=P(o),r=U(o),n=t.visualViewport,i=r.clientWidth,s=r.clientHeight,a=0,l=0;if(n){i=n.width,s=n.height;var p=it();(p||!p&&e==="fixed")&&(a=n.offsetLeft,l=n.offsetTop)}return{width:i,height:s,x:a+ze(o),y:l}}function io(o){var e,t=U(o),r=Te(o),n=(e=o.ownerDocument)==null?void 0:e.body,i=Q(t.scrollWidth,t.clientWidth,n?n.scrollWidth:0,n?n.clientWidth:0),s=Q(t.scrollHeight,t.clientHeight,n?n.scrollHeight:0,n?n.clientHeight:0),a=-r.scrollLeft+ze(o),l=-r.scrollTop;return W(n||t).direction==="rtl"&&(a+=Q(t.clientWidth,n?n.clientWidth:0)-i),{width:i,height:s,x:a,y:l}}function Le(o){var e=W(o),t=e.overflow,r=e.overflowX,n=e.overflowY;return/auto|scroll|overlay|hidden/.test(t+n+r)}function Bt(o){return["html","body","#document"].indexOf(H(o))>=0?o.ownerDocument.body:B(o)&&Le(o)?o:Bt(ce(o))}function me(o,e){var t;e===void 0&&(e=[]);var r=Bt(o),n=r===((t=o.ownerDocument)==null?void 0:t.body),i=P(r),s=n?[i].concat(i.visualViewport||[],Le(r)?r:[]):r,a=e.concat(s);return n?a:a.concat(me(ce(s)))}function Fe(o){return Object.assign({},o,{left:o.x,top:o.y,right:o.x+o.width,bottom:o.y+o.height})}function Hn(o,e){var t=Z(o,!1,e==="fixed");return t.top=t.top+o.clientTop,t.left=t.left+o.clientLeft,t.bottom=t.top+o.clientHeight,t.right=t.left+o.clientWidth,t.width=o.clientWidth,t.height=o.clientHeight,t.x=t.left,t.y=t.top,t}function Cr(o,e,t){return e===zt?Fe(no(o,t)):G(e)?Hn(e,t):Fe(io(U(o)))}function jn(o){var e=me(ce(o)),t=["absolute","fixed"].indexOf(W(o).position)>=0,r=t&&B(o)?ee(o):o;return G(r)?e.filter(function(n){return G(n)&&st(n,r)&&H(n)!=="body"}):[]}function so(o,e,t,r){var n=e==="clippingParents"?jn(o):[].concat(e),i=[].concat(n,[t]),s=i[0],a=i.reduce(function(l,p){var c=Cr(o,p,r);return l.top=Q(c.top,l.top),l.right=Pe(c.right,l.right),l.bottom=Pe(c.bottom,l.bottom),l.left=Q(c.left,l.left),l},Cr(o,s,r));return a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}function pt(o){var e=o.reference,t=o.element,r=o.placement,n=r?j(r):null,i=r?X(r):null,s=e.x+e.width/2-t.width/2,a=e.y+e.height/2-t.height/2,l;switch(n){case O:l={x:s,y:e.y-t.height};break;case M:l={x:s,y:e.y+e.height};break;case L:l={x:e.x+e.width,y:a};break;case z:l={x:e.x-t.width,y:a};break;default:l={x:e.x,y:e.y}}var p=n?Oe(n):null;if(p!=null){var c=p==="y"?"height":"width";switch(i){case ae:l[p]=l[p]-(e[c]/2-t[c]/2);break;case Ce:l[p]=l[p]+(e[c]/2-t[c]/2);break;default:}}return l}function te(o,e){e===void 0&&(e={});var t=e,r=t.placement,n=r===void 0?o.placement:r,i=t.strategy,s=i===void 0?o.strategy:i,a=t.boundary,l=a===void 0?gr:a,p=t.rootBoundary,c=p===void 0?zt:p,d=t.elementContext,v=d===void 0?Ue:d,u=t.altBoundary,E=u===void 0?!1:u,x=t.padding,y=x===void 0?0:x,C=lt(typeof y!="number"?y:ct(y,fe)),R=v===Ue?br:Ue,T=o.rects.popper,g=o.elements[E?R:v],_=so(G(g)?g:g.contextElement||U(o.elements.popper),l,c,s),S=Z(o.elements.reference),k=pt({reference:S,element:T,strategy:"absolute",placement:n}),I=Fe(Object.assign({},T,k)),N=v===Ue?I:S,D={top:_.top-N.top+C.top,bottom:N.bottom-_.bottom+C.bottom,left:_.left-N.left+C.left,right:N.right-_.right+C.right},q=o.modifiersData.offset;if(v===Ue&&q){var Y=q[n];Object.keys(D).forEach(function(V){var ve=[L,M].indexOf(V)>=0?1:-1,ge=[O,M].indexOf(V)>=0?"y":"x";D[V]+=Y[ge]*ve})}return D}function ao(o,e){e===void 0&&(e={});var t=e,r=t.placement,n=t.boundary,i=t.rootBoundary,s=t.padding,a=t.flipVariations,l=t.allowedAutoPlacements,p=l===void 0?Lt:l,c=X(r),d=c?a?oo:oo.filter(function(E){return X(E)===c}):fe,v=d.filter(function(E){return p.indexOf(E)>=0});v.length===0&&(v=d);var u=v.reduce(function(E,x){return E[x]=te(o,{placement:x,boundary:n,rootBoundary:i,padding:s})[j(x)],E},{});return Object.keys(u).sort(function(E,x){return u[E]-u[x]})}function In(o){if(j(o)===Tt)return[];var e=We(o);return[Mt(o),e,Mt(e)]}function Un(o){var e=o.state,t=o.options,r=o.name;if(!e.modifiersData[r]._skip){for(var n=t.mainAxis,i=n===void 0?!0:n,s=t.altAxis,a=s===void 0?!0:s,l=t.fallbackPlacements,p=t.padding,c=t.boundary,d=t.rootBoundary,v=t.altBoundary,u=t.flipVariations,E=u===void 0?!0:u,x=t.allowedAutoPlacements,y=e.options.placement,C=j(y),R=C===y,T=l||(R||!E?[We(y)]:In(y)),g=[y].concat(T).reduce(function(De,pe){return De.concat(j(pe)===Tt?ao(e,{placement:pe,boundary:c,rootBoundary:d,padding:p,flipVariations:E,allowedAutoPlacements:x}):pe)},[]),_=e.rects.reference,S=e.rects.popper,k=new Map,I=!0,N=g[0],D=0;D<g.length;D++){var q=g[D],Y=j(q),V=X(q)===ae,ve=[O,M].indexOf(Y)>=0,ge=ve?"width":"height",F=te(e,{placement:q,boundary:c,rootBoundary:d,altBoundary:v,padding:p}),K=ve?V?L:z:V?M:O;_[ge]>S[ge]&&(K=We(K));var dt=We(K),be=[];if(i&&be.push(F[Y]<=0),a&&be.push(F[K]<=0,F[dt]<=0),be.every(function(De){return De})){N=q,I=!1;break}k.set(q,be)}if(I)for(var ht=E?3:1,Nt=function(pe){var Xe=g.find(function(ft){var ye=k.get(ft);if(ye)return ye.slice(0,pe).every(function(Ht){return Ht})});if(Xe)return N=Xe,"break"},Ze=ht;Ze>0;Ze--){var ut=Nt(Ze);if(ut==="break")break}e.placement!==N&&(e.modifiersData[r]._skip=!0,e.placement=N,e.reset=!0)}}var Pr={name:"flip",enabled:!0,phase:"main",fn:Un,requiresIfExists:["offset"],data:{_skip:!1}};function kr(o,e,t){return t===void 0&&(t={x:0,y:0}),{top:o.top-e.height-t.y,right:o.right-e.width+t.x,bottom:o.bottom-e.height+t.y,left:o.left-e.width-t.x}}function Or(o){return[O,L,M,z].some(function(e){return o[e]>=0})}function qn(o){var e=o.state,t=o.name,r=e.rects.reference,n=e.rects.popper,i=e.modifiersData.preventOverflow,s=te(e,{elementContext:"reference"}),a=te(e,{altBoundary:!0}),l=kr(s,r),p=kr(a,n,i),c=Or(l),d=Or(p);e.modifiersData[t]={referenceClippingOffsets:l,popperEscapeOffsets:p,isReferenceHidden:c,hasPopperEscaped:d},e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-reference-hidden":c,"data-popper-escaped":d})}var Rr={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:qn};function Vn(o,e,t){var r=j(o),n=[z,O].indexOf(r)>=0?-1:1,i=typeof t=="function"?t(Object.assign({},e,{placement:o})):t,s=i[0],a=i[1];return s=s||0,a=(a||0)*n,[z,L].indexOf(r)>=0?{x:a,y:s}:{x:s,y:a}}function Wn(o){var e=o.state,t=o.options,r=o.name,n=t.offset,i=n===void 0?[0,0]:n,s=Lt.reduce(function(c,d){return c[d]=Vn(d,e.rects,i),c},{}),a=s[e.placement],l=a.x,p=a.y;e.modifiersData.popperOffsets!=null&&(e.modifiersData.popperOffsets.x+=l,e.modifiersData.popperOffsets.y+=p),e.modifiersData[r]=s}var Tr={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:Wn};function Fn(o){var e=o.state,t=o.name;e.modifiersData[t]=pt({reference:e.rects.reference,element:e.rects.popper,strategy:"absolute",placement:e.placement})}var zr={name:"popperOffsets",enabled:!0,phase:"read",fn:Fn,data:{}};function lo(o){return o==="x"?"y":"x"}function Gn(o){var e=o.state,t=o.options,r=o.name,n=t.mainAxis,i=n===void 0?!0:n,s=t.altAxis,a=s===void 0?!1:s,l=t.boundary,p=t.rootBoundary,c=t.altBoundary,d=t.padding,v=t.tether,u=v===void 0?!0:v,E=t.tetherOffset,x=E===void 0?0:E,y=te(e,{boundary:l,rootBoundary:p,padding:d,altBoundary:c}),C=j(e.placement),R=X(e.placement),T=!R,g=Oe(C),_=lo(g),S=e.modifiersData.popperOffsets,k=e.rects.reference,I=e.rects.popper,N=typeof x=="function"?x(Object.assign({},e.rects,{placement:e.placement})):x,D=typeof N=="number"?{mainAxis:N,altAxis:N}:Object.assign({mainAxis:0,altAxis:0},N),q=e.modifiersData.offset?e.modifiersData.offset[e.placement]:null,Y={x:0,y:0};if(S){if(i){var V,ve=g==="y"?O:z,ge=g==="y"?M:L,F=g==="y"?"height":"width",K=S[g],dt=K+y[ve],be=K-y[ge],ht=u?-I[F]/2:0,Nt=R===ae?k[F]:I[F],Ze=R===ae?-I[F]:-k[F],ut=e.elements.arrow,De=u&&ut?ke(ut):{width:0,height:0},pe=e.modifiersData["arrow#persistent"]?e.modifiersData["arrow#persistent"].padding:at(),Xe=pe[ve],ft=pe[ge],ye=Re(0,k[F],De[F]),Ht=T?k[F]/2-ht-ye-Xe-D.mainAxis:Nt-ye-Xe-D.mainAxis,jr=T?-k[F]/2+ht+ye+ft+D.mainAxis:Ze+ye+ft+D.mainAxis,jt=e.elements.arrow&&ee(e.elements.arrow),Ir=jt?g==="y"?jt.clientTop||0:jt.clientLeft||0:0,go=(V=q?.[g])!=null?V:0,Ur=K+Ht-go-Ir,qr=K+jr-go,bo=Re(u?Pe(dt,Ur):dt,K,u?Q(be,qr):be);S[g]=bo,Y[g]=bo-K}if(a){var yo,Vr=g==="x"?O:z,Wr=g==="x"?M:L,xe=S[_],mt=_==="y"?"height":"width",xo=xe+y[Vr],wo=xe-y[Wr],It=[O,z].indexOf(C)!==-1,Eo=(yo=q?.[_])!=null?yo:0,_o=It?xo:xe-k[mt]-I[mt]-Eo+D.altAxis,So=It?xe+k[mt]+I[mt]-Eo-D.altAxis:wo,Ao=u&&It?Er(_o,xe,So):Re(u?_o:xo,xe,u?So:wo);S[_]=Ao,Y[_]=Ao-xe}e.modifiersData[r]=Y}}var Lr={name:"preventOverflow",enabled:!0,phase:"main",fn:Gn,requiresIfExists:["offset"]};function co(o){return{scrollLeft:o.scrollLeft,scrollTop:o.scrollTop}}function po(o){return o===P(o)||!B(o)?Te(o):co(o)}function Zn(o){var e=o.getBoundingClientRect(),t=le(e.width)/o.offsetWidth||1,r=le(e.height)/o.offsetHeight||1;return t!==1||r!==1}function ho(o,e,t){t===void 0&&(t=!1);var r=B(e),n=B(e)&&Zn(e),i=U(e),s=Z(o,n,t),a={scrollLeft:0,scrollTop:0},l={x:0,y:0};return(r||!r&&!t)&&((H(e)!=="body"||Le(i))&&(a=po(e)),B(e)?(l=Z(e,!0),l.x+=e.clientLeft,l.y+=e.clientTop):i&&(l.x=ze(i))),{x:s.left+a.scrollLeft-l.x,y:s.top+a.scrollTop-l.y,width:s.width,height:s.height}}function Xn(o){var e=new Map,t=new Set,r=[];o.forEach(function(i){e.set(i.name,i)});function n(i){t.add(i.name);var s=[].concat(i.requires||[],i.requiresIfExists||[]);s.forEach(function(a){if(!t.has(a)){var l=e.get(a);l&&n(l)}}),r.push(i)}return o.forEach(function(i){t.has(i.name)||n(i)}),r}function uo(o){var e=Xn(o);return yr.reduce(function(t,r){return t.concat(e.filter(function(n){return n.phase===r}))},[])}function fo(o){var e;return function(){return e||(e=new Promise(function(t){Promise.resolve().then(function(){e=void 0,t(o())})})),e}}function mo(o){var e=o.reduce(function(t,r){var n=t[r.name];return t[r.name]=n?Object.assign({},n,r,{options:Object.assign({},n.options,r.options),data:Object.assign({},n.data,r.data)}):r,t},{});return Object.keys(e).map(function(t){return e[t]})}var Dr={placement:"bottom",modifiers:[],strategy:"absolute"};function Mr(){for(var o=arguments.length,e=new Array(o),t=0;t<o;t++)e[t]=arguments[t];return!e.some(function(r){return!(r&&typeof r.getBoundingClientRect=="function")})}function Br(o){o===void 0&&(o={});var e=o,t=e.defaultModifiers,r=t===void 0?[]:t,n=e.defaultOptions,i=n===void 0?Dr:n;return function(a,l,p){p===void 0&&(p=i);var c={placement:"bottom",orderedModifiers:[],options:Object.assign({},Dr,i),modifiersData:{},elements:{reference:a,popper:l},attributes:{},styles:{}},d=[],v=!1,u={state:c,setOptions:function(C){var R=typeof C=="function"?C(c.options):C;x(),c.options=Object.assign({},i,c.options,R),c.scrollParents={reference:G(a)?me(a):a.contextElement?me(a.contextElement):[],popper:me(l)};var T=uo(mo([].concat(r,c.options.modifiers)));return c.orderedModifiers=T.filter(function(g){return g.enabled}),E(),u.update()},forceUpdate:function(){if(!v){var C=c.elements,R=C.reference,T=C.popper;if(Mr(R,T)){c.rects={reference:ho(R,ee(T),c.options.strategy==="fixed"),popper:ke(T)},c.reset=!1,c.placement=c.options.placement,c.orderedModifiers.forEach(function(D){return c.modifiersData[D.name]=Object.assign({},D.data)});for(var g=0;g<c.orderedModifiers.length;g++){if(c.reset===!0){c.reset=!1,g=-1;continue}var _=c.orderedModifiers[g],S=_.fn,k=_.options,I=k===void 0?{}:k,N=_.name;typeof S=="function"&&(c=S({state:c,options:I,name:N,instance:u})||c)}}}},update:fo(function(){return new Promise(function(y){u.forceUpdate(),y(c)})}),destroy:function(){x(),v=!0}};if(!Mr(a,l))return u;u.setOptions(p).then(function(y){!v&&p.onFirstUpdate&&p.onFirstUpdate(y)});function E(){c.orderedModifiers.forEach(function(y){var C=y.name,R=y.options,T=R===void 0?{}:R,g=y.effect;if(typeof g=="function"){var _=g({state:c,name:C,instance:u,options:T}),S=function(){};d.push(_||S)}})}function x(){d.forEach(function(y){return y()}),d=[]}return u}}var Yn=[$r,zr,Ar,xr,Tr,Pr,Lr,_r,Rr],vo=Br({defaultModifiers:Yn});var Ge,Nr=0,ne=class extends w{static{Ge=this}static{this.styles=[A(ar)]}static{this.FOCUSABLE_SELECTOR="button, [href], input, select, textarea, [tabindex]"}constructor(){super(),this.for="",this.isDismissable=!1,this.appearance="default",this.placement="top-start",this.open=!1,this.anchorElement=null,this.popperInstance=null,this.openedByHover=!1,this._showTooltip=()=>{this.isDismissable||this.open||(this.openedByHover=!0,this.open=!0)},this._hideTooltip=()=>{this.isDismissable||this.openedByHover&&(this.open=!1,this.openedByHover=!1)},this._handleKeyDown=e=>{if(!(!this.isDismissable||!this.open)){if(e.key==="Escape"){e.preventDefault(),this._dismiss(!0);return}if((e.key==="Enter"||e.key===" ")&&this._isDismissButtonFocused()){e.preventDefault(),this._dismiss(!0);return}e.key==="Tab"&&this._handleTabNavigation(e)}},this._handleDismissClick=()=>{this._dismiss(!1)},Nr+=1,this._tooltipId=`eo-tooltip-${Nr}`}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._handleKeyDown)}disconnectedCallback(){document.removeEventListener("keydown",this._handleKeyDown),this._teardownAnchor(),super.disconnectedCallback()}firstUpdated(){this._connectAnchor(),this._assertDismissContract()}updated(e){e.has("for")&&this._connectAnchor(),this.anchorElement&&this.popperInstance&&this.popperInstance.update(),this.open||(this.openedByHover=!1),this._assertDismissContract()}_assertDismissContract(){if(this.isDismissable&&!this.onDismiss)throw new Error("onDismiss is required when isDismissable is true")}_connectAnchor(){let e=this.getRootNode(),t=this.for?e.getElementById(this.for):null;if(t!==this.anchorElement){if(this._teardownAnchor(),t&&!this._isFocusable(t))throw new Error(`Tooltip anchor element (id="${this.for}") must be focusable. Ensure the element is an HTMLElement with a focus() method (e.g., button, [href], input, [tabindex]).`);this.anchorElement=t,this.anchorElement&&(this._setupAnchor(),this._initializePopper())}}_teardownAnchor(){this.popperInstance?.destroy(),this.popperInstance=null,this.anchorElement&&(this.anchorElement.removeAttribute("aria-describedby"),this.anchorElement.removeEventListener("mouseenter",this._showTooltip),this.anchorElement.removeEventListener("focus",this._showTooltip),this.anchorElement.removeEventListener("mouseleave",this._hideTooltip),this.anchorElement.removeEventListener("blur",this._hideTooltip),this.anchorElement=null,this.open=!1)}_setupAnchor(){this.anchorElement&&(this.anchorElement.setAttribute("aria-describedby",this._tooltipId),this.anchorElement.addEventListener("mouseenter",this._showTooltip),this.anchorElement.addEventListener("focus",this._showTooltip),this.anchorElement.addEventListener("mouseleave",this._hideTooltip),this.anchorElement.addEventListener("blur",this._hideTooltip))}_initializePopper(){!this.anchorElement||!this.tooltipElement||(this.popperInstance=vo(this.anchorElement,this.tooltipElement,{placement:this.placement,modifiers:[{name:"offset",options:{offset:[0,4]}}]}))}_handleTabNavigation(e){if(!this.anchorElement)return;let t=this._getTooltipTabStops();if(t.length===0)return;let r=this._deepActiveElement();if(this._isTrigger(r)){e.shiftKey||(e.preventDefault(),t[0].focus());return}let n=t.findIndex(i=>this._stopContains(i,r));if(n!==-1){if(e.shiftKey){e.preventDefault(),n===0?this._focusTrigger():t[n-1].focus();return}n<t.length-1?(e.preventDefault(),t[n+1].focus()):this._focusTrigger()}}_getTooltipTabStops(){let e=[],t=this.shadowRoot?.querySelector(".dismiss");return t&&e.push(t),this.shadowRoot?.querySelector('slot[name="actions"]')?.assignedElements({flatten:!0}).forEach(r=>{e.push(...this._collectFocusable(r))}),e}_collectFocusable(e){if(e.matches(Ge.FOCUSABLE_SELECTOR)&&this._isFocusable(e))return[e];let t=Array.from(e.querySelectorAll(Ge.FOCUSABLE_SELECTOR)).filter(r=>this._isFocusable(r));return t.length>0?t:[e]}_deepActiveElement(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}_isTrigger(e){let t=this.anchorElement;return!t||!e?!1:e===t||t.contains(e)||!!t.shadowRoot?.contains(e)}_stopContains(e,t){return t?e===t||e.contains(t)||!!e.shadowRoot?.contains(t):!1}render(){let e=this.placement.startsWith("top")||this.placement.startsWith("left");return m`
      <div class="tooltip" style=${vr({"--tip-mask-down":`url("${lr}")`,"--tip-mask-up":`url("${cr}")`,"--tip-mask-right":`url("${pr}")`,"--tip-mask-left":`url("${dr}")`})} ?hidden=${!this.open}>
        ${e?b:m`<div class="tip-container"><div class="tip"></div></div>`}
        <div class="container" id=${this._tooltipId} role="tooltip">
          <div class="content-wrapper">
            <slot name="title" class="title-wrapper"></slot>
            <div class="slot-wrapper">
              <slot></slot>
            </div>
            <slot name="actions" class="actions-wrapper"></slot>
          </div>
          ${this.isDismissable?this._renderDismiss():b}
        </div>
        ${e?m`<div class="tip-container"><div class="tip"></div></div>`:b}
      </div>
    `}_renderDismiss(){return m`
      <button
        class="dismiss"
        aria-label="Close"
        @click=${this._handleDismissClick}
      >
        <eo-icon-close variant="outlined"></eo-icon-close>
      </button>
    `}_dismiss(e=!1){this.onDismiss?.(),e&&this._focusTrigger()}_focusTrigger(){let e=this.anchorElement;if(!(!e||!this._isFocusable(e))&&(e.focus(),document.activeElement!==e)){let t=e.shadowRoot?.querySelectorAll(Ge.FOCUSABLE_SELECTOR);(t&&Array.from(t).find(r=>this._isFocusable(r)))?.focus()}}_isFocusable(e){if(!(e instanceof HTMLElement))return!1;if(e.matches(Ge.FOCUSABLE_SELECTOR)){let t=e.getAttribute("tabindex");if(t!==null){let r=Number(t);if(Number.isNaN(r)||r<0)return!1}return!0}return!!e.shadowRoot?.delegatesFocus}_isDismissButtonFocused(){let e=this.shadowRoot?.querySelector(".dismiss");if(!e)return!1;let t=this._deepActiveElement();return this._stopContains(e,t)}};h([f({type:String,reflect:!0})],ne.prototype,"for",void 0);h([f({type:Boolean,reflect:!0,attribute:"is-dismissable"})],ne.prototype,"isDismissable",void 0);h([f({type:String,reflect:!0})],ne.prototype,"appearance",void 0);h([f({type:String,reflect:!0})],ne.prototype,"placement",void 0);h([f({type:Boolean,reflect:!0})],ne.prototype,"open",void 0);h([f({type:Function,attribute:!1})],ne.prototype,"onDismiss",void 0);h([Ne(".tooltip")],ne.prototype,"tooltipElement",void 0);ne=Ge=h([$("eo-tooltip")],ne);var Hr=class extends se{get outlinedSVG(){return m`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <g class="change-direction">
        <g class="icon">
          <path
            d="M6.33 12.496a.752.752 0 0 1 1.063 1.063l-2.926 2.926h16.78a.752.752 0 0 1 0 1.503H4.665l2.73 2.73a.752.752 0 0 1-1.007 1.114l-.056-.052-4.11-4.11a.751.751 0 0 1 0-1.063l4.11-4.11ZM16.606 2.22a.752.752 0 0 1 1.063 0l4.11 4.11c.003.004.006.009.01.012.021.022.039.047.057.072.01.013.023.025.032.04.015.024.027.05.04.075.009.017.019.034.026.052a.746.746 0 0 1 0 .562l-.005.011a.75.75 0 0 1-.064.119l-.017.022a.748.748 0 0 1-.072.088l-.007.01-4.11 4.11a.751.751 0 0 1-1.063-1.062l2.828-2.828H2.75a.751.751 0 0 1 0-1.503h16.683l-2.828-2.827a.752.752 0 0 1 0-1.063Z"
            class="shape"
          />
        </g>
      </g>
    </svg> `}get filledSVG(){return m`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <g class="change-direction">
        <g class="icon">
          <path
            d="m8.557 12.96-2.972 2.973h16.017v1.92H5.768l2.789 2.79L7.199 22 2 16.802l5.2-5.2 1.357 1.359ZM22 7.2l-5.2 5.198-1.357-1.358 2.881-2.88H2.397V6.237h15.926l-2.88-2.88L16.801 2 22 7.2Z"
            class="shape"
          />
        </g>
      </g>
    </svg> `}get componentTag(){return"eo-icon-change-direction"}};Hr=re([$("eo-icon-change-direction")],Hr);var zu="0.1.25";export{zu as DS_VERSION};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
@lit/context/lib/decorators/provide.js:
lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
@lit/context/lib/decorators/consume.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
@lit/context/lib/context-request-event.js:
@lit/context/lib/create-context.js:
@lit/context/lib/controllers/context-consumer.js:
@lit/context/lib/value-notifier.js:
@lit/context/lib/controllers/context-provider.js:
@lit/context/lib/context-root.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
lit-html/directives/if-defined.js:
lit-html/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
