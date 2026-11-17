import { batchMission } from './chapters/batch20Content.js'
import Batch20Hud from './chapters/Batch20Hud.jsx'
import { arcBossFor } from './phase54e/arcBosses.js'
import VictoryActions from './VictoryActions.jsx'
import { useCallback, useState, useEffect } from 'react'
import { useVisualSettings } from './visualSettings.js'
import { setGameTimeout, clearGameTimeout } from './gameClock.js'
import { TOTAL_CRYSTALS } from './missionOneCrystals.js'
import { useGameplayState } from './gameplayStore.js'
import { getEnemySpawns, MISSION_TWO_ENEMY_SPAWNS, useCombatState } from './combatSystem.js'
import { getBossMaxHealth, useBossState } from './bossSystem.js'
import { CAMPAIGN_MISSIONS, useCampaignState } from './campaignSystem.js'
import { MISSION_TWO_CRYSTALS, MISSION_TWO_PYLONS } from './missionTwoContent.js'
import { useCompanionState } from './companionSystem.js'
import { EXPANSION_MISSIONS } from './missionExpansionContent.js'
import MissionEntryClip from './MissionEntryClip.jsx'
import { useMissionTwoSequence } from './missionTwoSequence.js'
import { useMissionOneStory } from './missionOneStory.js'
import MissionOneObjectives, { MissionOneScanPrompt } from './MissionOneObjectives.jsx'

const MISSION_COMPLETE_CLIP = {
  src: '/videos/mission-complete.mp4',
  title: 'Mission complete cinematic',
}

