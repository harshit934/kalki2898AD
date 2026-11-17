import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { Suspense, use, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { AnimationMixer, CanvasTexture, DataTexture, RGBAFormat, RepeatWrapping, SRGBColorSpace } from 'three'
import { loadCityCore, loadCityDetail, loadCityCitizens } from './cityAssets.js'
import { useGameplayState } from '../gameplayStore.js'
import { isGameTimeHeld } from '../gameClock.js'

function CityMesh({asset,name}){
 const maps=useTexture(['/environment/kashi/stone-color.jpg','/environment/kashi/stone-normal.jpg','/environment/kashi/stone-roughness.jpg'])
 const ready=useMemo(()=>{const scene=asset.scene.clone(true),materials=new Map(),ownedMaps=maps.map(m=>m.clone());ownedMaps.forEach(t=>{t.wrapS=t.wrapT=RepeatWrapping;t.flipY=false;t.anisotropy=4});ownedMaps[0].colorSpace=SRGBColorSpace
 scene.traverse(o=>{if(!o.isMesh)return;o.castShadow=!o.name.includes('hologram');o.receiveShadow=true;const src=o.material;if(!materials.has(src)){const m=src.clone();if(/sandstone|plaster|basalt/.test(m.name)){m.map=ownedMaps[0];m.normalMap=ownedMaps[1];m.roughnessMap=ownedMaps[2];m.normalScale.set(.22,.22)}materials.set(src,m)}o.material=materials.get(src)});return {scene,materials,ownedMaps}},[asset,maps])
 useEffect(()=>()=>{ready.materials.forEach(m=>m.dispose());ready.ownedMaps.forEach(t=>t.dispose())},[ready])
 return <primitive object={ready.scene} name={name}/>
}
function Detail({name}){const asset=use(loadCityDetail(name));return <CityMesh asset={asset} name={'54e-'+name}/>}
function Citizen({prepared,position,phase,preview}){
 const actor=useMemo(()=>{const root=clone(prepared.asset.scene),scale=1.72/prepared.size.y;root.scale.setScalar(scale);root.position.set(-prepared.center.x*scale,-prepared.minY*scale,-prepared.center.z*scale);const mixer=new AnimationMixer(root);return {root,mixer}},[prepared])
 useEffect(()=>{const clip=prepared.asset.animations.find(c=>c.name==='Idle');if(!clip)return;const action=actor.mixer.clipAction(clip);action.play();action.time=phase;return()=>{actor.mixer.stopAllAction();actor.mixer.uncacheRoot(actor.root)}},[actor,prepared,phase])
 useFrame((_,delta)=>{if(preview||!isGameTimeHeld())actor.mixer.update(Math.min(delta,.05)*.7)})
 return <group position={position} rotation={[0,-.6+phase,0]} name="54e-licensed-civilian"><primitive object={actor.root}/></group>
}
function Citizens({preview}){const people=use(loadCityCitizens());return <group name="54e-citizens-ready">{[[9.5,-.22,-8],[9,-.22,-34],[-10,-.22,8],[-10,-.22,-26]].map((p,i)=><Citizen key={i} prepared={people[i%2]} position={p} phase={i*.75} preview={preview}/>)}</group>}
function StreetSigns(){
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=192;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#152a27';ctx.fillRect(0,0,192,512);ctx.strokeStyle='#b8985a';ctx.lineWidth=8;ctx.strokeRect(5,5,182,502);ctx.textAlign='center';ctx.fillStyle='#76c8b6';ctx.font='bold 30px Segoe UI';['KASHI','TRANSIT','08','WATER','UNITS'].forEach((line,i)=>ctx.fillText(line,96,65+i*92));const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;return t},[])
 useEffect(()=>()=>texture.dispose(),[texture])
 return <group>{[[9,5,-13],[-10,4.5,-29],[10,6,-47]].map((p,i)=><mesh key={i} position={p} rotation={[0,i===1?.25:-.15,0]}><planeGeometry args={[1.1,3.2]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>)}</group>
}
function EnvironmentalActivity({preview}){
 const vehicle=useRef(null),holo=useRef(null),water=useRef(null)
 const waterNormal=useMemo(()=>{const size=64,data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4;data.set([128+Math.round(9*Math.sin(x/size*Math.PI*8+y/size*Math.PI*4)),128+Math.round(13*Math.cos(y/size*Math.PI*12)),252,255],i)}const texture=new DataTexture(data,size,size,RGBAFormat);texture.wrapS=texture.wrapT=RepeatWrapping;texture.repeat.set(20,40);texture.needsUpdate=true;return texture},[])
 useEffect(()=>()=>waterNormal.dispose(),[waterNormal])
 useFrame((state,dt)=>{if(!preview&&isGameTimeHeld())return;const t=state.clock.elapsedTime;if(vehicle.current){vehicle.current.position.z=20-((t*1.8)%120);vehicle.current.position.y=9+Math.sin(t*.6)*.12}if(holo.current)holo.current.rotation.y=Math.sin(t*.24)*.035;if(water.current?.material.normalMap)water.current.material.normalMap.offset.y+=Math.min(dt,.05)*.012})
 return <>
 <mesh ref={water} rotation={[-Math.PI/2,0,0]} position={[-77,-1.85,-35]} receiveShadow><planeGeometry args={[112,240,1,1]}/><meshStandardMaterial color="#3d6e68" normalMap={waterNormal} metalness={.24} roughness={.32}/></mesh>
 <group ref={vehicle} position={[24,9,20]} name="54e-electric-cargo-transit"><mesh castShadow><boxGeometry args={[2.3,.65,4.5,2,2,2]}/><meshStandardMaterial color="#706f5b" metalness={.7} roughness={.38}/></mesh><mesh position={[0,.65,-.35]}><capsuleGeometry args={[.65,1,6,16]}/><meshStandardMaterial color="#75a99e" metalness={.65} roughness={.25}/></mesh>{[-1,1].map(side=><mesh key={side} position={[side*1.15,-.2,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.18,.18,4,12]}/><meshStandardMaterial color="#bfa773" metalness={.7} roughness={.4}/></mesh>)}</group>
 <group ref={holo} position={[11,5,-15]} rotation={[0,-Math.PI/2,0]} name="54e-transit-hologram"><mesh><planeGeometry args={[3,2]}/><meshBasicMaterial color="#4fae9e" transparent opacity={.22} depthWrite={false}/></mesh>{[0,1,2].map(i=><mesh key={i} position={[0,.55-i*.45,.015]}><planeGeometry args={[i===0?2.4:1.5,.09]}/><meshBasicMaterial color="#9cdbc4" transparent opacity={.75} depthWrite={false}/></mesh>)}<mesh position={[-1,.05,.03]}><torusGeometry args={[.28,.035,6,24]}/><meshBasicMaterial color="#e1c07c"/></mesh></group>
 </>
}
export default function FirstCityEnvironment({preview=false}){
 const asset=use(loadCityCore()),camera=useThree(s=>s.camera),roundId=useGameplayState(s=>s.roundId),sent=useRef(false)
 const [near,setNear]=useState(()=>preview?['north-detail','market-detail']:['north-detail']),lastCheck=useRef(0)
 useEffect(()=>{sent.current=false},[roundId])
 useFrame((state)=>{if(state.clock.elapsedTime-lastCheck.current<.5)return;lastCheck.current=state.clock.elapsedTime;const z=camera.position.z;const next=[['north-detail',12],['market-detail',-32],['temple-detail',-80]].filter(([,center])=>Math.abs(z-center)<50).map(([n])=>n);setNear(old=>old.join()===next.join()?old:next)})
 useFrame(({gl,scene})=>{if(preview||sent.current||!scene.getObjectByName('54e-north-detail')||!scene.getObjectByName('54e-citizens-ready')||!scene.getObjectByName('player')||scene.getObjectByName('player-procedural-loading-fallback')||!gl.info.render.calls)return;sent.current=true;queueMicrotask(()=>window.dispatchEvent(new CustomEvent('kashi-revision-frame-ready',{detail:{roundId}})))},preview?0:2)
 return <group name="phase54e-kashi-city" userData={{optIn:true,composition:'contiguous ghats / market street / temples / service terraces'}}><CityMesh asset={asset} name="54e-city-core"/>{near.map(name=><Suspense key={name} fallback={null}><Detail name={name}/></Suspense>)}<EnvironmentalActivity preview={preview}/><StreetSigns/><Suspense fallback={null}><Citizens preview={preview}/></Suspense></group>
}
export function CityCollisions(){return <RigidBody type="fixed" colliders={false} name="54e-city-collisions">
 {Array.from({length:4},(_,row)=>Array.from({length:8},(_,i)=>{const x=15+row*12+(i%2)*1.2,z=22-i*16+row*2.6,w=6.5+(i%3)*.8,d=10+(row%2),h=8+row*4+(i*7%5)*1.3;return <CuboidCollider key={`${row}-${i}`} args={[w/2,h/2,d/2]} position={[x,h/2-.22,z]}/>}))}
 {Array.from({length:14},(_,i)=><CuboidCollider key={'ghat-'+i} args={[.325,.09,63.5]} position={[-13-i*.58,-.25-i*.115,-32]}/>)}
 {[12,-20,-52].flatMap(z=>Array.from({length:9},(_,i)=><CuboidCollider key={`${z}/${i}`} args={[.5,.075,2.6]} position={[-8.5-i*.9,-.2-i*.13,z]}/>))}
 <CuboidCollider args={[.2,1,70]} position={[-21,-.6,-32]}/><CuboidCollider args={[6,4.5,3.5]} position={[0,4.28,-91]}/>
 </RigidBody>}
