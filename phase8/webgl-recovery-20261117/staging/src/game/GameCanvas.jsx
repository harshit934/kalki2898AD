import{cityEnabled,firstCity,finalCity}from'./phase54e/cityAssets.js'
import{arcBossFor}from'./phase54e/arcBosses.js'
import { usePauseState } from './pauseSystem.js'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Physics } from '@react-three/rapier'
import CinematicStage from './cinematics/CinematicStage.jsx'
import { useCinematic } from './cinematics/controller.js'
import Player from './player/Player.jsx'
import World from './World.jsx'
import FrameMetrics from './FrameMetrics.jsx'
import PlayerSunlight from './PlayerSunlight.jsx'
import { useCampaignState } from './campaignSystem.js'
import MissionTwoSequence from './MissionTwoSequence.jsx'
import { useMissionTwoSequence } from './missionTwoSequence.js'
import { useVisualSettings } from './visualSettings.js'
import RenderCadence from './RenderCadence.jsx'
import { useGameplayState } from './gameplayStore.js'

function ContractReady({ onReady }) {
  const sent = useRef(false)
  // Run after RenderCadence: the real avatar must have rendered before the HUD
  // offers a contract. The procedural loading avatar has a different light set.
  useFrame(({ scene }) => {
    if (sent.current || !onReady || !scene.getObjectByName('player') ||
      scene.getObjectByName('player-procedural-loading-fallback')) return
    sent.current = true
    onReady(true)
  }, 2)
  return null
}

function PixelBudget({ quality }) {
  const size=useThree(s=>s.size), setDpr=useThree(s=>s.setDpr)
  // Preserve the mobile budget; desktop balanced quality renders native 1080p.
  const pixels = size.width < 900 ? 921600 : 2073600
  const maxDpr=quality==='performance'?.75:size.width<900?1:2
  useEffect(()=>{setDpr(Math.min(devicePixelRatio,maxDpr,Math.sqrt(pixels/Math.max(1,size.width*size.height))))},[size.width,size.height,setDpr,pixels,maxDpr])
  return null
}
function GameCanvas({ active = true, sequenceRunning = true, onContractReady }) {
  const quality = useVisualSettings(s=>s.quality)
  const cinematicPhase = useCinematic(state => state.phase)
  const cinematic = cinematicPhase !== 'idle'
  const sequence = useMissionTwoSequence(state => state.phase !== 'idle')
  const contractOrigin = useMissionTwoSequence(state => state.origin)
  const roundId = useGameplayState(state => state.roundId)
  const handingBack = useMissionTwoSequence(state => state.phase === 'handoff')
  const paused = usePauseState(s => s.paused)
  const playing = useCampaignState(s => s.isPlaying)
  const rendering = playing || cinematic || sequence
  const missionId = useCampaignState((state) => state.selectedMissionId)
  const params = new URLSearchParams(location.search)
  const profiling = params.get('frameMetrics') === '1'
  const shadows = !profiling || params.get('profileShadows') !== 'off'
  const burnParticles = !profiling || params.get('profileBurnParticles') !== 'off'
  const prismMission = missionId === 'mission-2'
  const salvageMission = missionId === 'mission-4'
  const tierCity = missionId === 'mission-5'
  const cityVisual=cityEnabled()&&!firstCity()&&(missionId==='mission-1'||Boolean(arcBossFor(missionId)))
  const atmosphere = cityVisual?'#bfa17c': prismMission ? '#586d79' : salvageMission ? '#ab8068' : tierCity ? '#bc9478' : '#ac8a70'

  return (
    <Canvas
      className="game-canvas"
      style={{ display: rendering ? undefined : 'none' }}
      frameloop={rendering && !paused ? 'always' : 'never'}
      camera={{ position: [0, 3.2, 14.7], fov: 42, near: 0.1, far: 180 }}
      // Respect native pixels when browser zoom makes devicePixelRatio < 1.
      // A minimum of 1 otherwise oversamples the physical viewport.
      dpr={[0.25, quality === 'performance' ? .75 : 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows={shadows ? 'percentage' : false}
    >
      <color attach="background" args={[atmosphere]} />
      {(missionId==='mission-1'||cityVisual) && <Sky distance={1000} sunPosition={cityVisual?[-90,32,-160]:[-150,110,-100]} turbidity={cityVisual?6:3.2} rayleigh={cityVisual?.75:1.25} mieCoefficient={.004} mieDirectionalG={.8} />}
      <PixelBudget quality={quality} />
      <RenderCadence />
      {missionId === 'mission-2' && rendering && <ContractReady key={roundId} onReady={onContractReady} />}
      {rendering && profiling && (
        <FrameMetrics cinematic={cinematic} missionId={missionId} shadows={shadows} burnParticles={burnParticles} />
      )}
      <fog attach="fog" args={[atmosphere, cityVisual?50:missionId==='mission-1' ? 28 : prismMission ? 24 : 19, cityVisual?240:missionId==='mission-1' ? 135 : prismMission ? 95 : 88]} />

      <hemisphereLight
        args={cityVisual?['#eddbb4','#565046',finalCity()?1.65:1.2]:missionId==='mission-1' ? ['#c7ddeb','#514339',1.35] : prismMission ? ['#d9e7de', '#434454', 2.1] : ['#ffe5ba', '#59635c', 2.3]}
      />
      <PlayerSunlight prismMission={prismMission} shadows={shadows} cityVisual={cityVisual} />
      <directionalLight
        position={prismMission ? [8, 7, -12] : [8, 7, 12]}
        intensity={missionId==='mission-1' ? .85 : 1.15}
        color={prismMission ? '#c1a4e2' : '#92ccc3'}
      />
      <pointLight
        position={[0, 5, -4]}
        intensity={missionId==='mission-1' ? 8 : prismMission ? 13 : 16}
        distance={28}
        color={prismMission ? '#9c71ff' : '#d37a43'}
      />

      <Physics gravity={[0, -9.81, 0]} paused={!active || cinematic || paused}>
        <World missionId={missionId} burnParticles={burnParticles} />
        <Player active={active && !cinematic && !sequence} showAvatar={handingBack || (!sequence && (!cinematic || cinematicPhase === 'returning'))} />
      </Physics>
      {missionId === 'mission-2' && <>
        {/* Keep the contract's light slot while idle. Removing Bujji hides three
            other lights, so reserve those slots at zero during the contract.
            Constant light counts retain the already linked scene programs. */}
        <group position={[contractOrigin?.x ?? 0, contractOrigin?.y ?? 0, contractOrigin?.z ?? 0]}>
          <pointLight position={[3, 5, 2]} color="#c5d6fa" intensity={sequence ? 18 : 0} distance={24} />
        </group>
        {sequence && [0, 1, 2].map(index => <pointLight key={index} intensity={0} distance={4} />)}
      </>}
      <CinematicStage />
      {sequence && missionId === 'mission-2' && <MissionTwoSequence key={useMissionTwoSequence.getState().runId} enabled={sequenceRunning} />}
    </Canvas>
  )
}

export default GameCanvas
