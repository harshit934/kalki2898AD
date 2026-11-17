import { useEffect, useRef } from 'react'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { extend } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { CapsuleCollider, CuboidCollider, RigidBody } from '@react-three/rapier'
import { MathUtils } from 'three'
import { useGameplayFrame } from '../cinematics/useGameplayFrame.js'
import { getEnemySpawns, useCombatState } from '../combatSystem.js'
import { getPlayerWorldPosition, useGameplayState } from '../gameplayStore.js'
import { bossRuntime, useBossState, BOSS_ARENA } from '../bossSystem.js'
import { EXPANSION_MISSIONS } from '../missionExpansionContent.js'
import { scheduleMaterialWarmup } from '../shaderWarmup.js'
import { createArcRuntime, stepArcRuntime, hazardVisualPose } from './arcBosses.js'

extend({RoundedBoxGeometry})

function Plate({position,scale=[1,1,1],color='#8d7459',rotation=[0,0,0]}){return <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow><roundedBoxGeometry args={[1,1,1,2,.06]} /><meshStandardMaterial color={color} metalness={.62} roughness={.48}/></mesh>}
function Ring({position=[0,0,0],r=1,color,rotation=[0,0,0],tube=.065}){return <mesh position={position} rotation={rotation} castShadow><torusGeometry args={[r,tube,8,32]}/><meshStandardMaterial color={color} metalness={.75} roughness={.28}/></mesh>}
export function ArcBossModel({profile,modelRef,weaponRef}){
 const {form,color}=profile,wide=['bastion','siege','drum'].includes(form),width=wide?1.45:1
 return <group ref={modelRef} name={`arc-boss-${profile.mission}-${form}`}>
  <Plate position={[0,2,0]} scale={[width*1.4,1.55,.8]} />
  <Plate position={[0,2.65,-.48]} scale={[width*1.12,.2,.22]} color={color}/>
  <Plate position={[0,1.5,-.46]} scale={[width*.9,.28,.18]} color="#4d524d"/>
  <mesh position={[0,3.2,0]} castShadow><latheGeometry args={[[{x:0,y:0},{x:.42,y:.04},{x:.45,y:.35},{x:.28,y:.65},{x:.08,y:.9}].map(p=>({x:p.x,y:p.y})),16]}/><meshStandardMaterial color="#ae8e66" metalness={.68} roughness={.35}/></mesh>
  <Plate position={[0,3.5,-.36]} scale={[.47,.09,.12]} color={color}/>
  <Ring position={[0,2.1,-.47]} r={.35} color={color}/>
  {[-1,1].map(side=><group key={side}>
   <Plate position={[side*width*.95,2.6,0]} scale={[.7,.52,.88]} color="#b89a70" rotation={[0,0,side*.14]}/>
   <mesh position={[side*width*1.15,1.7,0]} castShadow><capsuleGeometry args={[.18,.95,6,12]}/><meshStandardMaterial color="#454e48" metalness={.68} roughness={.5}/></mesh>
   <Plate position={[side*.43,.73,0]} scale={[.46,1.2,.55]} color="#53584f"/>
   <Plate position={[side*.43,.18,-.18]} scale={[.65,.28,.85]} color="#8c785d"/>
   {[0,1,2].map(i=><Plate key={i} position={[side*width*.85,2.7+i*.14,-.43]} scale={[.4,.045,.08]} color={color}/>)}
  </group>)}
  <group ref={weaponRef}>
   {form==='shield'&&<><Plate position={[-1.55,1.9,-.4]} scale={[1.1,2.1,.25]} color="#a58958"/><Ring position={[-1.55,1.9,-.55]} r={.4} color={color}/><Plate position={[1.5,1.4,0]} scale={[.15,2.6,.15]}/><Plate position={[1.5,2.65,0]} scale={[1.2,.55,.65]}/></>}
   {form==='chain'&&Array.from({length:9},(_,i)=><Ring key={i} position={[1.5+Math.sin(i*.5)*.2,2.5-i*.24,0]} r={.16} tube={.045} rotation={[0,i%2*Math.PI/2,0]} color={color}/>)}
   {form==='sun'&&<><Ring position={[0,3.5,.3]} r={1.15} color={color}/>{Array.from({length:12},(_,i)=><Plate key={i} position={[Math.sin(i*Math.PI/6)*1.4,3.5+Math.cos(i*Math.PI/6)*1.4,.3]} scale={[.1,.35,.12]} rotation={[0,0,-i*Math.PI/6]} color={color}/>)}</>}
   {form==='swords'&&[-1,1].map(side=><Plate key={side} position={[side*1.6,1.65,-.4]} scale={[.14,2.5,.28]} rotation={[0,0,side*.3]} color={color}/>)}
   {form==='drum'&&[-1,1].map(side=><group key={side} position={[side*1.7,2.3,0]}><mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.65,.65,.8,24]}/><meshStandardMaterial color="#665f4e" metalness={.5} roughness={.4}/></mesh><Ring position={[0,0,-.42]} r={.62} color={color}/></group>)}
   {form==='ring'&&<><Ring position={[1.7,2.1,0]} r={.85} color={color}/><Plate position={[-1.25,2,-.4]} scale={[.2,1.5,.55]} color={color}/></>}
   {form==='scales'&&<><Plate position={[0,4.4,0]} scale={[2.7,.12,.18]} color={color}/>{[-1,1].map(side=><group key={side}><Plate position={[side*1.25,3.9,0]} scale={[.05,1,.05]}/><mesh position={[side*1.25,3.4,0]} castShadow><sphereGeometry args={[.45,16,8,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color={color} metalness={.7} roughness={.35}/></mesh></group>)}</>}
   {form==='bastion'&&<><Plate position={[0,2.25,-.75]} scale={[2.5,1.8,.55]} color="#8d8269"/>{[-1,0,1].map(i=><Plate key={i} position={[i*.75,2.2,-1.1]} scale={[.18,1.3,.15]} color={color}/>)}<Plate position={[0,3.7,0]} scale={[1.6,.45,.9]}/></>}
   {form==='siege'&&<>{[-1,1].map(side=><group key={side} position={[side*1.5,3.2,.2]}><mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.28,.4,1.8,16]}/><meshStandardMaterial color="#6b6e61" metalness={.72} roughness={.4}/></mesh><Ring position={[0,0,-.9]} r={.28} color={color}/></group>)}<Ring position={[0,3.7,.5]} r={.8} color={color}/></>}
   {form==='lotus'&&Array.from({length:8},(_,i)=><group key={i} position={[Math.sin(i*Math.PI/4)*1.4,2.7+Math.cos(i*Math.PI/4)*1.4,.5]} rotation={[0,0,-i*Math.PI/4]}><mesh scale={[.23,.75,.13]} castShadow><sphereGeometry args={[1,12,12]}/><meshStandardMaterial color={color} metalness={.65} roughness={.32}/></mesh></group>)}
  </group>
 </group>
}
export default function ArcBossFight({profile,relic}){
 const body=useRef(null),model=useRef(null),weapon=useRef(null),hazards=useRef([]),runtime=useRef(createArcRuntime(profile)),intro=useRef(0),defeat=useRef(null),lastAttack=useRef(null)
 const status=useBossState(s=>s.status),round=useBossState(s=>s.roundId),missionId=profile.id
 const gl=useThree(s=>s.gl),camera=useThree(s=>s.camera),scene=useThree(s=>s.scene)
 useEffect(()=>{bossRuntime.body=body.current;return()=>{if(bossRuntime.body===body.current)bossRuntime.body=null}},[])
 useEffect(()=>scheduleMaterialWarmup(gl,model.current,camera,scene,{ready:()=>Boolean(model.current)&&!scene.getObjectByName('player-procedural-loading-fallback')}),[gl,camera,scene,profile])
 useGameplayFrame((_,delta)=>{
  const state=runtime.current,boss=useBossState.getState(),player=getPlayerWorldPosition()
  if(boss.status==='dormant'){
   const objectives=EXPANSION_MISSIONS[missionId]?.objectives??[],done=objectives.every(o=>useGameplayState.getState().missionObjectiveIds.includes(o.id))&&getEnemySpawns(missionId).every(e=>useCombatState.getState().defeatedEnemyIds.includes(e.id))
   if(done&&player.z<=BOSS_ARENA.entranceZ)useBossState.getState().beginEncounter()
  }
  if(model.current){model.current.visible=boss.status!=='dormant';model.current.rotation.y=MathUtils.damp(model.current.rotation.y,Math.atan2(state.x-player.x,state.z-player.z),6,delta)}
  if(boss.status==='intro'){intro.current+=delta;if(intro.current>=2.2)useBossState.getState().beginFight()}
  for(const h of hazards.current)if(h)h.visible=false
  if(boss.status==='active'&&!useGameplayState.getState().gameOver){
   const result=stepArcRuntime(state,player,boss.phase,delta)
   body.current?.setNextKinematicTranslation({x:state.x,y:-.22,z:state.z});bossRuntime.position.x=state.x;bossRuntime.position.y=-.22;bossRuntime.position.z=state.z
   if(result.attack!==lastAttack.current||(result.attack&&!boss.attack)){lastAttack.current=result.attack;useBossState.getState().setAttack(result.attack?{...result.attack,type:result.attack.kind}:null)}
   if(result.damage)useGameplayState.getState().takeDamage(result.damage,`arc-${result.attack.kind}`)
   result.hazards.forEach((h,i)=>{const mesh=hazards.current[i];if(!mesh)return;mesh.visible=true;mesh.material.color.set(result.active?profile.color:'#ffd475');mesh.material.opacity=result.active?.7:.3
    const pose=hazardVisualPose(h);mesh.position.set(pose.x,.04,pose.z);mesh.rotation.set(-Math.PI/2,0,pose.rotation);mesh.scale.set(pose.scaleX,pose.scaleY,1)
    if(h.shape==='line')mesh.geometry=mesh.userData.line
    else{mesh.geometry=mesh.userData.ring;const position=mesh.geometry.attributes.position;for(let j=0;j<=48;j++){const angle=j/48*Math.PI*2;position.setXY(j,Math.cos(angle)*pose.innerRatio,Math.sin(angle)*pose.innerRatio)}position.needsUpdate=true}
   })
   if(weapon.current){weapon.current.rotation.x=result.active?Math.sin(state.time*8)*.18:0;weapon.current.rotation.z=profile.form==='sun'||profile.form==='lotus'?state.time*.25:Math.sin(state.time)*.035}
  }
  if(boss.status==='defeated'&&model.current){defeat.current??=state.time;state.time+=delta;const t=Math.min(1,(state.time-defeat.current)/1.9),form=profile.defeat
   const pose=model.current,tool=weapon.current
   switch(form){
    case 'kneel':pose.rotation.x=t*.7;pose.position.y=-t*.45;if(tool)tool.rotation.z=t*.35;break
    case 'unravel':pose.rotation.y+=t*.04;pose.position.y=-t*.25;if(tool){tool.rotation.z=t*3.2;tool.scale.y=1+t};break
    case 'eclipse':pose.rotation.x=t*.25;if(tool){tool.rotation.z=t*Math.PI*2;tool.scale.setScalar(1-t*.8)};break
    case 'shatter':pose.rotation.z=-t*.8;if(tool){tool.scale.setScalar(1+t*.9);tool.rotation.y=t*2};break
    case 'collapse':pose.rotation.x=t*Math.PI/2;pose.position.y=-t*.5;if(tool)tool.rotation.x=-t*1.4;break
    case 'skid':pose.rotation.x=-t*.8;pose.position.z=t*2.4;if(tool)tool.rotation.z=-t*2;break
    case 'bow':pose.rotation.x=t*.95;pose.position.y=-t*.2;if(tool)tool.rotation.z=-t*.5;break
    case 'buckle':pose.scale.y=1-t*.38;pose.position.y=-t*.5;if(tool)tool.rotation.x=t*1.2;break
    case 'disarm':pose.rotation.z=t*.35;if(tool){tool.rotation.x=t*3;tool.position.y=-t*1.5};break
    case 'lotus':pose.rotation.x=t*.15;if(tool){tool.rotation.z=t*Math.PI*2;tool.scale.setScalar(1+t*.7);tool.position.y=-t*.8};break
    default:throw Error('Unregistered defeat pose')
   }
  }
 })
 return <group name={`arc-final-${profile.mission}`} userData={{singleOpponent:true,profile:profile.name,round}}>
  <RigidBody ref={body} type="kinematicPosition" position={[0,-.22,-69]} colliders={false} enabledRotations={[false,false,false]} userData={{cameraActor:true}}><CapsuleCollider args={[1.1,1.05]} position={[0,1.85,0]} sensor={status==='dormant'||status==='defeated'} collisionGroups={0x00040001}/><ArcBossModel profile={profile} modelRef={model} weaponRef={weapon}/></RigidBody>
  <RigidBody type="fixed" colliders={false}>{[-9.2,9.2].map(x=><CuboidCollider key={x} args={[.3,2,10]} position={[x,1.8,-68]}/>)}<CuboidCollider args={[9.5,2,.3]} position={[0,1.8,-78]}/></RigidBody>
  {Array.from({length:12},(_,i)=><HazardMesh key={i} meshRef={el=>{hazards.current[i]=el}}/>)}
  {status==='defeated'&&relic}
 </group>
}
function HazardMesh({meshRef}){
 const line=useRef(null),ring=useRef(null),mesh=useRef(null)
 useEffect(()=>{mesh.current.userData.line=line.current;mesh.current.userData.ring=ring.current;meshRef(mesh.current);return()=>meshRef(null)},[meshRef])
 return <group><planeGeometry ref={line} args={[1,1]}/><ringGeometry ref={ring} args={[0,1,48]}/><mesh ref={mesh} visible={false}><planeGeometry args={[1,1]}/><meshBasicMaterial transparent opacity={.3} depthWrite={false} toneMapped={false}/></mesh></group>
}
