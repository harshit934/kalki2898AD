import { arcBossFor } from './phase54e/arcBosses.js'
import { gameNow } from './gameClock.js'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { Suspense, useEffect, useRef } from 'react'
import MissionOneBujji from './MissionOneBujji.jsx'
import { useThree } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { playDialogueForEvent } from '../audio/audioManager.js'
import { DIALOGUE_EVENTS } from '../audio/dialogueInventory.js'
import { enemyRuntime, useCombatState } from './combatSystem.js'
import { bossRuntime, useBossState } from './bossSystem.js'
import { getPlayerWorldPosition, useGameplayState } from './gameplayStore.js'
import { useCompanionState } from './companionSystem.js'
import { useCampaignState } from './campaignSystem.js'

const ASSIST_COOLDOWN_MS = 4200
const ASSIST_RANGE = 11

function BujjiCompanion() {
  const bodyRef = useRef(null)
  const beamRef = useRef(null)
  const position = useRef(new Vector3(2, 1.8, 10))
  const beamTargetRef = useRef(null)
  const lastAssistAt = useRef(0)
  const voiceRound = useRef(null)
  const camera = useThree((state) => state.camera)
  const roundId = useGameplayState((state) => state.roundId)
  const selectedMissionId = useCampaignState((state) => state.selectedMissionId)
  const lastRoundId = useRef(roundId)

  useEffect(() => {
    if (lastRoundId.current === roundId) return
    lastRoundId.current = roundId
    lastAssistAt.current = 0
    useCompanionState.getState().reset()
  }, [roundId])

  useGameplayFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    const player = getPlayerWorldPosition()
    const bob = Math.sin(clock.elapsedTime * 2.8) * 0.12
    const orbit = Math.sin(clock.elapsedTime * 0.55) * 0.34
    // Keep Bujji above one shoulder in screen space so it remains visible
    // without covering Bhairava's silhouette as the camera rotates.
    const cameraToPlayer = new Vector3(player.x - camera.position.x, 0, player.z - camera.position.z).normalize()
    const screenRight = new Vector3(-cameraToPlayer.z, 0, cameraToPlayer.x)
    const followTarget = new Vector3(
      player.x + screenRight.x * (1.18 + orbit) - cameraToPlayer.x * 0.55,
      player.y + 2.28 + bob,
      player.z + screenRight.z * (1.18 + orbit) - cameraToPlayer.z * 0.55,
    )
    position.current.x = MathUtils.damp(position.current.x, followTarget.x, 3.8, delta)
    position.current.y = MathUtils.damp(position.current.y, followTarget.y, 4.5, delta)
    position.current.z = MathUtils.damp(position.current.z, followTarget.z, 3.8, delta)

    if (bodyRef.current) {
      bodyRef.current.position.copy(position.current)
      bodyRef.current.scale.setScalar(0.4)
      bodyRef.current.rotation.y = MathUtils.damp(
        bodyRef.current.rotation.y,
        Math.atan2(player.x - position.current.x, player.z - position.current.z),
        4,
        delta,
      )
      bodyRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.2) * 0.045
    }

    const gameplay = useGameplayState.getState()
    const boss = useBossState.getState()
    let target = null
    let targetDistance = ASSIST_RANGE

    if (!gameplay.gameOver && gameNow() >= lastAssistAt.current + ASSIST_COOLDOWN_MS) {
      if (boss.status === 'active' && !arcBossFor(selectedMissionId)) {
        const distance = Math.hypot(bossRuntime.position.x - position.current.x, bossRuntime.position.z - position.current.z)
        if (distance < targetDistance) {
          target = { kind: 'boss', id: 'arena-warden', position: bossRuntime.position }
          targetDistance = distance
        }
      }

      for (const [enemyId, enemy] of enemyRuntime) {
        if (!enemy.alive || useCombatState.getState().defeatedEnemyIds.includes(enemyId)) continue
        const distance = Math.hypot(enemy.position.x - position.current.x, enemy.position.z - position.current.z)
        if (distance < targetDistance) {
          target = { kind: 'enemy', id: enemyId, position: enemy.position }
          targetDistance = distance
        }
      }
    }

    if (selectedMissionId==='mission-1' && bodyRef.current) {
      const x=target?.position.x??player.x+(camera.position.x-player.x)*.65
      const z=target?.position.z??player.z+(camera.position.z-player.z)*.65
      const angle=Math.atan2(x-position.current.x,z-position.current.z)
      const current=bodyRef.current.rotation.y
      bodyRef.current.rotation.y+=Math.atan2(Math.sin(angle-current),Math.cos(angle-current))*(1-Math.exp(-8*delta))
    }
    if (target) {
      lastAssistAt.current = gameNow()
      if (target.kind === 'boss') {
        useBossState.getState().damageBoss(selectedMissionId === 'mission-2' ? 8 : 10, target.position)
      } else {
        useCombatState.getState().damageEnemy(target.id, 12, target.position)
      }
      useCompanionState.getState().recordAssist()
      if (selectedMissionId !== 'mission-1' && voiceRound.current !== roundId) {
        voiceRound.current = roundId
        void playDialogueForEvent(DIALOGUE_EVENTS.bujjiAssist).then((result) => {
          if (result !== 'played' && voiceRound.current === roundId) voiceRound.current = null
        })
      }
      beamTargetRef.current = {
        position: new Vector3(target.position.x, target.position.y + 1.1, target.position.z),
        expiresAt: gameNow() + 450,
      }
    } else if (gameNow() >= useCompanionState.getState().assistingUntil) {
      useCompanionState.getState().setStatus('following')
    }

    if (beamRef.current) {
      const beamTarget = target
        ? beamTargetRef.current?.position
        : gameNow() < (beamTargetRef.current?.expiresAt ?? 0)
          ? beamTargetRef.current.position
          : null
      beamRef.current.visible = Boolean(beamTarget)
      if (beamTarget) {
        const targetPoint = beamTarget.clone()
        const direction = targetPoint.sub(position.current)
        const length = direction.length()
        beamRef.current.position.copy(position.current).addScaledVector(direction, 0.5)
        beamRef.current.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize())
        beamRef.current.scale.set(0.56, length, 0.56)
      }
    }
  })

  return (
    <>
      <group ref={bodyRef}>
        {selectedMissionId==='mission-1' ? <Suspense fallback={null}><MissionOneBujji /></Suspense> : <group>
        <mesh castShadow>
          <sphereGeometry args={[0.36, 18, 14]} />
          <meshStandardMaterial color="#8bdedb" metalness={0.72} roughness={0.2} emissive="#1f7776" emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0, 0, -0.08]} scale={[1.25, 0.4, 0.95]}>
          <torusGeometry args={[0.38, 0.045, 8, 24]} />
          <meshBasicMaterial color="#76fff1" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.02, -0.32]}>
          <boxGeometry args={[0.3, 0.14, 0.04]} />
          <meshBasicMaterial color="#fff1ba" toneMapped={false} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.48, -0.12, 0.08]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.17, 0.025, 6, 16]} />
              <meshBasicMaterial color="#80a8ff" toneMapped={false} />
            </mesh>
            <pointLight color="#62e6ff" intensity={1.2} distance={2.4} />
          </group>
        ))}
        <pointLight color="#73fff1" intensity={1.5} distance={4} />
        </group>}
      </group>
      <mesh ref={beamRef} visible={false}>
        <cylinderGeometry args={[0.055, 0.055, 1, 8]} />
        <meshBasicMaterial color="#82fff1" transparent opacity={0.72} toneMapped={false} />
      </mesh>
    </>
  )
}

export default BujjiCompanion
