// Story presentation requires an authored boundary or an explicit player replay.
export function allowsStoryPresentation(placement) {
  return ['mission-opening', 'mission-ending', 'explicit-replay'].includes(placement)
}
