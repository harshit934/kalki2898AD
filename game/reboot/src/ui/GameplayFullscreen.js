import {Component,createElement} from 'react'

// Presentation-only ownership. Never changes mission, input or camera authority.
export function createFullscreenController(target,onChange=()=>{}){
 const doc=target?.ownerDocument
 let closed=false,pending=false,error=null
 const supported=Boolean(target?.requestFullscreen&&doc?.exitFullscreen&&doc.fullscreenEnabled!==false)
 const snapshot=()=>({supported,active:Boolean(target&&doc?.fullscreenElement===target),pending,error})
 const publish=()=>{if(!closed)onChange(snapshot())}
 const changed=()=>{publish();doc?.defaultView?.dispatchEvent(new Event('resize'))}
 const failed=()=>{error='Fullscreen unavailable. Use the normal game view.';publish()}
 doc?.addEventListener('fullscreenchange',changed)
 doc?.addEventListener('fullscreenerror',failed)
 publish()
 async function exitOwned(){if(target&&doc?.fullscreenElement===target)try{await doc.exitFullscreen()}catch{/* Esc remains the browser-owned exit. */}}
 return {snapshot,async toggle(){if(closed||pending||!supported)return false;pending=true;error=null;publish();try{if(doc.fullscreenElement===target)await doc.exitFullscreen();else await target.requestFullscreen();if(closed){await exitOwned();return false}return true}catch{if(!closed)failed();return false}finally{pending=false;publish()}},async release(){if(closed)return;closed=true;doc?.removeEventListener('fullscreenchange',changed);doc?.removeEventListener('fullscreenerror',failed);await exitOwned()}}
}

export default class GameplayFullscreen extends Component{
 state={supported:false,active:false,pending:false,error:null}
 update=view=>this.setState(view)
 componentDidMount(){this.controller=createFullscreenController(document.getElementById(this.props.targetId??'kashi-gameplay-view'),this.update)}
 componentWillUnmount(){void this.controller?.release()}
 toggle=()=>{void this.controller?.toggle()}
 render(){const view=this.state;return createElement('div',{className:'gameplay-fullscreen-control'},createElement('button',{type:'button',disabled:!view.supported||view.pending,'aria-pressed':view.active,onClick:this.toggle,title:view.active?'Exit fullscreen (Esc)':'Show gameplay fullscreen'},view.active?'Exit fullscreen':'Enter fullscreen'),view.error?createElement('span',{role:'status'},view.error):null)}
}
