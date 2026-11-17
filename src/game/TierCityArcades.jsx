import { useEffect, useMemo } from 'react'
import { BoxGeometry, CylinderGeometry } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

const crossings = [-18, -38, -56]

export default function TierCityArcades() {
  const geometry = useMemo(() => {
    const pieces = []
    const box = (size, position) => {
      const piece = new BoxGeometry(...size)
      piece.translate(...position)
      pieces.push(piece)
    }
    for (const z of crossings) {
      box([20.8, 0.65, 2.2], [0, 7.4, z])
      box([21.4, 0.18, 2.8], [0, 7.82, z])
      for (const side of [-1, 1]) {
        box([1.25, 7.4, 1.5], [side * 10.2, 3.7, z])
        box([1.9, 0.65, 2.1], [side * 10.2, 0.32, z])
        box([0.18, 1.2, 2.4], [side * 10.2, 8.4, z])
        for (let rib = 0; rib < 7; rib += 1) {
          box([0.25, 0.42, 2.45], [side * (1.2 + rib * 1.3), 6.91, z])
        }
      }
      for (const edge of [-1, 1]) {
        box([20.6, 0.1, 0.1], [0, 8.65, z + edge * 1.1])
        for (let post = -9; post <= 9; post += 1.5) {
          box([0.07, 0.8, 0.07], [post, 8.23, z + edge * 1.1])
        }
      }
      const pipe = new CylinderGeometry(0.22, 0.22, 21, 12)
      pipe.rotateZ(Math.PI / 2)
      pipe.translate(0, 6.8, z + 0.8)
      pieces.push(pipe)
    }
    const merged = mergeGeometries(pieces)
    pieces.forEach((piece) => piece.dispose())
    return merged
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#6c5a47" metalness={0.48} roughness={0.68} />
      </mesh>
      {crossings.map((z) => (
        <RigidBody key={z} type="fixed" colliders={false}>
          {[-1, 1].map((side) => (
            <CuboidCollider key={side} args={[0.95, 3.7, 1.05]} position={[side * 10.2, 3.7, z]} />
          ))}
          <CuboidCollider args={[10.7, 0.42, 1.4]} position={[0, 7.6, z]} />
        </RigidBody>
      ))}
    </>
  )
}
