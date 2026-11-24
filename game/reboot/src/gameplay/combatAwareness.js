// Read-only bearing, not a navigation route or encounter activation authority.
// Reuses authored encounter anchors; never moves or deploys any actor.
export function nearestEncounterHint(content,session,position){
 if(!position||![position.x,position.z].every(Number.isFinite))return null
 const completed=new Set(session.defeatedEncounterIds??[])
 for(const e of session.encounterStates??[])if(e.state==='completed')completed.add(e.id)
 if(content.stronghold){
  const index=content.stronghold.waves.findIndex(w=>w.members.some(m=>!completed.has(m.encounterId)))
  if(index<0)return null
  const at=content.stronghold.entry,dx=at[0]-position.x,dz=at[2]-position.z,distance=Math.hypot(dx,dz)
  return {id:content.stronghold.label+' · wave '+(index+1)+'/4',distance:Math.round(distance),direction:distance<2?'nearby':[dz<-.75?'north':dz>.75?'south':'',dx<-.75?'west':dx>.75?'east':''].filter(Boolean).join('-')}
 }
 const candidates=(content.encounters??[]).filter(e=>e.category==='regular'&&!completed.has(e.id)).map(e=>{
  const at=content.anchors?.[e.anchors?.[0]]
  if(!Array.isArray(at)||at.length!==3||!at.every(Number.isFinite))return null
  const dx=at[0]-position.x,dz=at[2]-position.z,distance=Math.hypot(dx,dz)
  const direction=distance<2?'nearby':[dz<-.75?'north':dz>.75?'south':'',dx<-.75?'west':dx>.75?'east':''].filter(Boolean).join('-')
  return {id:e.id,distance,direction}
 }).filter(Boolean)
 candidates.sort((a,b)=>a.distance-b.distance||a.id.localeCompare(b.id))
 return candidates[0]?{...candidates[0],distance:Math.round(candidates[0].distance)}:null
}
