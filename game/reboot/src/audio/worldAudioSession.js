// Runtime-driven ownership; no mission state or reward is changed by audio.
export function bindWorldAudioRuntime(runtime,audio){const sync=()=>{const session=runtime.snapshot().session;audio.setPaused('session',Boolean(session&&!['active','concluding','completed'].includes(session.state)))};sync();return runtime.subscribe(sync)}

