import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { scheduleMaterialWarmup } from './shaderWarmup.js'
import { useGameplayState } from './gameplayStore.js'
import { useCinematic } from './cinematics/controller.js'
import { useMissionTwoSequence } from './missionTwoSequence.js'

export default function FirstUseMaterialWarmup({ missionId }) {
  const group = useRef(null)
  const gl = useThree((state) => state.gl)
  const camera = useThree((state) => state.camera)
  const scene = useThree((state) => state.scene)
  const roundId = useGameplayState((state) => state.roundId)

  useEffect(() => {
    return scheduleMaterialWarmup(gl, group.current, camera, scene, {
      // A missing fallback alone can also mean the player has not committed yet.
      // Retain only the variants for the settled gameplay light configuration.
      ready: () => Boolean(scene.getObjectByName('player')) &&
        !scene.getObjectByName('player-procedural-loading-fallback') &&
        useCinematic.getState().phase === 'idle' &&
        useMissionTwoSequence.getState().phase === 'idle',
      stableFrames: 2,
      configuration: () => {
        const lights = {}
        scene.traverseVisible((object) => {
          if (!object.isLight || !object.layers.test(camera.layers)) return
          const key = `${object.type}:${Boolean(object.castShadow)}`
          lights[key] = (lights[key] ?? 0) + 1
        })
        // Positions/intensities are uniforms, not reasons to compile again.
        return JSON.stringify([
          Object.entries(lights).sort(), Boolean(scene.fog),
          Boolean(scene.fog?.isFogExp2), gl.shadowMap.enabled,
          gl.shadowMap.type, gl.outputColorSpace, gl.toneMapping,
        ])
      },
    })
  }, [gl, camera, scene, missionId, roundId])

  // These three exact material variants cover health-bar background/fill and
  // transparent, untone-mapped crystal bursts / Bujji beams / impact particles.
  // Color and opacity uniforms do not require distinct shader programs. Keeping
  // the hidden materials mounted retains their programs between short effects.
  return (
    <group ref={group} name="first-use-material-warmup" visible={false}>
      <mesh name="warm-health-background">
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#101419" />
      </mesh>
      <mesh name="warm-health-fill">
        <planeGeometry args={[1, 0.065]} />
        <meshBasicMaterial color="#61f2dc" toneMapped={false} />
      </mesh>
      <mesh name="warm-burst-and-beam">
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#90fff2" transparent opacity={1} toneMapped={false} />
      </mesh>
    </group>
  )
}
