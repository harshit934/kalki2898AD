import { implemented } from './responses.js'
const record = value => Boolean(value && typeof value === 'object' && !Array.isArray(value))
const ids = value => [...new Set(Array.isArray(value) ? value.filter(x => typeof x === 'string') : [])]
export const missionLabel = id => /^mission-\d+$/.test(id) ? `Mission ${Number(id.slice(8))}` : String(id)
const list = values => values.length ? values.map(missionLabel).join(', ') : 'none'
const rewardText = row => Object.entries(row).map(([key,value]) => `${key}: ${value}`).join(', ') || 'amounts unknown (no valid reward entry)'

// This adapter never normalizes/persists saves or infers unlocks/completion from briefings.
export function buildProgress(campaign = {}, catalogue = [], seenBriefings = [], profiles = {}, live = {}) {
  const rows = Array.isArray(catalogue) ? catalogue : []
  const known = new Set(rows.map(m => m.id))
  const supported = rows.filter(m => implemented(m.id) && m.playable === true).map(m => m.id)
  const eligible = new Set(supported), rawCompleted = ids(campaign.completedMissionIds), rawUnlocked = ids(campaign.unlockedMissionIds)
  const completed = supported.filter(id => rawCompleted.includes(id))
  const unlockedAvailable = supported.filter(id => rawUnlocked.includes(id))
  const excludedCompletion = rawCompleted.filter(id => !eligible.has(id))
  const unlockedUnavailable = rawUnlocked.filter(id => !eligible.has(id))
  const next = unlockedAvailable.find(id => !completed.includes(id)) ?? null
  const warnings = []
  if (!Array.isArray(campaign.completedMissionIds)) warnings.push('Completion history is missing; no completed mission is inferred.')
  if (!Array.isArray(campaign.unlockedMissionIds)) warnings.push('Unlock history is missing; availability is not inferred from briefing or reward data.')
  if (!record(campaign.rewards)) warnings.push('Reward history is missing; amounts are unknown, not zero.')
  const rewards = {}, unattributedRewards = [], totalsByKey = {}
  for (const [id, input] of Object.entries(record(campaign.rewards) ? campaign.rewards : {})) {
    const valid = Object.fromEntries(Object.entries(record(input) ? input : {}).filter(([key,value]) => !['__proto__','constructor','prototype'].includes(key) && typeof value === 'number' && Number.isFinite(value) && value >= 0))
    if (!record(input) || Object.keys(valid).length !== Object.keys(input).length) warnings.push(`Invalid or incomplete reward data for ${missionLabel(id)}; invalid values ignored.`)
    if (completed.includes(id)) {
      rewards[id] = valid
      for (const [key,value] of Object.entries(valid)) totalsByKey[key] = (Object.hasOwn(totalsByKey,key) ? totalsByKey[key] : 0) + value
    } else unattributedRewards.push({id, values:valid, reason:eligible.has(id) ? 'no recorded completion' : 'unavailable or unknown route'})
  }
  for (const id of completed) if (!Object.hasOwn(rewards,id)) warnings.push(`No reward entry for recorded ${missionLabel(id)}; amounts unknown.`)
  const currentId = typeof campaign.selectedMissionId === 'string' ? campaign.selectedMissionId : 'unknown'
  const current = { id:currentId, implemented:eligible.has(currentId), unlocked:rawUnlocked.includes(currentId), savedComplete:completed.includes(currentId), playing:campaign.isPlaying === true }
  current.status = !current.implemented ? (known.has(currentId) ? 'planned or paused; unavailable' : 'unknown route; unavailable') : !current.unlocked ? 'implemented but locked' : current.playing ? (live.gameOver ? 'attempt ended' : current.savedComplete ? 'replay active' : 'attempt active') : current.savedComplete ? 'completion recorded; not running' : 'available; not running'
  return {current, supported, completed, unlockedAvailable, unlockedUnavailable, excludedCompletion, next,
    rewards, unattributedRewards, totalsByKey, warnings, plannedCount:rows.filter(m=>!eligible.has(m.id)).length,
    seenBriefings:ids(seenBriefings).filter(id=>eligible.has(id)),
    milestones:supported.filter(id=>Number(id.slice(8))%10===0 && profiles[id]).map(id=>({id,number:Number(id.slice(8)),name:profiles[id].name,complete:completed.includes(id)}))}
}

