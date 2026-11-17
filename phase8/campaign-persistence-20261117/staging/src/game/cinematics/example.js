export const missionOneCinematic = {
  storyPlacement: 'explicit-replay',
  duration: 8.5,
  returnDuration: 0.65,
  camera: [
    { at: 0, position: [3, 2.4, 5], focus: [0, 1.1, 0], fov: 48 },
    { at: 1.7, position: [2, 1.9, 3.7], focus: [0, 1.2, 0], fov: 42 },
    { at: 4.5, position: [2.2, 1.52, -1.75], focus: [0, 1.42, 0], fov: 36 },
    { at: 7, position: [0.75, 1.55, -1.35], focus: [0, 1.42, 0], fov: 34 },
    { at: 8.5, position: [0.8, 1.9, 2.8], focus: [0, 1.25, 0], fov: 42 },
  ],
  actors: [{
    id: 'bhairava',
    src: '/models/bhairava-free-rig.glb?v=4',
    height: 1.78,
    appearance: 'bhairava',
    weapon: true,
    position: [0, 0, 0],
    rotation: [0, Math.PI, 0],
    actions: [
      { at: 0, clip: 'Sword idle (guard)' },
      { at: 4.6, clip: 'Sword block', fade: 0.25, loop: false },
      { at: 6.2, clip: 'Sword idle (guard)', fade: 0.3 },
    ],
  }],
  dialogue: [
    { at: 2, speaker: 'Bhairava', text: 'The dust is settling. Keep your eyes on the ridge.', hold: true },
    { at: 5.2, speaker: 'Bhairava', text: 'We move when the path is clear.', duration: 2.6 },
  ],
  audio: [{ at: 0.8, src: '/audio/cinematics/phase41-chime.wav', channel: 'effects', gain: 0.45 }],
}


