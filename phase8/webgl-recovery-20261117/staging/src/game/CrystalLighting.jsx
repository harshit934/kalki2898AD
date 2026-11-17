import { useRef } from 'react'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { getPlayerWorldPosition, useGameplayState } from './gameplayStore.js'

const LIGHT_COUNT = 4

// Forward lighting evaluates every point light on every standard material.
// Retain the nearest lights and all emissive crystal meshes, with a fixed shader
// light count even as crystals are collected or dropped during combat.
export default function CrystalLighting({ crystals, prism }) {
  const lights = useRef([])
  const nextUpdate = useRef(0)
  useGameplayFrame(({ clock }) => {
    if (clock.elapsedTime < nextUpdate.current) return
    nextUpdate.current = clock.elapsedTime + 0.12
    const player = getPlayerWorldPosition()
    const collected = useGameplayState.getState().collectedCrystalIds
    const nearest = crystals.filter(({ id }) => !collected.includes(id))
      .map((crystal) => ({ crystal, distance: Math.hypot(crystal.position[0] - player.x, crystal.position[2] - player.z) }))
      .sort((a, b) => a.distance - b.distance)
    lights.current.forEach((light, index) => {
      const selected = nearest[index]
      if (!light) return
      if (selected) light.position.set(...selected.crystal.position)
      light.intensity = selected ? 2 : 0
    })
  })
  return Array.from({ length: LIGHT_COUNT }, (_, index) => (
    <pointLight key={index} ref={(light) => { lights.current[index] = light }}
      color={prism ? '#a674ff' : '#52e9d8'} intensity={0} distance={4} />
  ))
}