export function progressAnswer(progress, topic = 'progress', number = 10) {
  const p = progress, facts = [], reviewStatus = 'PENDING FLUENT-SPEAKER REVIEW'
  if (topic !== 'recap') {
    facts.push(`Recorded completed playable missions (${p.completed.length}): ${list(p.completed)}.`,
      `Current mission: ${missionLabel(p.current.id)} — ${p.current.status}.`,
      `Unlocked and available (including replays): ${list(p.unlockedAvailable)}.`,
      `Next unfinished available mission: ${p.next ? missionLabel(p.next) : 'none currently unlocked and implemented'}.`,
      `Progress basis: ${p.completed.length}/${p.supported.length} implemented routes have recorded completion; this is not completion of the full campaign.`,
      `Planned or paused catalogue entries: ${p.plannedCount}; not treated as completed or playable.`,
      `Briefings marked seen (completed or skipped, not mission completion): ${list(p.seenBriefings)}.`)
    for (const id of p.completed) facts.push(`${missionLabel(id)} recorded rewards — ${rewardText(p.rewards[id] ?? {})}.`)
    facts.push(`Known totals by saved reward key: ${rewardText(p.totalsByKey)}. These are recorded awards, not a spendable balance.`)
    if (p.unlockedUnavailable.length) facts.push(`Unlocked references that are unavailable: ${list(p.unlockedUnavailable)}; no launch is offered.`)
    if (p.excludedCompletion.length) facts.push(`Saved references excluded from completed gameplay: ${list(p.excludedCompletion)} (unavailable or unknown).`)
    for (const r of p.unattributedRewards) facts.push(`Unattributed reward record for ${missionLabel(r.id)} — ${rewardText(r.values)}; ${r.reason}, not credited to completion totals.`)
    facts.push(...p.warnings)
    return {facts, en:'Here is what your current campaign records actually establish. An unlocked chapter can still be unbuilt; a viewed briefing is not a completed mission.', te:null, reviewStatus}
  }
  const milestone = p.milestones.find(m=>m.number===number)
  if (!milestone) return {facts:['This milestone is not supported by the existing implemented encounters.'], en:'No recap is available; no completion or future event is inferred.',te:null,reviewStatus}
  if (!milestone.complete) return {facts:[`${missionLabel(milestone.id)}: no accepted completion record.`, `Availability: ${p.unlockedAvailable.includes(milestone.id)?'unlocked and implemented':'not currently available to play'}.`], en:'There is no completion recap to tell yet. Future encounters, events and rewards are not described.',te:null,reviewStatus}
  const arcIds = Array.from({length:10},(_,i)=>`mission-${number-9+i}`), history = arcIds.filter(id=>p.completed.includes(id)), missing = arcIds.filter(id=>!p.completed.includes(id)), unavailable = arcIds.filter(id=>!p.supported.includes(id))
  facts.push(`${missionLabel(milestone.id)} — recorded local encounter completion: ${milestone.name}.`,
    `Recorded history in this ten-mission range: ${list(history)}.`,
    `No accepted completion history for: ${list(missing)}.`,
    `Unimplemented or paused chapters in this range: ${list(unavailable)}.`)
  for (const id of history) facts.push(`${missionLabel(id)} recorded rewards — ${rewardText(p.rewards[id] ?? {})}.`)
  facts.push('The save does not record attack-by-attack events, story choices or cinematic viewing; those details cannot be verified from completion IDs.',
    'Current story position: the recorded local challenge is cleared. Missing chapters and intervening story events are not inferred.',
    `Next unfinished available mission: ${p.next?missionLabel(p.next):'none currently unlocked and implemented'}.`)
  if (number===100) facts.push('A Mission 100 record is not proof that all 100 chapters are complete. No later mission or sequel outcome is implied.')
  facts.push(...p.warnings)
  return {facts,en:`Your ${missionLabel(milestone.id)} record confirms this encounter, not a complete history of the preceding chapters. Here are the recorded rewards and the gaps we must leave unknown.`,te:null,reviewStatus}
}
