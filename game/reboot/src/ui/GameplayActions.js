import {BUILDINGS} from '../world/locations/buildings/definitions.js'
import {createElement as h} from 'react'



// UI commands delegate to the existing runtime. No combat or save authority.

export default function GameplayActions({session,completed=false,score=0,busy=false,nextPlayable=false,guidance,worldMode,locationId,onTravel,flightMessage,onCinematic,onSkipCinematic,message='',error,interaction,onInteract,onHome,onMissions,onRestart,onRevive,onNext,onPause,onVisitRoom,onReturnRoom,roomLabel}){

 const visiting=worldMode==='mission-room'
 const interior=BUILDINGS.find(b=>b.id===locationId)
 const defeated=Boolean(session?.playerResources?.health<=0),paused=session?.state==='suspended',result=defeated||completed

 const button=(label,action,disabled=false)=>h('button',{type:'button',disabled:busy||disabled,onClick:action,key:label},label)

 const actions=()=>[completed?button('Next Mission',onNext,!nextPlayable):null,button('Main Menu',onHome),button('Restart',onRestart),button('Mission Selection',onMissions),defeated?button('Revive Here',onRevive,!onRevive):null]

 return h('div',{className:'gameplay-actions'},

  !visiting&&!result&&h('nav',{'aria-label':'Gameplay controls',className:'gameplay-toolbar'},session&&button(paused?'Resume':'Pause',onPause),button('Main Menu',onHome),button('Mission Selection',onMissions),session&&button('Restart',onRestart),session?.missionId==='mission-1'&&!paused&&button('Visit Kashi Room',onVisitRoom,!onVisitRoom),!session&&onTravel&&(interior?button(interior.parent==='kashi'?'Return to Kashi':'Return to The Complex',()=>onTravel(interior.parent),worldMode!=='exploration'):locationId==='complex'||locationId==='shambala'?button('Return to Kashi',()=>onTravel('kashi'),worldMode!=='exploration'):button('Travel to The Complex',()=>onTravel('complex'),worldMode!=='exploration')),!session&&onTravel&&!interior&&locationId!=='complex'&&locationId!=='shambala'&&button('Travel to Shambala',()=>onTravel('shambala'),worldMode!=='exploration'),!session&&onCinematic&&button((locationId==='complex'?'Complex':locationId==='shambala'?'Shambala':'Kashi')+' Cinematic Experience',onCinematic,worldMode==='cinematic'||worldMode==='preparing'),!session&&worldMode==='cinematic'&&button('Skip Cinematic',onSkipCinematic)),

  result&&h('section',{'aria-label':completed?'Mission victory actions':'Mission defeat actions',className:'gameplay-result '+(completed?'victory':'defeat')},

   completed&&h('h1',null,'VICTORY'),completed&&h('p',null,'Mission complete'),completed&&h('p',{className:'victory-score'},`Campaign score: ${score.toLocaleString('en-US')}`),

   h('div',{className:'result-buttons'},...actions()),completed&&!nextPlayable&&h('p',{className:'next-unavailable'},'Next mission is not yet playable. You can browse all missions in Mission Selection.')),

  !session&&!result&&locationId==='complex'&&h('section',{className:'gameplay-objective','aria-label':'Complex location'},h('strong',null,'THE COMPLEX'),h('div',null,'Arrival Plaza · Citadel Concourse · Northern Belvedere'),h('div',null,'Walk and look around. E at the south arrival gate returns to Kashi.')),

  !session&&!result&&locationId==='shambala'&&h('section',{className:'gameplay-objective','aria-label':'Shambala location'},h('strong',null,'SHAMBALA'),h('div',null,'Temple Court · Cedar Grove · River bridges and falls'),h('div',null,'Walk freely. E at the arrival meadow gate returns to Kashi.')),

  !visiting&&!result&&guidance&&h('section',{'aria-label':'Next mission objective',className:'gameplay-objective'},h('strong',null,guidance.title),h('div',null,guidance.detail),guidance.distance!==null&&h('div',null,`${guidance.distance} m ${guidance.direction} - use streets and entrances`)),

  !visiting&&paused&&!result&&h('div',{className:'gameplay-paused',role:'status'},'PAUSED'),

  !result&&(!paused||visiting)&&interaction&&h('div',{className:'gameplay-interaction'},button('E - '+interaction,onInteract)),

  (!session||visiting)&&!result&&flightMessage&&h('p',{className:'gameplay-flight-instructions','aria-label':'Exploration instructions'},flightMessage),

  visiting&&h('section',{className:'gameplay-objective','aria-label':'Mission room'},h('strong',null,roomLabel||'Bhairava Room')),
  interior&&h('aside',{'aria-label':'Building interior',className:'gameplay-objective'},h('strong',null,interior.label),h('p',null,'Explore the rooms. E at the marked exit returns outside.')),
  visiting&&h('nav',{'aria-label':'Room visit controls',className:'gameplay-toolbar'},button('Return to Mission',onReturnRoom)),
  (error||/^[A-Z_]+:/.test(message))&&h('p',{role:'alert',className:'gameplay-error'},error||message))

}

