export const ENERGY_WEAPONS=Object.freeze({
  pistol:Object.freeze({id:'pistol',name:'Energy pistol',mission:5,damage:24,enemyDamage:10,range:22,speed:24,interval:480,magazine:8,reserve:24,reload:1100,color:'#86e6df',radius:.09}),
  rifle:Object.freeze({id:'rifle',name:'Energy rifle',mission:10,damage:16,enemyDamage:8,range:34,speed:32,interval:190,magazine:18,reserve:54,reload:1650,color:'#e6b46b',radius:.07}),
  cannon:Object.freeze({id:'cannon',name:'Heavy energy cannon',mission:20,damage:72,enemyDamage:24,range:28,speed:13,interval:1500,magazine:2,reserve:6,reload:2500,color:'#c5a4e8',radius:.2}),
  bow:Object.freeze({id:'bow',name:'Energy bow',mission:30,damage:44,enemyDamage:16,range:40,speed:28,interval:950,magazine:5,reserve:15,reload:1450,color:'#a8cfeb',radius:.08}),
})
export const WEAPON_ENHANCEMENTS=Object.freeze([
  {id:'karna',mission:50,name:'Karna weapon enhancement',scale:1.12,storyReady:false,reason:'Requires the authored first awakening/Manas mission, not the Monsoon Drummer prototype.'},
  {id:'kalki',mission:70,name:'Advanced Kalki weapon enhancement',scale:1.1,storyReady:false,reason:'Requires the authored Kalki/Horizon Keeper mission, not the Bronze Adjudicator prototype.'},
  {id:'final',mission:100,name:'Final weapon upgrade',scale:1.1,storyReady:false,reason:'Requires the authored final Kalki battle, not the older Horizon Keeper prototype.'},
])
export function deriveWeaponProgress(completed,previous={}){
  const done=new Set(Array.isArray(completed)?completed:[])
  return {...(previous&&typeof previous==='object'&&!Array.isArray(previous)?previous:{}),version:1,
    unlockedWeaponIds:Object.values(ENERGY_WEAPONS).filter(w=>done.has(`mission-${w.mission}`)).map(w=>w.id),
    enhancements:WEAPON_ENHANCEMENTS.filter(e=>e.storyReady&&done.has(`mission-${e.mission}`)).map(e=>e.id)}
}
export function weaponDamageScale(progress){return WEAPON_ENHANCEMENTS.filter(e=>e.storyReady&&progress?.enhancements?.includes(e.id)).reduce((scale,e)=>scale*e.scale,1)}
export function enemyWeaponId(id){const suffix=Number(/(\d+)$/.exec(id)?.[1]);const index=Number.isFinite(suffix)?Math.floor(suffix/4)%4:Array.from(id).reduce((n,c)=>n+c.charCodeAt(0),0)%4;return ['pistol','rifle','cannon','bow'][index]}
export function createMagazine(id){const w=ENERGY_WEAPONS[id];return {rounds:w.magazine,reserve:w.reserve,readyAt:0,reloadUntil:0}}
export function finishReload(ammo,id,now){
  if(!ammo.reloadUntil||now<ammo.reloadUntil)return false
  const transfer=Math.min(ENERGY_WEAPONS[id].magazine-ammo.rounds,ammo.reserve)
  ammo.rounds+=transfer;ammo.reserve-=transfer;ammo.reloadUntil=0;return true
}
export function beginReload(ammo,id,now){
  finishReload(ammo,id,now)
  if(ammo.reloadUntil||ammo.rounds>=ENERGY_WEAPONS[id].magazine||ammo.reserve<=0)return false
  ammo.reloadUntil=now+ENERGY_WEAPONS[id].reload;return true
}
export function consumeShot(ammo,id,now){
  finishReload(ammo,id,now)
  if(ammo.reloadUntil||ammo.rounds<=0||now<ammo.readyAt)return false
  ammo.rounds--;ammo.readyAt=now+ENERGY_WEAPONS[id].interval;return true
}
// Swept 3-D contact; the closest wall always wins over a target behind cover.
export function stepEnergyBolt(p,delta,targets,wallDistance=Infinity){
  const distance=Math.min(p.remaining,p.speed*Math.min(.05,Math.max(0,delta)))
  let nearest=null,contact=Infinity
  for(const target of targets){
    const x=target.x-p.x,y=target.y-p.y,z=target.z-p.z,along=x*p.dx+y*p.dy+z*p.dz
    const radius=target.radius+(p.radius??.08),perpendicular=x*x+y*y+z*z-along*along
    if(perpendicular>radius*radius||along+radius<0)continue
    const at=Math.max(0,along-Math.sqrt(Math.max(0,radius*radius-perpendicular)))
    if(at<=distance&&at<contact){contact=at;nearest=target.id}
  }
  const blocked=wallDistance<=distance&&wallDistance<=contact,travel=blocked?wallDistance:nearest?contact:distance
  p.x+=p.dx*travel;p.y+=p.dy*travel;p.z+=p.dz*travel;p.remaining-=travel
  return blocked?{kind:'blocked'}:nearest?{kind:'hit',id:nearest}:p.remaining<=.001?{kind:'expired'}:{kind:'flying'}
}
