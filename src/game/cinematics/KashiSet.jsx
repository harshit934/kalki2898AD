import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D } from 'three'

const skyline = [
  [-19, -39, 5, 11], [-13, -44, 4, 16], [-8, -43, 4, 9],
  [-2, -48, 5, 20], [5, -46, 4, 12], [10, -45, 5, 17],
  [16, -39, 5, 10], [21, -36, 4, 15], [-22, -34, 4, 8],
]

export default function KashiSet({ session }) {
  const towers = useRef(null)
  const lights = useRef(null)
  const skylineSet = useRef(null)

  useLayoutEffect(() => {
    const mark = new Object3D()
    skyline.forEach(([x, z, w, h], i) => {
      mark.position.set(x, h / 2, z)
      mark.scale.set(w, h, w * 0.85)
      mark.updateMatrix()
      towers.current.setMatrixAt(i, mark.matrix)
    })
    towers.current.instanceMatrix.needsUpdate = true
    towers.current.computeBoundingSphere()
  }, [])

  useFrame(() => {
    const time = session.time
    skylineSet.current.visible = time < 5
    const key = Math.min(1, Math.max(0, (time - 9.7) / 0.6), Math.max(0, (25.8 - time) / 2))
    lights.current.intensity = 7 * key
  })

  return <>
    <group ref={skylineSet}>
      <mesh position={[0, 23, -40]} rotation={[0, Math.PI / 4, Math.PI]}>
        <coneGeometry args={[19, 26, 4]} />
        <meshBasicMaterial color="#302723" fog={false} />
      </mesh>
      <mesh position={[17, 10, -52]}>
        <sphereGeometry args={[2.1, 12, 8]} />
        <meshBasicMaterial color="#ffba70" fog={false} />
      </mesh>
      <instancedMesh ref={towers} args={[null, null, skyline.length]}>
      <boxGeometry />
      <meshStandardMaterial color="#50433f" roughness={1} />
      </instancedMesh>
    </group>
    <pointLight ref={lights} position={[1.5, 2.1, -2.7]} color="#ffd1a0" intensity={0} distance={7} />
  </>
}

