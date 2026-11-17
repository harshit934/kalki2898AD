import { create } from 'zustand'
import { BATCH_CONTENT } from './batch20Content.js'
import { useCampaignState } from '../campaignSystem.js'
import { batchChoose, batchInteract } from './batch20Content.js'
let current = null
export const useBatch20 = create(() => ({ snapshot: null }))
export function publishBatch(run) {
  current = run
  if(run.completed && !run.rewardSaved) run.rewardSaved=useCampaignState.getState().completeMission(run.id,'activity',BATCH_CONTENT[run.id].reward)
  useBatch20.setState({ snapshot: { ...run, crossed: [...run.crossed] } })
}
export function releaseBatch(run) {
  if (current !== run) return
  current = null
  useBatch20.setState({ snapshot: null })
}
export function interactBatch(player) {
  if (!current) return false
  const result = batchInteract(current, player)
  publishBatch(current)
  return result
}
export function chooseBatch(player, choice) {
  if (!current) return false
  const result = batchChoose(current, player, choice)
  publishBatch(current)
  return result
}
export function closeBatchPanel() {
  if (!current) return
  current.panel = null
  publishBatch(current)
}
