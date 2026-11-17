import { useCampaignState, CAMPAIGN_MISSIONS } from '../campaignSystem.js'
import { useGameplayState } from '../gameplayStore.js'
import { useCombatState, getEnemySpawns } from '../combatSystem.js'
import { useBossState } from '../bossSystem.js'
import { useMissionOneStory } from '../missionOneStory.js'
import { useStoryProgress } from '../storyProgress.js'
import { ARC_BOSSES } from '../phase54e/arcBosses.js'
import { contextFrom } from './responses.js'
import { buildProgress } from './progress.js'
export function readAssistantContext() {
  const campaign=useCampaignState.getState(), game=useGameplayState.getState(), story=useMissionOneStory.getState(), combat=useCombatState.getState()
  const safeCampaign={...campaign,completedMissionIds:Array.isArray(campaign.completedMissionIds)?campaign.completedMissionIds:[],rewards:campaign.rewards&&typeof campaign.rewards==='object'?campaign.rewards:{}}
  const base=contextFrom({campaign:safeCampaign,game,combat:{...combat,defeatedEnemyIds:combat.defeatedEnemyIds??[]},boss:useBossState.getState(),story:{...story,scanned:story.scanned??[]},enemyIds:getEnemySpawns(campaign.selectedMissionId).map(e=>e.id)})
  return {...base,progress:buildProgress(campaign,CAMPAIGN_MISSIONS,useStoryProgress.getState().seenBriefings,ARC_BOSSES,game)}
}
