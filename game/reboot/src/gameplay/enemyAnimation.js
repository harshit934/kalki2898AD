// Select only authored clips. An unavailable combat clip is explicit metadata,
// never a fabricated animation or a combat/death outcome.
const aliases={attack:['Attack','Melee Attack','Sword slash','Shoot'],block:['Block','Sword block'],hit:['Hit','Hit Reaction','Damage'],death:['Death','Die','Death (fall backward)']}
export function selectEnemyAnimation(names,state){
 const available=new Set(names),intent=state.health<=0?'death':state.hit?'hit':state.guarding?'block':state.attack&&state.attack.phase!=='idle'?'attack':state.motion>2.5?'Run':state.motion>.15?'Walk':'Idle'
 const desired=aliases[intent]??[intent],name=desired.find(n=>available.has(n))??['Idle','Walk','Run'].find(n=>available.has(n))
 return {name,requested:intent,supported:desired.some(n=>available.has(n)),missingCombatClips:Object.keys(aliases).filter(k=>!aliases[k].some(n=>available.has(n)))}
}
