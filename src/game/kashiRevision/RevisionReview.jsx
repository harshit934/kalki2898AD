import { Suspense, use, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, Sky } from '@react-three/drei'
import { RepeatWrapping } from 'three'
import KashiEnvironment from '../KashiEnvironment.jsx'
import RenderCadence from '../RenderCadence.jsx'
import KashiRevision from './KashiRevision.jsx'
import { loadRevisionBase } from './revisionAssets.js'
import { WorldButton, WorldPanel } from '../../ui/kashi54c/WorldComponents.jsx'
import './review.css'

const VIEWS = {
  RIVER: { eye: [-35, 6.4, 9], target: [-20.5, 2.4, -18] },
  STREET: { eye: [-28, 2.3, -4], target: [-21.1, 1.5, -19] },
  FAR: { eye: [-75, 26, 70], target: [-20, 3, -18] },
}
function Camera({ view }) {
  const camera = useThree(s => s.camera), controls = useRef(null)
  useEffect(() => {
    camera.position.set(...VIEWS[view].eye)
    if (controls.current) { controls.current.target.set(...VIEWS[view].target); controls.current.update() }
  }, [view, camera])
  return <OrbitControls ref={controls} makeDefault minDistance={3} maxDistance={160} maxPolarAngle={Math.PI * .49} />
}
function Ground() {
  const base = use(loadRevisionBase())
  const map = useMemo(() => { const t = base.maps[0].clone(); t.repeat.set(30, 70); t.wrapS = t.wrapT = RepeatWrapping; return t }, [base])
  useEffect(() => () => map.dispose(), [map])
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, -.28, -60]} receiveShadow><planeGeometry args={[85, 180]} /><meshStandardMaterial color="#b09c7b" map={map} roughness={.95} /></mesh>
}
export default function RevisionReview() {
  const initial = new URLSearchParams(location.search).get('studyView') === 'FAR' ? 'FAR' : 'RIVER'
  const [view, setView] = useState(initial), [info, setInfo] = useState(false)
  return <main className="kashi54c-ui kashi54c-review revision-viewer">
    <div className="review-world"><Canvas dpr={[1, 1]} shadows="percentage" camera={{ position: VIEWS[initial].eye, fov: 49, near: .1, far: 230 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#b8a183']} /><fog attach="fog" args={['#b8a183', 65, 205]} />
      <Sky sunPosition={[-150, 35, -100]} turbidity={4} rayleigh={1.8} />
      <hemisphereLight args={['#c7ddeb', '#514339', 1.35]} />
      <directionalLight position={[-35, 48, 15]} intensity={3.2} color="#ffc18b" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-55} shadow-camera-right={55} shadow-camera-top={55} shadow-camera-bottom={-55} shadow-normalBias={.04} />
      <Suspense fallback={null}>
        <Environment files="/environment/kashi/sunset-lighting.hdr" environmentIntensity={.3} />
        <KashiEnvironment assetPath="/environment/mission1/kashi-riverfront-v1.glb" />
        <KashiRevision /><Ground />
      </Suspense>
      <mesh position={[-145, -1.7, -45]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[250, 450]} /><meshStandardMaterial color="#42615a" roughness={.4} metalness={.2} /></mesh>
      <RenderCadence /><Camera view={view} />
    </Canvas></div>
    <header className="review-heading"><span className="world-kicker">Kalki 2898 AD / isolated revision</span><strong>కాశీ / RIVER BLOCK 07</strong></header>
    <nav className="review-controls" aria-label="Revision viewpoints">{Object.keys(VIEWS).map(name => <WorldButton key={name} aria-pressed={view === name} onClick={() => setView(name)}>{name}</WorldButton>)}<WorldButton aria-expanded={info} onClick={() => setInfo(!info)}>INFO</WorldButton></nav>
    {info && <WorldPanel className="revision-info" aria-label="Revision information"><span className="world-kicker">One connected block / review only</span><h1>The working quay.</h1><p>Joined façades, a continuous bank, restrained licensed civilian animation, and separate near-detail assets.</p><p>Original game remains default. The rejected prototype is retained. The 533.6 ms ending issue remains unresolved.</p><a className="world-button" href="/?kashiPrototype=revision">OPEN PLAYABLE REVISION</a></WorldPanel>}
    <p className="revision-caption">ISOLATED ART VIEWER • NOT A GAMEPLAY ACCEPTANCE CAPTURE</p>
  </main>
}
