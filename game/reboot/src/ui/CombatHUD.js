import {createElement as h,useEffect,useRef,useState} from 'react'
import {boundedHealth,formatHealth,combatStateLabel,combatFeedback} from './combatPresentation.js'



// Read-only mission feedback. No input, persistence, rewards, frame subscription

// or campaign authority. Hidden during free exploration and menu navigation.

export default function CombatHUD(props){
 const [minimised,setMinimised]=useState(false),[feedback,setFeedback]=useState([]),previous=useRef(null),feedbackTimer=useRef(null)
 useEffect(()=>{const old=previous.current;previous.current=props.session;if(!old||old.id!==props.session?.id||props.session?.state!=='active'){clearTimeout(feedbackTimer.current);setFeedback([]);return}const messages=combatFeedback(old,props.session);if(messages.length){clearTimeout(feedbackTimer.current);setFeedback(messages);feedbackTimer.current=setTimeout(()=>setFeedback([]),2500)}},[props.session])
 useEffect(()=>()=>clearTimeout(feedbackTimer.current),[])
 return h(CombatHUDView,{...props,feedback,minimised,onToggle:()=>setMinimised(value=>!value)})
}

export function CombatHUDView({session,hint,location,action,minimised=false,onToggle,feedback=[]}){

 if(!['mission-1','mission-2','mission-3','mission-4'].includes(session?.missionId)||!['active','suspended','concluding'].includes(session.state))return null

 const resources=session.playerResources

 if(!resources||!Number.isFinite(resources.health)||!Number.isFinite(resources.maxHealth)||resources.maxHealth<=0)return null

 const enemies=(session.actorStates??[]).filter(a=>a.state==='active-combat'&&a.health>0)

 const bar=(label,health,max,key)=>h('div',{key,style:{marginTop:6}},h('span',null,`${label}: ${formatHealth(health,max)} / ${formatHealth(max,max)}`),h('progress',{'aria-label':label,value:boundedHealth(health,max),max,'aria-valuetext':`${formatHealth(health,max)} of ${formatHealth(max,max)} health`,style:{display:'block',width:'100%',accentColor:'#8fcbb0'}}))

 return h('aside',{'aria-label':'Mission combat HUD',style:{position:'absolute',bottom:16,left:16,zIndex:2,pointerEvents:'none',width:minimised?'auto':'min(320px, calc(100% - 32px))',boxSizing:'border-box',padding:minimised?6:12,background:'#14211fe8',color:'#f0e5cb',border:'1px solid #a88a57',font:'12px system-ui',fontVariantNumeric:'tabular-nums',overflowWrap:'anywhere'}},

  h('button',{type:'button',onClick:onToggle,'aria-label':minimised?'Restore combat HUD':'Minimise combat HUD','aria-expanded':!minimised,'aria-controls':'mission-combat-details',style:{pointerEvents:'auto',display:'block',marginLeft:'auto',cursor:'pointer',color:'inherit',background:'#20372f',border:'1px solid #a88a57',borderRadius:3,padding:'4px 8px',font:'inherit'}},minimised?'+ HUD':'− Minimise'),
  h('div',{id:'mission-combat-details',hidden:minimised},
  bar('Bhairava',resources.health,resources.maxHealth,'player'),

  h('div',null,`H: Heal: ${resources.healingCharges??0} / ${resources.healingCapacity??5} remaining`),
  location?h('div',null,'Inside: '+location):null,
  h('div',{'aria-label':'Combat state'},'Combat: '+combatStateLabel(session,action)),

  hint?h('div',null,`Nearest encounter: ${hint.id} · ${hint.distance} m ${hint.direction}. Use streets and entrances.`):null,

  resources.health<=0?h('strong',{role:'status'},'Bhairava defeated — use Restart mission below.'):null,

  session.state==='suspended'?h('strong',null,'Combat paused'):null,

  ...enemies.map(a=>bar(a.category==='boss'?'Warden':a.actorId,a.health,a.maxHealth,a.instanceId)),

  feedback.length>0?h('div',{role:'status','aria-live':'polite','aria-atomic':true,style:{marginTop:6,padding:5,borderLeft:'3px solid #e6bf67',maxHeight:60,overflow:'auto'}},...feedback.map((text,i)=>h('div',{key:i},text))):null,

  h('div',{style:{marginTop:8}},'J / K attack · F block · Q / Shift dodge · Space jump · E interact'),

  h('small',null,'Finisher unavailable. Soldier combat animation clips remain unavailable.')),
  resources.health<=0?h('div',{role:'alert','aria-label':'Mission defeated',style:{position:'fixed',inset:0,zIndex:4,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#150b0b99',color:'#fff0df',pointerEvents:'none',textAlign:'center'}},h('strong',{style:{font:'bold clamp(32px, 6vw, 72px) system-ui',letterSpacing:6}},'DEFEATED'),h('p',null,'Bhairava has fallen. Choose Revive Here for full health and 5 heals, or Restart.')):null)

}

