// Pure read-only facts and authored wording. Telugu is draft, pending fluent review.
export const implemented = id => /^mission-(?:[1-9]|10|[2-9]0|100)$/.test(id)
export function contextFrom({campaign, game, combat, boss, story, enemyIds}) {
  const id = campaign.selectedMissionId
  const completed = [...new Set(campaign.completedMissionIds.filter(implemented))]
  const rewards = Object.fromEntries(Object.entries(campaign.rewards[id] ?? {}).filter(([,v])=>Number.isFinite(v)&&v>=0))
  return {id, available:implemented(id), playing:campaign.isPlaying, completed, savedComplete:completed.includes(id),
    replay:campaign.isPlaying&&completed.includes(id), rewards, health:game.health, gameOver:game.gameOver,
    enemiesRemaining:enemyIds.filter(e=>!combat.defeatedEnemyIds.includes(e)),
    bossStatus:boss.status, bossHealth:boss.health, phase:boss.phase, relic:boss.relicCollected,
    round:game.roundId, scans:story.scanned.length}
}
export function answer(c, topic='objective') {
  if (!c.available || c.id!=='mission-1') return {facts:['This milestone supports Mission 1 only. Planned and paused activities are not available through the assistant.'],te:'ఈ సహాయం మొదటి మిషన్‌కు మాత్రమే అందుబాటులో ఉంది.',en:'Select an existing Mission 1 route to ask for guidance.'}
  const facts=[`Mission: ${c.id}.`, `Saved completion: ${c.savedComplete?'recorded':'not recorded'}.`, `Current attempt: ${c.replay?'replay':c.playing?'active':'not running'}.`]
  let te,en
  const remaining=`Patrols remaining: ${c.enemiesRemaining.length}. Boss state: ${c.bossStatus}. Relic: ${c.relic?'collected':'not collected'}. Optional relays scanned: ${c.scans}/3.`
  const objective=c.gameOver?'This attempt ended. Use the existing restart control.':c.relic?'The relic is collected. Allow the ending and completion presentation to finish.':c.bossStatus==='defeated'?'Collect the relic after the encounter becomes ready.':c.bossStatus==='active'?'Face the Warden; watch its attack wind-up.':c.bossStatus==='intro'?'The boss introduction is underway.':c.enemiesRemaining.length?'Clear the remaining patrols, then approach the arena.':'Approach the arena for the Warden encounter.'
  if(topic==='initial') {te='ముందుగా కాపలాదారులను ఓడించు. తర్వాత కాపలాదారుల నాయకుడిని ఎదుర్కొని అవశేషాన్ని సేకరించు.';en='Clear the patrols, face the Warden, then collect the relic. Crystals and relay scans are optional.';facts.push(remaining)}
  else if(topic==='combat') {facts.push(`Current health: ${c.health}.`, `Boss phase: ${c.phase}.`);te='దెబ్బకు ముందు శత్రువు కదలికను గమనించు. తొందరపడకుండా సరైన సమయంలో ఎదురుదాడి చేయి.';en=c.health<=30?'Health is low. Create distance and read the wind-up before countering.':c.bossStatus==='active'?'Read the Warden’s wind-up; evade or guard, then counter during recovery.':'Watch the patrol’s wind-up, guard or evade, then counter. Advice does not change combat rules.'}
  else if(topic==='completion'||topic==='replay') {facts.push(`Recorded rewards: ${Object.entries(c.rewards).map(([k,v])=>`${k}: ${v}`).join(', ')||'none'}.`);te='పూర్తయిన పనులు, బహుమతులు సేవ్‌లో ఉన్న వివరాల ప్రకారమే చూపిస్తున్నాను.';en=c.savedComplete?(c.replay?'A previous completion is recorded. This is a replay; the saved rewards are not a promise of another payout.':'A completion is recorded. The facts list shows actual saved rewards.'):'No saved completion is recorded. Defeating the boss alone does not establish saved completion.';facts.push(remaining)}
  else {facts.push(remaining);te='మిగిలిన లక్ష్యాలను చూసి ముందుకు సాగు. అవశేషాన్ని సేకరించే వరకు పని ముగియదు.';en=objective}
  return {facts,te,en}
}
// Fixture-facing only: never adds campaign content or unlocks routes.
export function tenthRecap(campaign, number=10) {
  const id=`mission-${number}`, recorded=[...new Set(campaign.completedMissionIds.filter(implemented))]
  const completed=recorded.includes(id)
  return {eligible:implemented(id)&&number%10===0&&completed, recorded, missingHistory:Array.from({length:10},(_,i)=>`mission-${number-9+i}`).filter(x=>!recorded.includes(x)),
    text:completed?`Recorded completion: ${id}. Only these completed routes are confirmed: ${recorded.join(', ')}. Missing chapters are not narrated as completed.`:'No completion recap: this encounter has no recorded completion.'}
}
