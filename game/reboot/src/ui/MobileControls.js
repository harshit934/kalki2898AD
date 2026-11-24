import {Component,createElement as h} from 'react'
import {createTouchInput,joystickKeys} from './touchInput.js'
export const isBikePrompt=prompt=>prompt==='Dismount bike'
export function isFlightPrompt(prompt){return ['Exit skimmer','Dismount skimmer','Dismount requires landing'].includes(prompt)}
export default class MobileControls extends Component{
 state={knob:{x:0,y:0}}
 bridge=null
 stick=null
 componentDidMount(){this.syncInput()}
 componentDidUpdate(previous){if(previous.enabled!==this.props.enabled)this.syncInput()}
 componentWillUnmount(){this.bridge?.release();this.bridge=null}
 syncInput(){this.bridge?.release();this.bridge=null;this.stick=null;if(this.props.enabled){this.setState({knob:{x:0,y:0}});this.bridge=createTouchInput({target:window,onReset:()=>{this.stick=null;this.setState({knob:{x:0,y:0}})}})}}
 stop=e=>{e.preventDefault();e.stopPropagation()}
 release=e=>{this.stop(e);this.bridge?.end(e.pointerId);if(e.currentTarget.hasPointerCapture?.(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}
 position(e){const r=e.currentTarget.getBoundingClientRect(),radius=r.width*.36,dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,length=Math.hypot(dx,dy),scale=length>radius?radius/length:1;this.setState({knob:{x:dx*scale,y:dy*scale}});return joystickKeys(dx,dy,radius)}
 startStick=e=>{if(this.stick!==null)return;this.stop(e);this.stick=e.pointerId;e.currentTarget.setPointerCapture?.(e.pointerId);this.bridge?.begin(e.pointerId,this.position(e))}
 moveStick=e=>{if(this.stick!==e.pointerId)return;this.stop(e);this.bridge?.update(e.pointerId,this.position(e))}
 endStick=e=>{if(this.stick!==e.pointerId)return;this.stick=null;this.setState({knob:{x:0,y:0}});this.release(e)}
 lostStick=e=>{this.bridge?.end(e.pointerId);if(this.stick===e.pointerId){this.stick=null;this.setState({knob:{x:0,y:0}})}}
 render(){const {enabled,mission=false,heals=0,flight=false,bike=false}=this.props;if(!enabled)return null;const {knob}=this.state,buttons=bike?[['Brake',' '],['Exit bike','e']]:mission?[['Attack','j'],['Heavy','k'],['Defend','f'],['Heal ('+heals+')','h'],['Dodge','q'],['Jump',' '],['Interact','e'],['Run','control']]:flight?[['Rise',' '],['Descend','l'],['Exit','e']]:[['Interact','e'],['Jump',' '],['Run','control']]
  return h('section',{className:'mobile-controls','aria-label':'Touch gameplay controls'},
   h('div',{className:'mobile-stick',role:'group','aria-label':flight?'Flight thrust and turning':'Movement joystick',onContextMenu:this.stop,onPointerDown:this.startStick,onPointerMove:this.moveStick,onPointerUp:this.endStick,onPointerCancel:this.endStick,onLostPointerCapture:this.lostStick},h('span',{className:'mobile-stick-label'},bike?'RIDE':flight?'FLY':'MOVE'),h('span',{className:'mobile-stick-knob',style:{transform:`translate(${knob.x}px, ${knob.y}px)`}})),
   h('p',{className:'mobile-look-hint'},mission?'Drag the game view to look around':'Hold a direction to move'),
   h('div',{className:'mobile-action-buttons'},...buttons.map(([label,key])=>h('button',{type:'button',key,'aria-label':label,disabled:key==='h'&&heals<=0,onContextMenu:this.stop,onPointerDown:e=>{this.stop(e);e.currentTarget.setPointerCapture?.(e.pointerId);this.bridge?.begin(e.pointerId,[key])},onPointerUp:this.release,onPointerCancel:this.release,onLostPointerCapture:e=>this.bridge?.end(e.pointerId)},label))))
 }
}
