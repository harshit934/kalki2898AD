// Read-only guidance: never submits objective, combat or reward evidence.
export function mission1Guidance(content,session,position,targets={}){
 if(!position||![position.x,position.z].every(Number.isFinite))return null
 const done=new Set(session.completedObjectiveIds??[]),regular=(content.encounters??[]).filter(e=>e.category==='regular'),states=new Map((session.encounterStates??[]).map(e=>[e.id,e.state])),cleared=new Set(session.defeatedEncounterIds??[])
 const bearing=(title,detail,at)=>{if(!Array.isArray(at)||!at.every(Number.isFinite))return {title,detail,distance:null};const dx=at[0]-position.x,dz=at[2]-position.z,d=Math.hypot(dx,dz);return {title,detail,distance:Math.round(d),direction:d<2?'nearby':[dz<-.75?'north':dz>.75?'south':'',dx<-.75?'west':dx>.75?'east':''].filter(Boolean).join('-')}}
 const tasks=['accept-contract','compare-relay','crystal-01','crystal-02','crystal-03'],missing=tasks.filter(id=>!done.has(id)&&content.objectives?.find(o=>o.id===id)?.required!==false)
 if(missing.length){const id=missing[0],crystal=id.startsWith('crystal-'),title=id==='accept-contract'?'Speak to Bujji':id==='compare-relay'?'Inspect the salvage relay':`Collect salvage crystals (${tasks.filter(t=>t.startsWith('crystal-')&&done.has(t)).length}/3)`;return bearing(title,crystal?'Walk close to the crystal to collect it automatically.':'Approach and press E. Required before the Warden encounter.',targets[id]??content.anchors?.[id])}
 const remaining=regular.filter(e=>states.get(e.id)!=='completed'&&!cleared.has(e.id))
 if(remaining.length)return bearing('Defeat the stronghold guards',`${regular.length-remaining.length}/${regular.length} regular enemies defeated. Clear all four waves.`,content.stronghold?.entry)
 const boss=content.encounters?.find(e=>e.id==='warden'),bossState=states.get('warden')
 if(!done.has('defeat-warden')){
  const at=content.anchors?.[boss?.anchors?.[0]],entry=at?[at[0],at[1],at[2]+10]:null
  return bearing('Final boss: Arena Warden',bossState==='active'||bossState==='completed'?'Defeat the Warden; watch the boss health bar.':'All guards cleared. Enter the arena near the stepped tower.',bossState==='active'?at:entry)
 }
 if(!done.has('recover-relic'))return bearing('Recover the Warden relic','Approach the golden relic and press E to finish the mission.',targets['recover-relic']??content.anchors?.['warden-relic'])
 return {title:'Mission objectives complete',detail:'Finalising verified victory and rewards.',distance:null}
}
