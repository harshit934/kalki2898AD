import {createElement as h,useEffect,useState} from 'react'
export default function WayfindingHUD({readView,enabled}){
 const [visible,setVisible]=useState(true),[selected,setSelected]=useState('bhairava-room'),[view,setView]=useState(null)
 useEffect(()=>{if(!enabled||!visible)return;let closed=false,previous='';const tick=()=>{if(closed||document.visibilityState==='hidden')return;let value;try{value=readView()}catch{value=null}const key=JSON.stringify(value);if(key!==previous){previous=key;setView(value)}};tick();const timer=setInterval(tick,200);return()=>{closed=true;clearInterval(timer)}},[readView,enabled,visible])
 return enabled?h(WayfindingHUDView,{view,visible,selected,onToggle:()=>setVisible(v=>!v),onSelect:setSelected}):null
}
export function WayfindingHUDView({view,visible=true,selected='bhairava-room',onToggle,onSelect}){
 const target=view?.items.find(item=>item.id===selected),button={pointerEvents:'auto',background:'#192b27',color:'#faedca',border:'1px solid #bfa258',borderRadius:4,padding:'5px 8px',cursor:'pointer',font:'inherit'}
 const markers=visible&&view?view.items.filter(item=>item.screen&&item.screen.x*view.viewport.width>=Math.min(100,view.viewport.width*.45)&&item.screen.x*view.viewport.width<=view.viewport.width-Math.min(100,view.viewport.width*.45)&&item.screen.y*view.viewport.height>=45).map(item=>h('span',{key:item.id,'data-landmark-id':item.id,style:{position:'absolute',left:view.viewport.left+item.screen.x*view.viewport.width,top:view.viewport.top+item.screen.y*view.viewport.height,transform:'translate(-50%,-100%)',maxWidth:Math.min(180,view.viewport.width*.8),textAlign:'center',color:'#faedca',background:'#10201ef0',border:'1px solid #bfa258',borderRadius:4,padding:'4px 7px',font:'12px system-ui',zIndex:2}},item.label)):[]
 const choices=view?view.items.map(item=>h('button',{key:item.id,type:'button','aria-pressed':selected===item.id,onClick:()=>onSelect?.(item.id),style:{...button,display:'block',width:'100%',marginTop:4,textAlign:'left',borderColor:selected===item.id?'#faedca':'#836c3c'}},item.label)):[]
 const guidance=target?h('p',{'aria-label':'Destination guidance',style:{lineHeight:1.5,marginBottom:0}},h('span',{'aria-hidden':true,style:{display:'inline-block',transform:`rotate(${target.angle}deg)`,marginRight:8}},'\u2191'),`${target.distance} m ${target.direction} \u00b7 ${target.relative} of Bhairava`):h('p',null,'Guidance available while walking.')
 return h('div',{'aria-label':'Kashi wayfinding',style:{pointerEvents:'none'}},...markers,
  h('aside',{style:{position:'absolute',right:16,top:155,zIndex:3,width:'min(230px,36vw)',padding:8,boxSizing:'border-box',background:'#10201ef0',color:'#faedca',border:'1px solid #bfa258',borderRadius:5,font:'12px system-ui'}},
   h('button',{type:'button',onClick:onToggle,'aria-expanded':visible,style:button},visible?'Hide wayfinding':'Show wayfinding'),
   visible&&h('div',null,h('p',{style:{margin:'7px 0'}},'Kashi landmarks'),h('div',{'aria-label':'Landmark destinations',style:{maxHeight:160,overflowY:'auto',pointerEvents:'auto'}},...choices),guidance)))
}
