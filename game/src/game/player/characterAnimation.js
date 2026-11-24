const fingerTrack = /^RightHand(Thumb|Index|Middle|Ring|Pinky)\d\.quaternion$/

export function prepareCharacterClips(animations) {
  const guard = animations.find((clip) => clip.name === 'Sword idle (guard)')
  const grip = new Map((guard?.tracks || []).filter((track) => fingerTrack.test(track.name))
    .map((track) => [track.name, track.values.slice(0, 4)]))
  return animations.map((source) => {
    const clip = source.clone()
    for (const track of clip.tracks) {
      if (track.name === 'Hips.position') {
        const x = track.values[0], z = track.values[2]
        for (let i = 0; i < track.values.length; i += 3) {
          track.values[i] = x
          track.values[i + 2] = z
        }
      }
      // Locomotion remains authored, but the sword must stay in a closed fist.
      const closed = grip.get(track.name)
      if (closed && ['Walk', 'Run', 'Jump (in air)'].includes(clip.name)) {
        for (let i = 0; i < track.values.length; i += 4) track.values.set(closed, i)
      }
    }
    return clip
  })
}

export function characterActionName(state, previousName) {
  if (state.mode === 'defeated') return 'Death (fall backward)'
  if (state.attackType || state.attackProgress > 0) return 'Sword slash'
  if (state.guarding) return 'Sword block'
  if (state.mode === 'jumping') return 'Jump (in air)'
  // Separate enter/exit thresholds keep tiny velocity fluctuations from
  // repeatedly restarting idle/walk/run crossfades.
  if (state.speed > (previousName === 'Run' ? 4.2 : 4.8)) return 'Run'
  return state.speed > (previousName === 'Walk' ? 0.08 : 0.18) ? 'Walk' : 'Sword idle (guard)'
}

export function characterAttackTime(state, duration) {
  return Math.min(1, Math.max(0, state.attackPhase ?? state.attackProgress ?? 0)) * duration
}

export function characterBlendDuration(name) {
  if (name === 'Sword slash') return 0.065
  if (name === 'Sword block') return 0.09
  if (name.startsWith('Death') || name === 'Jump (in air)') return 0.12
  return 0.2
}
