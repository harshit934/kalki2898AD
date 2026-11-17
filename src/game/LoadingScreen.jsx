import MissionArtwork from './MissionArtwork.jsx'
import { CAMPAIGN_MISSIONS } from './campaignSystem.js'

export default function LoadingScreen({ mission = CAMPAIGN_MISSIONS[0], artworkOnly = false }) {
  const chapter = mission ?? CAMPAIGN_MISSIONS[0]
  if (artworkOnly) return <MissionArtwork mission={chapter} />
  return <section className="journey-loading" aria-label="Loading mission"><div className="journey-loading-art"><MissionArtwork mission={chapter} /></div><div className="journey-loading-copy"><p className="eyebrow">KALKI / MISSION {chapter.number}</p><h1>{chapter.title}</h1><p>{chapter.region}</p><div className="loading-line" /><p role="status">Preparing the scene…</p><small>Captured in-game scene · Gameplay begins when the scene is ready.</small></div></section>
}
