// Runtime-driven ownership; no mission state or reward is changed by audio.
export function bindWorldAudioRuntime(runtime,audio){const sync=()=>{const session=runtime.snapshot().session;const storyScene=session?.state==='suspended'&&session.pauseReasons?.length===1&&session.pauseReasons[0]==='story-cinematic';audio.setPaused('session',Boolean(session&&!storyScene&&!['active','concluding','completed'].includes(session.state)))};sync();return runtime.subscribe(sync)}

