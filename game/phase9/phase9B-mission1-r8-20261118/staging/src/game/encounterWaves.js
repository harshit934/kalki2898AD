// Shared campaign budget. Configuration does not make a planned mission playable.
export function campaignEnemyCount(mission) {
  const n=typeof mission==='number'?mission:Number(/^mission-(\d+)$/.exec(mission)?.[1])
  return Number.isInteger(n)&&n>=1&&n<=100?11+((n-1)%10):0
}
export const ENEMY_TOTALS=Object.freeze(Object.fromEntries(Array.from({length:100},(_,i)=>[`mission-${i+1}`,campaignEnemyCount(i+1)])))
export const WAVE_SIZE=3
export const WAVE_RECOVERY_MS=1400
const openingRoles=[['scout','warrior','heavy'],['glassStalker','warrior','glassBrute'],['warrior','scout','heavy'],['warrior','ranged','heavy'],['elite','ranged','heavy','glassStalker']]
export function encounterRoster(id,original) {
  const total=campaignEnemyCount(id)
  if(!total)return original
  const n=Number(id.split('-')[1])
  // Repeat the authored composition when available; retain original identities.
  const palette=original.length?original.map(e=>e.type):openingRoles[Math.min(4,n-1)]
  return Object.freeze(Array.from({length:total},(_,index)=>{
    const old=original[index],group=Math.floor(index/WAVE_SIZE),lane=index%WAVE_SIZE
    const position=old&&index<3?old.position:[(lane-1)*3.5,-.22,-Math.min(55,32+(group-1)*5+lane)]
    return Object.freeze({id:old?.id??`${id}-reinforcement-${index+1}`,type:old?.type??palette[index%palette.length],position,phase:old?.phase??index*1.4})
  }))
}
export function waveSpawns(id,roster,index){return campaignEnemyCount(id)?roster.slice(index*WAVE_SIZE,(index+1)*WAVE_SIZE):roster}
export function waveCount(id,roster){return campaignEnemyCount(id)?Math.ceil(roster.length/WAVE_SIZE):1}
