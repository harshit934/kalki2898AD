// Defer until the committed scene's materials, fog and lights are available.
// Strict Mode can cancel its first setup before it starts any GPU work.
export function scheduleMaterialWarmup(
  renderer, objects, camera, scene,
  {
    request = globalThis.requestAnimationFrame,
    cancel = globalThis.cancelAnimationFrame,
    report = (error) => console.error('[Kalki shader warm-up]', error),
    ready = () => true,
    configuration = () => null,
    stableFrames = 1,
  } = {},
) {
  let active = true
  let frame = null
  let previousConfiguration
  let settledFrames = 0
  function warm() {
    frame = null
    if (!active) return
    try {
      if (!ready()) {
        settledFrames = 0
        frame = request(warm)
        return
      }
      const currentConfiguration = configuration()
      settledFrames = settledFrames && Object.is(currentConfiguration, previousConfiguration)
        ? settledFrames + 1
        : 1
      previousConfiguration = currentConfiguration
      if (settledFrames < stableFrames) {
        frame = request(warm)
        return
      }
      Promise.resolve(renderer.compileAsync(objects, camera, scene)).catch(report)
    } catch (error) {
      report(error)
    }
  }
  frame = request(warm)
  return () => {
    active = false
    if (frame !== null) cancel(frame)
    // R3F owns these materials. Effect cleanup must not dispose live resources;
    // an already-running compile can finish without accessing component state.
  }
}
