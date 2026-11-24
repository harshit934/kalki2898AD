// Stronghold-only difficulty templates from the existing first two waves.
// Actor identity, archetype, placement, patrol and Warden remain unchanged.
export function earlyWaveOpponent(source,roster){
 const index=roster.findIndex(actor=>actor.id===source.id)
 if(index<6)return source
 const template=roster[[5,3,4,0,2][index-6]]
 if(!template)return source
 return {...source,stats:{...template.stats}}
}
