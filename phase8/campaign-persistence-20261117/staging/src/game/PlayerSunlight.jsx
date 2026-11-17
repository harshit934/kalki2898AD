import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D } from 'three'
import { getPlayerWorldPosition } from './gameplayStore.js'

export default function PlayerSunlight({ prismMission, shadows, cityVisual = false }) {
  const light = useRef(null)
  const target = useMemo(() => new Object3D(), [])
  useFrame(() => {
    const player = getPlayerWorldPosition()
    // Snap to shadow texels to keep the moving shadow map stable.
    const x = Math.round(player.x / 0.046875) * 0.046875
    const z = Math.round(player.z / 0.046875) * 0.046875
    target.position.set(x, 0, z)
    light.current.position.set(x + (cityVisual?-26:prismMission ? -12 : -15), cityVisual?18:prismMission ? 18 : 11, z + (cityVisual?-34:prismMission ? 8 : -10))
    target.updateMatrixWorld()
  })
  return (
    <>
      <primitive object={target} />
      <directionalLight
        ref={light}
        target={target}
        castShadow={shadows}
        intensity={cityVisual?4:3.2}
        color={prismMission ? '#c8c0ff' : '#ffc18b'}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-bias={-0.0002}
        shadow-normalBias={0.025}
      />
    </>
  )
}
