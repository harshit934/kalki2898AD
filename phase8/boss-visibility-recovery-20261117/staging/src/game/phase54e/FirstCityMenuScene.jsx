import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Object3D } from 'three'
import CityEnvironment from './FirstCityEnvironment.jsx'

function CityCamera(){const time=useRef(0);useFrame(({camera},dt)=>{const motion=document.documentElement.dataset.interfaceMotion!=='reduced'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;if(motion)time.current+=Math.min(dt,.05);camera.position.set(-29+Math.sin(time.current*.07)*.6,10,26);camera.lookAt(9,8,-31)});return null}
export default function FirstCityMenuScene(){const target=useMemo(()=>{const o=new Object3D();o.position.set(0,3,-24);return o},[]);return <>
 <color attach="background" args={['#8e826a']}/><fog attach="fog" args={['#8e826a',80,230]}/>
 <hemisphereLight args={['#e5d7b3','#393e35',.85]}/><primitive object={target}/>
 <directionalLight target={target} position={[-28,45,15]} intensity={3.1} color="#ffd6a0" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-60} shadow-camera-right={60} shadow-camera-top={60} shadow-camera-bottom={-60} shadow-camera-far={170} shadow-normalBias={.06}/>
 <directionalLight position={[35,15,-30]} intensity={.6} color="#b4d2c3"/>
 <Suspense fallback={null}><Environment files="/environment/kashi/sunset-lighting.hdr" environmentIntensity={.45}/><CityEnvironment preview/></Suspense><CityCamera/>
 </>}
