import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useBossState } from './bossSystem.js'
import { getPlayerWorldPosition, useGameplayState } from './gameplayStore.js'
import { usePlayerInput } from './player/playerInputStore.js'

function measureRenderer(gl, renderTimes, presentedAt) {

    const context = gl.getContext()
    const timer = context.getExtension('EXT_disjoint_timer_query_webgl2')
    const pending = []
    const original = gl.render
    let frame = 0
    function measuredRender(...args) {
      presentedAt.current = performance.now()
      const timing = renderTimes.current
      if (timer && context.getParameter(timer.GPU_DISJOINT_EXT)) {
        pending.splice(0).forEach((query) => context.deleteQuery(query))
      }
      while (pending.length && context.getQueryParameter(pending[0], context.QUERY_RESULT_AVAILABLE)) {
        const query = pending.shift()
        timing.gpuTotal += context.getQueryParameter(query, context.QUERY_RESULT) / 1e6
        timing.gpuCount += 1
        context.deleteQuery(query)
      }
      const query = timer && frame++ % 20 === 0 && pending.length < 4 ? context.createQuery() : null
      if (query) context.beginQuery(timer.TIME_ELAPSED_EXT, query)
      const startedAt = performance.now()
      try {
        return original.apply(this, args)
      } finally {
        timing.cpuTotal += performance.now() - startedAt
        timing.cpuCount += 1
        if (query) {
          context.endQuery(timer.TIME_ELAPSED_EXT)
          pending.push(query)
        }
      }
    }
    gl.render = measuredRender
    return () => {
      if (gl.render === measuredRender) gl.render = original
      pending.forEach((query) => context.deleteQuery(query))
    }
}

// Enable with ?frameMetrics=1. Measure the render loop without updating React.
export default function FrameMetrics({ missionId, shadows, burnParticles, cinematic = false }) {
  const { gl } = useThree()
  const windowRef = useRef({ label: '', times: [], elapsed: 0 })
  const renderer = useRef(null)
  const renderTimes = useRef({ cpuTotal: 0, cpuCount: 0, gpuTotal: 0, gpuCount: 0 })
  const presentedAt = useRef(0)
  const lastSeen = useRef(0)
  useEffect(() => measureRenderer(gl, renderTimes, presentedAt), [gl])
  useFrame(({ gl, camera }) => {
    const stamp = presentedAt.current
    if (!stamp || stamp === lastSeen.current) return
    const delta = lastSeen.current ? (stamp - lastSeen.current) / 1000 : 0
    lastSeen.current = stamp
    const label = `${missionId}/${cinematic ? 'cinematic' : useBossState.getState().status}`
    const sample = windowRef.current
    if (sample.label !== label || document.hidden || !delta) {
      windowRef.current = { label, times: [], elapsed: 0 }
      return
    }
    sample.times.push(delta * 1000)
    sample.elapsed += delta
    if (sample.elapsed < 5) return

    const frames = sample.times.length
    if (renderer.current === null) {
      const context = gl.getContext()
      const debug = context.getExtension('WEBGL_debug_renderer_info')
      renderer.current = debug
        ? context.getParameter(debug.UNMASKED_RENDERER_WEBGL)
        : context.getParameter(context.RENDERER)
    }
    sample.times.sort((a, b) => a - b)
    console.info('KALKI frame metrics', JSON.stringify({
      scene: label,
      shadows,
      burnParticles,
      tierLights: new URLSearchParams(location.search).get('profileTierLights') === 'all' ? 'all' : 'pooled',
      renderer: renderer.current,
      player: { ...getPlayerWorldPosition() },
      input: {
        moveX: usePlayerInput.getState().moveX,
        moveY: usePlayerInput.getState().moveY,
        blocking: usePlayerInput.getState().blocking,
        sprint: usePlayerInput.getState().sprint,
      },
      camera: { x: camera.position.x, y: camera.position.y, z: camera.position.z, fov: camera.fov },
      health: useGameplayState.getState().health,
      width: gl.domElement.width,
      height: gl.domElement.height,
      frames,
      timingBasis: 'actual renderer submission intervals; update-only callbacks excluded',
      fps: frames / sample.elapsed,
      meanMs: sample.elapsed * 1000 / frames,
      p95Ms: sample.times[Math.ceil(frames * 0.95) - 1],
      p99Ms: sample.times[Math.ceil(frames * 0.99) - 1],
      worstMs: sample.times[frames - 1],
      over100ms: sample.times.filter(ms => ms > 100).length,
      drawCalls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      textures: gl.info.memory.textures,
      renderSubmitMeanMs: renderTimes.current.cpuCount
        ? renderTimes.current.cpuTotal / renderTimes.current.cpuCount : null,
      gpuMeanMs: renderTimes.current.gpuCount
        ? renderTimes.current.gpuTotal / renderTimes.current.gpuCount : null,
      gpuSamples: renderTimes.current.gpuCount,
    }))
    renderTimes.current = { cpuTotal: 0, cpuCount: 0, gpuTotal: 0, gpuCount: 0 }
    windowRef.current = { label, times: [], elapsed: 0 }
  })
  return null
}
