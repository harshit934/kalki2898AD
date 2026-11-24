const routes={
 'mission-1':{goal:'Recover the relic guarded by the Warden.',steps:[['Get the job from Bujji',['accept-contract']],['Check the relay',['compare-relay']],['Defeat the guards','guards'],['Defeat the Warden',['defeat-warden']],['Pick up the relic',['recover-relic']]]},
 'mission-2':{goal:'Find the fake contract, stop its security and report back.',steps:[['Talk to the Market Archivist',['briefing']],['Talk to the Temple Attendant',['evidence']],['Activate relays: 2 → 1 → 3',['align-0','align-1','align-2']],['Defeat the guards and Contract Enforcer',['clear-security','defeat-story-boss']],['Report to the Ghat Signal Keeper',['report']]],order:[2,1,3]},
 'mission-3':{goal:'Fix the energy relays and stop the broken sentinel.',steps:[['Talk to the Terrace Guide',['briefing']],['Talk to the Trading Steward',['evidence']],['Activate relays: 1 → 3 → 2',['align-0','align-1','align-2']],['Defeat the Terrace Sentinel',['defeat-story-boss']],['Report to the Energy Custodian',['report']]],order:[1,3,2]},
 'mission-4':{goal:'Check the faulty machinery, stop the lockout and report back.',steps:[['Talk to the Research Liaison',['briefing']],['Talk to the Shift Marshal',['evidence']],['Activate consoles: 3 → 1 → 2',['align-0','align-1','align-2']],['Defeat the guards and Reactor Lockout Construct',['clear-security','defeat-story-boss']],['Report to the Reactor Technician',['report']]],order:[3,1,2]}
}
export function missionGuide(session,objectives=[]){
 const route=routes[session?.missionId];if(!route)return null
 const done=new Set(session.completedObjectiveIds??[]),required=objectives.filter(o=>o.required!==false)
 const steps=route.steps.map(([label,ids])=>{const present=required.filter(o=>ids==='guards'?o.id.startsWith('clear-'):ids.includes(o.id));return {label,done:present.length>0&&present.every(o=>done.has(o.id))}})
 const active=required.find(o=>session.objectiveStates?.[o.id]==='active'&&!done.has(o.id)),step=steps.find(s=>!s.done)
 let next=step?.label??'Finish the mission report.'
 if(active?.id.startsWith('align-')&&route.order){const index=Number(active.id.split('-')[1]);next=`Go to ${session.missionId==='mission-4'?'console':'relay'} ${route.order[index]} and press E.`}
 else if(active?.id==='clear-security'||active?.id.startsWith('clear-'))next='Defeat the marked security guards.'
 else if(active?.id==='defeat-story-boss')next=route.steps[3][0].replace('the guards and ','')+'.'
 const hint=active?.event==='boss-defeated'||active?.event==='encounter-defeated'?'J / K attack · F block · Q dodge · R special':active?.event==='story-event'?'Walk close, press E, then choose the mission dialogue.':'Walk close to the marked object and press E.'
 return {goal:route.goal,steps,next,hint}
}
