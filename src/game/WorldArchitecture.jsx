import{cityEnabled,firstCity}from'./phase54e/cityAssets.js'
import{arcBossFor}from'./phase54e/arcBosses.js'
import{CorrectedArena}from'./phase54e/CorrectedCity.jsx'
import { Suspense } from 'react'
import { Environment } from '@react-three/drei'
import KashiEnvironment from './KashiEnvironment.jsx'
import MissionOneDistrict from './MissionOneDistrict.jsx'

// Non-interactive streets beyond the mission corridor; collision and routes stay owned by World.
export default function WorldArchitecture({ missionId }) {
  const theme=missionId==='mission-2'||['mission-7','mission-8','mission-9','mission-10'].includes(missionId)?'complex':missionId==='mission-6'?'shambhala':'kashi'
  return <Suspense fallback={null}>
    <Environment files="/environment/kashi/sunset-lighting.hdr" environmentIntensity={.3} />
    {cityEnabled()&&!firstCity()&&arcBossFor(missionId)?<CorrectedArena missionId={missionId}/>:missionId==='mission-1' ? <MissionOneDistrict /> : [-25,-60,-95,-130].map((z,i)=><group key={z} position={[i%2?-23:23,-.22,z]} rotation={[0,i%2?Math.PI:0,0]} scale={.85}>
      <KashiEnvironment assetPath={`/environment/previews/${theme}-frontage.glb`} />
    </group>)}
  </Suspense>
}
