import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Photograph the real playable district, rather than adding a separate blockout skyline.
export default function KashiPlayableSet({session}){
  const key=useRef(null)
  useFrame(()=>{if(key.current){const t=session.time;key.current.intensity=4*Math.min(1,Math.max(0,(t-9.7)/.6),Math.max(0,(25.8-t)/2))}})
  return <pointLight ref={key} position={[1.5,2.1,-2.7]} color="#ffd1a0" intensity={0} distance={7} />
}
