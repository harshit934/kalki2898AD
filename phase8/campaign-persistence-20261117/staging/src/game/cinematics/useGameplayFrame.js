import { useFrame } from '@react-three/fiber'
import { gameTime, isGameTimeHeld } from '../gameClock.js'
export function useGameplayFrame(callback) {
  useFrame((state, delta, frame) => {
    if (isGameTimeHeld()) return
    callback({ ...state, clock: { elapsedTime: gameTime() / 1000 } }, Math.min(delta, .05), frame)
  })
}
