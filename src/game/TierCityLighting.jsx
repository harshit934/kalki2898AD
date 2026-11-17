import { useMemo, useRef } from 'react'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { getPlayerWorldPosition } from './gameplayStore.js'
import { FIRE_LIGHTS, WINDOW_LIGHTS, nearestLightSources } from './tierLightSources.js'

export default function TierCityLighting({ fire }) {
  const lights = useRef([])
  const nextUpdate = useRef(0)
  const sources = useMemo(() => fire ? [...WINDOW_LIGHTS, ...FIRE_LIGHTS] : WINDOW_LIGHTS, [fire])
  const params = new URLSearchParams(location.search)
  const lightCount = params.get('frameMetrics') === '1' && params.get('profileTierLights') === 'all' ? sources.length : 4
  useGameplayFrame(({ clock }) => {
    if (clock.elapsedTime < nextUpdate.current) return
    nextUpdate.current = clock.elapsedTime + 0.1
    nearestLightSources(sources, getPlayerWorldPosition(), lightCount).forEach((source, index) => {
      const light = lights.current[index]
      if (!light) return
      light.position.set(...source.position)
      light.color.set(source.color)
      light.intensity = source.intensity
    })
  })
  // Fixed light count avoids shader recompilation during movement. Visible
  // emissive fixtures and burn particles remain present throughout the street.
  return Array.from({ length: lightCount }, (_, index) => <pointLight key={index}
    ref={(light) => { lights.current[index] = light }} intensity={0} distance={6} />)
}
