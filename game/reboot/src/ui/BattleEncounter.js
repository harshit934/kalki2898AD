import {createElement as h} from 'react'
export default function BattleEncounter({battle}){
 if(!battle||!battle.active&&!battle.defeated)return null
 return h('aside',{className:'battle-encounter','aria-label':'Major battle',style:{position:'absolute',top:'5rem',left:'30%',right:'30%',padding:'.6rem',background:'#101e1bea',color:'#f4deb1',border:'1px solid #b99c61',pointerEvents:'none',zIndex:12}},h('strong',null,battle.name),h('div',null,battle.defeated?'Encounter defeated':`Phase ${battle.phase} / 3 · ${Math.ceil(battle.health)} / ${battle.maxHealth}`),h('progress',{'aria-label':'Boss health',value:battle.health,max:battle.maxHealth,style:{width:'100%'}}),h('small',null,battle.attack+' · '+battle.hint),h('p',null,battle.message),h('div',null,'J attack · K heavy/counter after block · F block · Q dodge · R special (8s)'))
}
