import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { useCompanionState } from './companionSystem.js'
import { useMissionOneStory } from './missionOneStory.js'
import { gameNow } from './gameClock.js'

function advanceOptics(materials,active,blink){for(const m of materials)if(/Teal/.test(m.name)){m.emissive.set(active?'#69baa4':'#1c655e');m.emissiveIntensity=blink ? .05 : active ? .9 : .32}}

export default function MissionOneBujji() {
  const {scene}=useGLTF('/environment/mission1/bujji-field-scout-v1.glb','/environment/kashi/draco/')
  const model=useMemo(()=>{const copy=scene.clone(true),materials=[];copy.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;o.material=o.material.clone();materials.push(o.material)}});return{copy,materials}},[scene])
  useEffect(()=>()=>model.materials.forEach(m=>m.dispose()),[model])
  useGameplayFrame(()=>{const now=gameNow(),active=useCompanionState.getState().status==='assisting'||now-useMissionOneStory.getState().scanAt<900;advanceOptics(model.materials,active,now%4300>4170)})
  return <primitive object={model.copy} dispose={null} />
}
