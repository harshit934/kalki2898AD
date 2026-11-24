import {requireCondition} from '../campaign/contracts.js'

export function storyBattlePhase(health,max){requireCondition(Number.isFinite(health)&&health>=0&&health<=max&&max>0,'INVALID_HEALTH','Bounded boss health required');return health/max>.66?1:health/max>.33?2:3}
export function createStoryBattleBrain({source,body,object,controller,player,canSee,attack,readHealth,signal}){
 const profile=source.bossProfile,bounds=profile.bounds
 let time=0,sequence=0,nextAt=1,warning=null,intent='introduction',phase=1,motion=0,recoveryUntil=0,previous=profile.health,dash=null
 return {tick(delta){
  requireCondition(!signal.aborted&&Number.isFinite(delta)&&delta>0&&delta<=.1,'INVALID_FRAME','Owned bounded battle frame required')
  const health=readHealth();if(health<=0){intent='defeated';warning=null;return}time+=delta;phase=storyBattlePhase(health,profile.health)
  const p=body.translation(),target=player(),dx=target.x-p.x,dz=target.z-p.z,distance=Math.hypot(dx,dz)||.001,visible=canSee(p,target),disabled=source.arenaState?.disabled===true
  if(previous-health>=70){recoveryUntil=Math.max(recoveryUntil,time+.35);if(warning&&warning.type!=='ring'&&warning.type!=='thermal')warning=null}previous=health
  if(!target.alive){warning=null;intent='idle';motion=0;return}
  if(!warning&&time>=nextAt&&time>=recoveryUntil){const pattern=profile.patterns[phase-1],type=pattern[sequence++%pattern.length];warning={type,phase,at:time*1000+(phase===3?850:1200),origin:{...p},target:{...target}}}
  intent=time<recoveryUntil?'recovery':warning?'windup':'pursuit'
  let vx=0,vz=0
  if(intent==='pursuit'&&distance>3){const speed=1.1+phase*.35;vx=dx/distance*speed;vz=dz/distance*speed}
  if(warning&&time*1000>=warning.at){const w=warning;warning=null;nextAt=time+(phase===3?1.5:2.2);recoveryUntil=time+.65
   const near=Math.hypot(target.x-w.origin.x,target.z-w.origin.z),grounded=target.y<=w.origin.y+.8
   if(w.type==='bolt'&&visible)attack({kind:'bolt',amount:9+phase*2,origin:w.origin,target:w.target,speed:7+phase})
   if(w.type==='sweep'&&near<=4&&visible)attack({kind:'melee',amount:10+phase*2,origin:w.origin})
   if(w.type==='charge'&&visible){const destination=w.target,x=destination.x-p.x,z=destination.z-p.z,d=Math.hypot(x,z)||1;dash={until:time+.45,x:x/d*(5+phase),z:z/d*(5+phase),hit:false}}
   if(!disabled&&grounded&&visible&&((w.type==='ring'&&near>=2&&near<=6.3)||(w.type==='thermal'&&Math.hypot(target.x-w.target.x,target.z-w.target.z)<=2)))attack({kind:w.type,amount:8+phase*3,origin:w.origin})
  }
  if(dash&&time<dash.until){intent='charge';vx=dash.x;vz=dash.z;if(!dash.hit&&distance<=3.5&&visible){dash.hit=true;attack({kind:'melee',amount:11+phase*2,origin:{...p}})}}else dash=null
  const collider=body.collider(0),desired={x:Math.max(bounds.minX,Math.min(bounds.maxX,p.x+vx*delta))-p.x,y:0,z:Math.max(bounds.minZ,Math.min(bounds.maxZ,p.z+vz*delta))-p.z}
  controller.computeColliderMovement(collider,desired,undefined,undefined,c=>c.handle!==collider.handle);const moved=controller.computedMovement();body.setNextKinematicTranslation({x:p.x+moved.x,y:p.y+moved.y,z:p.z+moved.z});motion=Math.hypot(moved.x,moved.z)/delta
  const angle=Math.atan2(-dx,-dz);object.rotation.y+=Math.atan2(Math.sin(angle-object.rotation.y),Math.cos(angle-object.rotation.y))*(1-Math.exp(-8*delta))
 },snapshot:()=>({intent,phase,time,attack:warning?{...warning}:null,motion,patrolMode:'combat'})}
}
