import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, Sky, useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import { RepeatWrapping, SRGBColorSpace } from 'three'
import KashiEnvironment from '../KashiEnvironment.jsx'
import KashiGhatPrototype from './KashiGhatPrototype.jsx'
import { WorldButton, WorldMeter, WorldMissionTile, WorldPanel } from '../../ui/kashi54c/WorldComponents.jsx'

const VIEWS = {
  GHAT: { eye: [-44, 11, 36], target: [-18, 6, -27] },
  STREET: { eye: [1, 4.5, 18], target: [0, 8, -51] },
  SKYLINE: { eye: [-45, 22, -5], target: [0, 12, -74] },
}
function ViewCamera({ view }) {
  const camera = useThree(s => s.camera), controls = useRef(null)
  useEffect(() => {
    camera.position.set(...VIEWS[view].eye)
    if (controls.current) { controls.current.target.set(...VIEWS[view].target); controls.current.update() }
  }, [camera, view])
  return <OrbitControls ref={controls} makeDefault maxDistance={160} minDistance={5} maxPolarAngle={Math.PI * .49} />
}
export default function KashiPrototypeReview() {
  const [view, setView] = useState('GHAT'), [system, setSystem] = useState(false), [loaded, setLoaded] = useState(false)
  return <main className="kashi54c-ui kashi54c-review">
    <div className="review-world"><Canvas camera={{ position: VIEWS.GHAT.eye, fov: 49, near: .1, far: 230 }} dpr={[1, 1]} shadows="percentage" gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#b69a79']} /><fog attach="fog" args={['#b69a79', 65, 205]} />
      <Sky sunPosition={[-150, 28, -100]} turbidity={5} rayleigh={2} />
      <hemisphereLight args={['#c7ddeb', '#514339', 1.35]} />
      <directionalLight position={[-35, 48, 15]} intensity={3.2} color="#ffc18b" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-55} shadow-camera-right={55} shadow-camera-top={55} shadow-camera-bottom={-55} shadow-normalBias={.04} />
      <Suspense fallback={null}>
        <Environment files="/environment/kashi/sunset-lighting.hdr" environmentIntensity={.3} />
        <KashiEnvironment assetPath="/environment/mission1/kashi-riverfront-v1.glb" />
        <KashiGhatPrototype />
        <StudyGround />
        <Ready onReady={setLoaded} />
      </Suspense>
      <mesh position={[-120, -1.7, -40]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[220, 450]} /><meshStandardMaterial color="#486764" roughness={.4} metalness={.2} /></mesh>
      <ViewCamera view={view} />
    </Canvas></div>
    <header className="review-heading"><span className="world-kicker">Kalki 2898 AD / environment study 01</span><strong>కాశీ / KASHI</strong></header>
    <nav className="review-controls" aria-label="Prototype viewpoints">{Object.keys(VIEWS).map(name => <WorldButton key={name} aria-pressed={view === name} onClick={() => setView(name)}>{name}</WorldButton>)}<WorldButton aria-expanded={system} onClick={() => setSystem(!system)}>UI TOKENS</WorldButton></nav>
    <WorldPanel className="review-intro" aria-label="Prototype overview"><span className="world-kicker">River transit / sector 07</span><h1>The living<br />riverfront.</h1><p>A reversible city study: layered ghats, temple courts, shaded workshops and inherited infrastructure.</p><a className="world-button" href="/?kashiPrototype=54c">ENTER PLAYABLE PROTOTYPE ↗</a></WorldPanel>
    <p className="review-note">OPT-IN PROTOTYPE • Not visual or performance acceptance.<br />Orbit to inspect geometry. Existing missions remain unchanged.<br />The 533.6 ms ending-transition issue remains unresolved.</p>
    {system && <WorldPanel className="review-system" aria-label="Reusable world UI tokens"><span className="world-kicker">Shared visual language / sample components</span><h2>Stone. Brass. Signal.</h2><WorldMissionTile /><p className="world-kicker">Loading / health / progression meter sample</p><WorldMeter value={72} label="Design sample progress" /><p><WorldButton tone="primary">RESUME · SAMPLE</WorldButton></p><div className="world-alert">Game-over / caution treatment sample. These tokens are not yet applied to the game's screens.</div><p className="world-kicker">Warm-neutral · gold · teal · coral</p></WorldPanel>}
    {!loaded && <p className="review-loading" role="status">LOADING DISTRICT STUDY…</p>}
  </main>
}
function Ready({ onReady }) { useEffect(() => { onReady(true) }, [onReady]); return null }

function StudyGround() {
  const source = useTexture('/environment/kashi/stone-color.jpg')
  const map = useMemo(() => { const t = source.clone(); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(35, 80); return t }, [source])
  useEffect(() => () => map.dispose(), [map])
  return <mesh position={[17.5, -.27, -60]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[95, 190]} /><meshStandardMaterial color="#a18e70" roughness={.96} map={map} /></mesh>
}
