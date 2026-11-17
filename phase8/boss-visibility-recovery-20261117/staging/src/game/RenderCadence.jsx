import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Budget only desktop GPU submissions. Simulation, input and every other
// useFrame subscriber still execute at the normal R3F update cadence.
export default function RenderCadence() {
  const last=useRef(-Infinity)
  useFrame(({gl,scene,camera,size})=>{
    const now=performance.now(),interval=1000/30
    if(size.width<900){last.current=-Infinity;gl.render(scene,camera);return}
    if(Number.isFinite(last.current)){
      const elapsed=now-last.current
      if(elapsed<interval)return
      last.current=now-elapsed%interval
    }else last.current=now
    gl.render(scene,camera)
  },1)
  return null
}
