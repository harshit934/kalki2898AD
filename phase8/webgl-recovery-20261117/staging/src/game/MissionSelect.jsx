import { EXPANSION_MISSIONS } from './missionExpansionContent.js'
import { useState } from 'react'
import { CAMPAIGN_MISSIONS, useCampaignState } from './campaignSystem.js'
import MissionEntryClip from './MissionEntryClip.jsx'
import { BATCH_CONTENT, batchMission } from './chapters/batch20Content.js'
import MissionArtwork from './MissionArtwork.jsx'
import{environmentCapture}from'./phase54e/environmentViews.js'

function MissionSelect({ onStart, onBack }) {
  const completedMissionIds = useCampaignState((state) => state.completedMissionIds)
  const unlockedMissionIds = useCampaignState((state) => state.unlockedMissionIds)
  const rewards = useCampaignState((state) => state.rewards)
  const selectedMissionId = useCampaignState((state) => state.selectedMissionId)
  const [arc, setArc] = useState(() => CAMPAIGN_MISSIONS.find(m=>m.id===selectedMissionId)?.arc ?? 1)
  const [previewClip, setPreviewClip] = useState(null)
  const visibleMissions = CAMPAIGN_MISSIONS.filter((mission) => mission.arc === arc)
  const completedCount = CAMPAIGN_MISSIONS.filter((mission) => completedMissionIds.includes(mission.id)).length

  return (
    <section className="campaign-screen" aria-labelledby="campaign-title" style={{'--campaign-view':`url("${environmentCapture("city-wide")}")`}}>
      <div className="campaign-panel">
        <button className="campaign-back" onClick={onBack}>← MAIN MENU</button>
        <p className="campaign-kicker">KALKI // 100 CHAPTER STORY ARCHIVE</p>
        <h1 id="campaign-title">Choose your <em>horizon.</em></h1>
        <p className="campaign-intro">
          {completedCount} / 100 chapters complete · {CAMPAIGN_MISSIONS.filter(m=>m.playable).length} implemented/candidate routes · {CAMPAIGN_MISSIONS.filter(m=>!m.playable).length} planned chapters.
        </p>
        <div className="arc-tabs" role="group" aria-label="Story arc">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((item) => <button key={item} type="button" aria-pressed={arc === item} className={arc === item ? 'active' : ''} onClick={() => setArc(item)}>
            <span>ARC {String(item).padStart(2, '0')}</span><strong>{CAMPAIGN_MISSIONS.find((m) => m.arc === item)?.arcName}</strong>
          </button>)}
        </div>
        <div className="arc-heading"><p className="eyebrow">CHAPTERS {String((arc-1)*10+1).padStart(2,'0')}—{arc*10}</p><h2>{visibleMissions[0]?.arcName}</h2><p>{visibleMissions[0]?.region.split(' // ')[0]} <span> / {arc===1?'PLAYABLE CONTRACTS':'STORY PLAN / ARC-FINAL DUEL IMPLEMENTED'}</span></p></div>
        <p className="archive-scroll-cue">↓ Scroll for more missions · Swipe the arc rail to explore all 10 arcs</p>
        <div className="mission-list" key={arc}>
          {visibleMissions.map((mission) => {
            const unlocked = unlockedMissionIds.includes(mission.id)
            const completed = completedMissionIds.includes(mission.id)
            const playable = unlocked && mission.playable
            const missionRewards = rewards[mission.id] ?? {}
            const savedReward = Object.values(missionRewards).reduce(
              (total, amount) => total + amount,
              0,
            )

            return (
              <article
                className={`mission-card${selectedMissionId === mission.id ? ' selected' : ''}${!unlocked ? ' locked' : ''}`}
                key={mission.id}
              >
                <div className="mission-art"><MissionArtwork mission={mission} /><span className="art-caption">{mission.playable?'IN-GAME VIEW':'STORY PLAN'} / {mission.number}</span></div>
                <div className="mission-card-body">
                <div className="mission-card-heading">
                  <span className="mission-number">MISSION {mission.number}</span>
                  <span className={`mission-status${completed ? ' complete' : ''}`}>
                    {completed
                      ? 'COMPLETE'
                      : unlocked
                        ? playable
                          ? 'AVAILABLE'
                          : 'UNLOCKED · STORY PLAN'
                        : mission.playable ? 'LOCKED' : 'LOCKED · PLANNED'}
                  </span>
                </div>
                <p className="mission-region">{mission.region}</p>
                <h2>{mission.title}</h2>
                <p className="mission-description">{mission.description}</p>
                <p className="mission-description">{mission.implementation}</p>
                <p className="mission-boss">{mission.playable ? `BOSS ENCOUNTER / ${mission.id === 'mission-1' ? 'Arena Warden' : mission.id === 'mission-2' ? 'Prism Sovereign' : EXPANSION_MISSIONS[mission.id]?.bossName ?? 'Encounter'}` : 'STORY CHAPTER / ENCOUNTER NOT IMPLEMENTED'}</p>
                <p className="mission-reward">{mission.playable ? 'REWARDS · COMBAT SCORE + NEXT CHAPTER ACCESS' : 'REWARDS · TO BE DEFINED'}</p>
                {completed && (
                  <p className="mission-reward">
                    SAVED REWARDS · {savedReward.toLocaleString()} SCORE
                  </p>
                )}
                {playable ? (
                  <button
                    className="mission-action"
                    type="button"
                    aria-pressed={selectedMissionId === mission.id}
                    onClick={() => {
                      useCampaignState.getState().selectMission(mission.id)
                      onStart()
                    }}
                  >
                    {completed ? 'REPLAY MISSION' : 'BEGIN MISSION'}
                  </button>
                ) : (
                  <button className="mission-action" type="button" disabled>
                    {!mission.playable ? 'PLANNED · NOT YET PLAYABLE' : `COMPLETE MISSION ${String(Number(mission.number) - 1).padStart(2, '0')} TO UNLOCK`}
                  </button>
                )}
                {mission.entryClip && (
                  <button className="mission-action" type="button" onClick={() => setPreviewClip(mission.entryClip)}>
                    WATCH {mission.entryClip.title.toUpperCase()}
                  </button>
                )}
                </div>
              </article>
            )
          })}
        </div>
        <p className="campaign-footer">100 CHAPTER DESIGNS · 10 ARCS · {CAMPAIGN_MISSIONS.filter((mission) => mission.playable).length} IMPLEMENTED COMBAT CHAPTERS</p>
      </div>
      {previewClip && <MissionEntryClip clip={previewClip} onSkip={() => setPreviewClip(null)} />}
    </section>
  )
}

export default MissionSelect
