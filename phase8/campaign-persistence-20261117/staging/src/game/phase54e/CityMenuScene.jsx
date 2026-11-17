import{firstCity}from'./cityAssets.js'
import FirstCityMenuScene from'./FirstCityMenuScene.jsx'
import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Object3D } from 'three'
import CityEnvironment from './CityEnvironment.jsx'

function CityCamera(){const time=useRef(0);useFrame(({camera},dt)=>{const motion=document.documentElement.dataset.interfaceMotion!=='reduced'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;if(motion)time.current+=Math.min(dt,.05);camera.position.set(5.5+Math.sin(time.current*.07)*.2,3.7,13);camera.lookAt(-1,6,-24)});return null}
function CorrectedCityMenuScene(){const target=useMemo(()=>{const o=new Object3D();o.position.set(0,3,-24);return o},[]);return <>
 <color attach="background" args={['#b49b77']}/><fog attach="fog" args={['#b49b77',65,240]}/>
 <hemisphereLight args={['#e5d7b3','#393e35',.85]}/><primitive object={target}/>
 <directionalLight target={target} position={[-28,45,15]} intensity={3.8} color="#ffd6a0" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-60} shadow-camera-right={60} shadow-camera-top={60} shadow-camera-bottom={-60} shadow-camera-far={170} shadow-normalBias={.06}/>
 <directionalLight position={[35,15,-30]} intensity={.6} color="#b4d2c3"/>
 <Suspense fallback={null}><Environment files="/environment/kashi/sunset-lighting.hdr" environmentIntensity={.45}/><CityEnvironment preview/></Suspense><CityCamera/>
 </>}

export default function CityMenuScene(){return firstCity()?<FirstCityMenuScene/>:<CorrectedCityMenuScene/>}