function GameHud({ onContinue, onBriefing, onContract, onMenu }) {
  const hudMode=useVisualSettings(s=>s.hud)
  const [objectiveOpen,setObjectiveOpen]=useState(false)
  const [statusOpen,setStatusOpen]=useState(false)
  const [settledUpdate,setSettledUpdate]=useState(null)
  const missionId = useCampaignState((state) => state.selectedMissionId)
  const missionTwo = missionId === 'mission-2'
  const contractCompleted = useMissionTwoSequence(state => state.completed)
  const expansionMission = EXPANSION_MISSIONS[missionId]
  const maxPlayerHealth = missionTwo || missionId === 'mission-3' ? 150 : 100
  const health = useGameplayState((state) => state.health)
  const healthPercent = Math.round((health / maxPlayerHealth) * 100)
  const score = useGameplayState((state) => state.score)
  const crystalCount = useGameplayState((state) => state.collectedCrystalIds.length)
  const overdriveCharges = useGameplayState((state) => state.overdriveCharges)
  const overdriveActive = useGameplayState((state) => state.isOverdriveActive())
  const companionStatus = useCompanionState((state) => state.status)
  const damagedAt = useGameplayState((state) => state.damagedAt)
  const gameOver = useGameplayState((state) => state.gameOver)
  const combatTarget=useCombatState(s=>s.targetEnemyId)
  const updateKey=`${score}/${crystalCount}/${overdriveCharges}/${damagedAt}`
  const recentUpdate=settledUpdate!==updateKey
  useEffect(()=>{const timer=setGameTimeout(()=>setSettledUpdate(updateKey),4200);return()=>clearGameTimeout(timer)},[updateKey])
  const totalEnemyCrystalsSpawned = useCombatState(
    (state) => state.totalEnemyCrystalsSpawned,
  )
  const totalCrystals = (missionTwo ? MISSION_TWO_CRYSTALS.length : TOTAL_CRYSTALS) +
    totalEnemyCrystalsSpawned
  const bossStatus = useBossState((state) => state.status)
  const bossHealth = useBossState((state) => state.health)
  const bossPhase = useBossState((state) => state.phase)
  const bossAttack = useBossState(state=>state.attack?.type)
  const victoryReady = useBossState((state) => state.victoryReady)
  const bossRoundId = useBossState((state) => state.roundId)
  const endingRound = useMissionOneStory(s=>s.endingRound)
  const [watchedRoundId, setWatchedRoundId] = useState(null)
  const finishVictoryClip = useCallback(() => setWatchedRoundId(bossRoundId), [bossRoundId])
  const victoryDismissed = useBossState((state) => state.victoryDismissed)
  const relicCollected = useBossState((state) => state.relicCollected)
  const nextMissionUnlocked = useCampaignState((state) => {
    const nextMissionId = `mission-${Number(missionId.replace('mission-', '')) + 1}`
    return state.unlockedMissionIds.includes(nextMissionId)
  })
  const missionIndex = CAMPAIGN_MISSIONS.findIndex(({ id }) => id === missionId)
  const nextMission = CAMPAIGN_MISSIONS.slice(missionIndex + 1).find(item => item.playable && useCampaignState.getState().unlockedMissionIds.includes(item.id))
  const unlockedMissionIds = useCampaignState((state) => state.unlockedMissionIds)
  const availableNextMission = nextMission && unlockedMissionIds.includes(nextMission.id) ? nextMission : null
  const displayMissionNumber = String(Number(missionId.split('-').at(-1))).padStart(2, '0')
  const nextMissionNumber = nextMission ? String(Number(nextMission.number)).padStart(2, '0') : null
  const activatedPylonIds = useGameplayState((state) => state.activatedPylonIds)
  const missionObjectiveIds = useGameplayState((state) => state.missionObjectiveIds)
  const defeatedEnemyIds = useCombatState((state) => state.defeatedEnemyIds)
  const expansionObjectivesComplete = Boolean(expansionMission) && expansionMission.objectives.every(({ id }) => missionObjectiveIds.includes(id))
  const expansionEnemiesComplete = Boolean(expansionMission) && getEnemySpawns(missionId).every(({ id }) => defeatedEnemyIds.includes(id))
  const bossName = arcBossFor(missionId)?.name ?? expansionMission?.bossName ?? (missionTwo ? 'PRISM SOVEREIGN' : 'ARENA WARDEN')
  const bossMaxHealth = getBossMaxHealth(missionId)
  const showBossHealth = bossStatus === 'intro' || bossStatus === 'active'
  const victoryPending = bossStatus === 'defeated' && victoryReady && relicCollected && !victoryDismissed && !gameOver
  const showVictory = victoryPending && (missionId==='mission-1' ? endingRound===bossRoundId : watchedRoundId === bossRoundId)
  const lowHealth = health <= 35
  const healthPulse = damagedAt > 0
  const combatVisible=Boolean(combatTarget)||showBossHealth||lowHealth||overdriveActive
  const showStatus=hudMode==='full'||statusOpen||recentUpdate||combatVisible

  return (
    <>
      {batchMission(missionId) && <Batch20Hud id={missionId} onContinue={onContinue} />}
      {missionId==='mission-1' && !gameOver && !victoryPending && <MissionOneScanPrompt />}
      <section
        className={`game-hud ${batchMission(missionId)?'batch54f-active':''} hud-${hudMode}${combatVisible?' in-combat':''}${showBossHealth || showVictory ? ' boss-mode' : ''}`}
        aria-label="Gameplay status"
      >
          <div className="mission-objective">
            <button className="hud-objective-toggle" aria-expanded={objectiveOpen} aria-controls="hud-objective-details" onClick={()=>setObjectiveOpen(!objectiveOpen)}>OBJECTIVES <span aria-hidden="true">{objectiveOpen?'−':'+'}</span></button>
            <div className="objective-details" id="hud-objective-details" hidden={!objectiveOpen}>
            {missionTwo && contractCompleted && <p className="hud-label">BOUNTY CLEARED · MAIN OBJECTIVES REMAIN</p>}
            {missionId==='mission-1' && <MissionOneObjectives />}
            <strong>
              {missionTwo ? 'RESONANCE PYLONS' : expansionMission?.objectiveLabel ?? 'CRYSTALS'}{' '}
              <span>{missionTwo
                ? `${activatedPylonIds.length} / ${MISSION_TWO_PYLONS.length}`
                : expansionMission ? `${missionObjectiveIds.filter((id) => expansionMission.objectives.some((objective) => objective.id === id)).length} / ${expansionMission.objectives.length}` : `${crystalCount} / ${totalCrystals}`}</span>
            </strong>
            <strong>
              {missionTwo ? 'GLASS SENTINELS' : 'PURSUERS'} <span>{defeatedEnemyIds.filter((id) =>
                getEnemySpawns(missionId).some((enemy) => enemy.id === id),
              ).length} / {getEnemySpawns(missionId).length}</span>
            </strong>
            <span className="objective-next">
              {missionTwo
                ? activatedPylonIds.length === MISSION_TWO_PYLONS.length &&
                  MISSION_TWO_ENEMY_SPAWNS.every(({ id }) => defeatedEnemyIds.includes(id))
                  ? 'PRISM COURT UNSEALED · PROCEED'
                  : 'SYNCHRONIZE ALL PYLONS AND CLEAR THE DEFENDERS'
                : !expansionMission ? 'CLEAR THE THREE PATROLS, DEFEAT THE WARDEN AND COLLECT THE RELIC' : expansionObjectivesComplete && (missionId === 'mission-3' || expansionEnemiesComplete)
                  ? 'ROUTE CLEARED · ADVANCE TO THE BOSS ARENA'
                  : expansionMission.objectiveNext}
            </span>
            <button className="hud-briefing" onClick={onBriefing}>Bujji · mission briefing</button>
            {onContract&&<button className="hud-briefing" onClick={onContract}>{contractCompleted?'Replay bounty contract + chase':'Bounty contract + ground chase'}</button>}
            </div>
          </div>
        <div className="hud-vitals">
        <div className={`health-status${lowHealth ? ' critical' : ''}${healthPulse ? ' damaged' : ''}`}>
          {damagedAt>0&&<span key={damagedAt} className="health-damage-pulse" aria-hidden="true"/>}
          <div className="hud-label-row">
            <span className="hud-label">BHAIRAVA</span>
            <span className={`health-value${lowHealth ? ' critical' : ''}`}>{Math.ceil(health)} / {maxPlayerHealth}</span>
          </div>
          <div
            className="health-track"
            role="progressbar"
            aria-label="Player health"
            aria-valuemin={0}
            aria-valuemax={maxPlayerHealth}
            aria-valuenow={health}
          >
            <span className={`health-fill${lowHealth ? ' low-health' : ''}`} style={{ width: `${healthPercent}%` }} />
          </div>
        </div>
        <div className="hud-small-status" hidden={!showStatus}>
        <div className="score-status" aria-label="Crystals" hidden={hudMode==='minimal'&&!statusOpen&&!recentUpdate}>
          <span className="hud-label">CRYSTALS</span>
          <strong>{crystalCount}<span> / {totalCrystals}</span></strong>
        </div>
        <div className="score-status" aria-label="Score" hidden={hudMode==='minimal'&&!statusOpen&&!recentUpdate}>
          <span className="hud-label">TOTAL SCORE</span>
          <strong>{String(score).padStart(5, '0')}</strong>
        </div>
        <div className="overdrive-status" aria-live="polite">
          <span className="overdrive-icon" aria-label="Overdrive" title="Overdrive">ϟ</span>
          <span className="overdrive-caption">OVERDRIVE<small>B / BOOST</small></span><strong>{overdriveActive ? 'ACTIVE' : `${overdriveCharges}/3`}</strong>
        </div>
        <div className="score-status companion-indicator" hidden={hudMode!=='full'&&!statusOpen&&companionStatus!=='assisting'} aria-live="polite" aria-label="Bujji companion status">
          <span className="hud-label">BUJJI AI</span>
          <strong>{arcBossFor(missionId)&&showBossHealth?'DUEL OBSERVER':companionStatus === 'assisting' ? 'SUPPORT PULSE' : 'ESCORTING'}</strong>
        </div>
        </div>
        <button className="hud-status-toggle" aria-expanded={statusOpen} onClick={()=>setStatusOpen(!statusOpen)}>{statusOpen?'LESS':'STATUS'}</button>
        </div>
      </section>

      {showBossHealth && (
        <section className={`boss-health-hud phase-${bossPhase}`} aria-label="Boss status">
          <div className="boss-health-heading">
            <span>{bossName}</span>
            <span>{bossStatus === 'intro' ? '1v1 / ENCOUNTER READYING' : `PHASE ${bossPhase} / 3`}</span>
          </div>
          <div
            className="boss-health-track"
            role="progressbar"
            aria-label="Boss health"
            aria-valuemin={0}
            aria-valuemax={bossMaxHealth}
            aria-valuenow={bossHealth}
          >
            <span className={`boss-health-fill phase-${bossPhase}`} style={{ width: `${(bossHealth / bossMaxHealth) * 100}%` }} />
          </div>
          <div className="boss-health-value"><span>{Math.ceil(bossHealth)} / {bossMaxHealth}</span>{arcBossFor(missionId)&&<span className="boss-attack-label">{bossAttack?bossAttack.replaceAll('-',' '):bossStatus==='intro'?arcBossFor(missionId).subtitle:'Watch the wind-up · counter the recovery'}</span>}</div>
        </section>
      )}

      {damagedAt > 0 && !gameOver && (
        <>
          <div key={damagedAt} className="damage-flash" aria-hidden="true" />
          <div key={`${damagedAt}-label`} className={`damage-indicator${lowHealth ? ' critical' : ''}`} aria-live="polite">
            {lowHealth ? 'CRITICAL' : 'DAMAGE'}
          </div>
        </>
      )}

      {bossStatus === 'defeated' && victoryReady && !relicCollected && !gameOver && (
        <section className="contract-status" role="status" aria-label="Relic objective">
          <strong>RELIC 0 / 1</strong>
          <p>Recover the glowing relic beside the fallen boss to finish the mission.</p>
          <small>Move close to collect it. Your boss reward is already saved.</small>
        </section>
      )}
        {missionId!=='mission-1' && victoryPending && !showVictory && (
        <MissionEntryClip clip={MISSION_COMPLETE_CLIP} onSkip={finishVictoryClip} />
      )}
      {showVictory && (
        <section className="game-over-screen victory-screen" role="dialog" aria-modal="true" aria-labelledby="victory-title">
          <div className="game-over-card victory-card">
            <p className="game-over-kicker">{missionTwo ? 'RESONANCE RESTORED' : 'THREAT NEUTRALIZED'}</p>
            <h2 id="victory-title">
              {missionTwo ? <>THE GLASS<br />WASTES FALL</> : expansionMission ? <>MISSION {displayMissionNumber}<br />COMPLETE</> : <>THE ARENA<br />IS YOURS</>}
            </h2>
            <div className="final-score">
              <span>FINAL SCORE</span>
              <strong>{String(score).padStart(5, '0')}</strong>
            </div>
            <p className="final-crystals">
              {`MISSION ${displayMissionNumber} COMPLETE${nextMissionUnlocked && nextMissionNumber ? ` · MISSION ${nextMissionNumber} UNLOCKED` : ''} · ${relicCollected ? 'RELIC 1 / 1 RECOVERED' : 'RELIC 0 / 1'}`}
            </p>
            <VictoryActions onContinue={onContinue} nextMission={availableNextMission} />
          </div>
        </section>
      )}

      {bossStatus === 'defeated' && victoryDismissed && !gameOver && (
        <button
          className="campaign-return-button"
          type="button"
          onClick={() => useCampaignState.getState().returnToSelection()}
        >
          MISSION SELECT
        </button>
      )}

      {gameOver && (
        <section className="game-over-screen" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
          <div className="game-over-card">
            <p className="game-over-kicker">MISSION TERMINATED</p>
            <h2 id="game-over-title">
              {missionTwo ? <>THE WASTES<br />CLAIM ANOTHER</> : <>THE EXPANSE<br />CLAIMS ANOTHER</>}
            </h2>
            <div className="final-score">
              <span>FINAL SCORE</span>
              <strong>{String(score).padStart(5, '0')}</strong>
            </div>
            <p className="final-crystals">
              {crystalCount} OF {totalCrystals} ENERGY CRYSTALS RECOVERED
            </p>
            <button
              className="restart-button"
              type="button"
              onClick={() => useGameplayState.getState().restart()}
            >
              RESTART MISSION
            </button>
            <button className="restart-button restart-secondary" onClick={onMenu}>EXIT TO MENU</button>
            <p className="result-preservation">Completed missions and earned rewards are preserved.</p>
          </div>
        </section>
      )}
    </>
  )
}

export default GameHud
