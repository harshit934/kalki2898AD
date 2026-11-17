import { Suspense, useEffect, useRef } from 'react'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import MissionOneProp from './MissionOneProp.jsx'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { useGameplayState, getPlayerWorldPosition } from './gameplayStore.js'
import { useBossState } from './bossSystem.js'
import { useCinematic, startCinematic } from './cinematics/controller.js'
import { missionOneEnding } from './cinematics/missionOneEnding.js'
import { KASHI_RELAYS, useMissionOneStory } from './missionOneStory.js'

export default function MissionOneRelays(){
  const round=useGameplayState(s=>s.roundId),bossRound=useBossState(s=>s.roundId)
  const ready=useBossState(s=>s.victoryReady&&s.relicCollected&&!s.victoryDismissed)
  const phase=useCinematic(s=>s.phase),started=useRef(-1),scanned=useMissionOneStory(s=>s.scanned)
  useEffect(()=>{useMissionOneStory.getState().reset();started.current=-1},[round])
  useEffect(()=>{
    if(!ready||phase!=='idle'||started.current===bossRound||useMissionOneStory.getState().endingRound===bossRound)return
    if(startCinematic(missionOneEnding,getPlayerWorldPosition(),()=>useMissionOneStory.setState({endingRound:bossRound})))started.current=bossRound
  },[ready,phase,bossRound])
  useGameplayFrame(()=>{
    const p=getPlayerWorldPosition(),story=useMissionOneStory.getState()
    const relay=KASHI_RELAYS.find(r=>!story.scanned.includes(r.id)&&Math.hypot(p.x-r.position[0],p.z-r.position[2])<=2.6)
    story.setNearby(relay?.id??null)
  })
  useEffect(()=>{
    const key=e=>{if(e.code==='KeyR'&&!e.repeat&&!/INPUT|SELECT|TEXTAREA/.test(e.target?.tagName)){const s=useMissionOneStory.getState();if(s.nearby&&s.scan(s.nearby))e.preventDefault()}}
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)
  },[])
  return <group name="mission1-bujji-field-relays">{KASHI_RELAYS.map(relay=><group key={relay.id} position={relay.position}>
    <Suspense fallback={null}><MissionOneProp name="field-relay" /></Suspense>
    <RigidBody type="fixed" colliders={false}><CuboidCollider position={[0,.4,0]} args={[.26,.4,.26]} /></RigidBody>
    <mesh position={[0,.90,.07]} rotation={[-Math.PI/2+.3,0,0]}><planeGeometry args={[.29,.18]} /><meshStandardMaterial color={scanned.includes(relay.id)?'#8bc29e':'#e8ba72'} emissive={scanned.includes(relay.id)?'#356346':'#a85c27'} emissiveIntensity={.5} /></mesh>
  </group>)}</group>
}
