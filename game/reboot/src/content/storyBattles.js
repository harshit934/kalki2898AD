import {deepFreeze} from '../campaign/contracts.js'

// Original mechanical antagonists; existing approved Warden mesh components.
export const STORY_BATTLES=deepFreeze({
 'mission-2':{name:'Contract Enforcer',health:360,color:'#edb36a',position:[194,-.22,414],bounds:{minX:188,maxX:200,minZ:409,maxZ:423},patterns:[['sweep','charge'],['charge','ring','sweep'],['charge','sweep','ring','charge']],hazard:'ring',intro:'The copied contract has activated its mechanical enforcer.'},
 'mission-3':{name:'Terrace Sentinel',health:420,color:'#9be3e6',position:[330,-.04,128],bounds:{minX:324,maxX:336,minZ:123,maxZ:137},patterns:[['bolt','ring'],['bolt','bolt','ring'],['ring','bolt','sweep','bolt']],hazard:'ring',intro:'The relays expose a malfunctioning terrace sentinel. Disable it before reporting.'},
 'mission-4':{name:'Reactor Lockout Construct',health:480,color:'#f18168',position:[178,-.025,124],bounds:{minX:172,maxX:184,minZ:119,maxZ:133},patterns:[['sweep','thermal'],['bolt','thermal','charge'],['thermal','ring','charge','bolt']],hazard:'thermal',intro:'The forged service order has placed the reactor under a hostile lockout.'}
})
export function withStoryBattle(content){
 const battle=STORY_BATTLES[content.missionId];if(!battle||content.battle)return content
 const legacy=JSON.parse(JSON.stringify(content)),prerequisite=content.encounters.length?'clear-security':'align-2'
 return {...content,battle,legacyBattleContent:legacy,anchors:{...content.anchors,'story-boss':battle.position},
  objectives:[...content.objectives.filter(o=>o.id!=='report'),{id:'defeat-story-boss',label:'Defeat '+battle.name,event:'boss-defeated',source:'combat',targetId:'story-boss',prerequisites:[prerequisite]},content.objectives.find(o=>o.id==='report')],
  encounters:[...content.encounters,{id:'story-boss',category:'boss',anchors:['story-boss'],prerequisites:content.encounters.length?['security']:[],objectivePrerequisites:[prerequisite],policy:{mode:'waves',maxActive:1},waves:[{id:'principal',enemies:[{id:content.missionId+'-boss',classId:'warden',anchorId:'story-boss'}]}]}]}
}
