import GraphicsBoundary from './game/GraphicsBoundary.jsx'
import { implemented as assistantImplemented } from './game/assistant/responses.js'
import BhairavaAssistant from './game/assistant/BhairavaAssistant.jsx'
import { batchMission } from './game/chapters/batch20Content.js'
import { useBatch20, interactBatch } from './game/chapters/batch20State.js'
import{arcBossFor}from'./game/phase54e/arcBosses.js'
import { cityEnabled, firstCity, prepareCityOpening, loadArena } from './game/phase54e/cityAssets.js'
import PauseMenu from './game/PauseMenu.jsx'
import MainMenu from './game/MainMenu.jsx'
import { usePauseState } from './game/pauseSystem.js'
import { useControlSettings } from './game/controlSettings.js'
import { setGameHold } from './game/gameClock.js'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import LoadingScreen from './game/LoadingScreen.jsx'
import { unlockAudio, stopDialogue, requireVerifiedMissionVoices } from './audio/audioManager.js'
import GameHud from './game/GameHud.jsx'
import { useBossState } from './game/bossSystem.js'
import { CAMPAIGN_MISSIONS, useCampaignState } from './game/campaignSystem.js'
import MissionSelect from './game/MissionSelect.jsx'
import MissionEntryClip from './game/MissionEntryClip.jsx'
import CombatNarrative from './game/CombatNarrative.jsx'
import CinematicOverlay from './game/cinematics/CinematicOverlay.jsx'
import { startCinematic, stopCinematic, useCinematic } from './game/cinematics/controller.js'
import { kashiEntry, hasSeenKashiEntry, markKashiEntrySeen } from './game/cinematics/kashiEntry.js'
import { missionOneCinematic } from './game/cinematics/example.js'
import { createStoryBriefing } from './game/cinematics/storyBriefing.js'
import StoryJournal from './game/StoryJournal.jsx'
import { useStoryProgress } from './game/storyProgress.js'
import { clearPlayerInput, consumePlayerInteract, usePlayerInput } from './game/player/playerInputStore.js'
import { useMissionOneStory } from './game/missionOneStory.js'
import { useMissionTwoSequence } from './game/missionTwoSequence.js'
import MissionTwoSequenceOverlay from './game/MissionTwoSequenceOverlay.jsx'
import { getPlayerWorldPosition, useGameplayState } from './game/gameplayStore.js'
import MobileControls from './game/player/MobileControls.jsx'
import './App.css'
import './game/visualIdentity.css'
import './game/compactHud.css'
import './game/menuViewport.css'
import './game/kashiRevision/loading.css'
import './game/ui54d.css'
import './game/phase54e/phase54e.css'
import { revisionOpening } from './game/kashiRevision/revisionOpening.js'
import EndingBoundsPreparation from './game/kashiRevision/EndingBoundsPreparation.jsx'
import { endingPreparationEnabled } from './game/kashiRevision/endingBounds.js'

const GameCanvas = lazy(() => import('./game/GameCanvas.jsx'))
let revisionPreparation
function prepareRevision() {
  if (!revisionPreparation) revisionPreparation = import('./game/kashiRevision/revisionAssets.js').then(m => m.prepareRevisionOpening()).catch(e => { revisionPreparation = null; throw e })
  return revisionPreparation
}

function App() {
  useEffect(() => { try { document.documentElement.dataset.interfaceMotion = localStorage.getItem('kalki-interface-motion') === 'reduced' ? 'reduced' : 'system' } catch { /* Default to system motion preference when storage is unavailable. */ } }, [])
  const assistantRoundId = useGameplayState(state => state.roundId)
  const bossStatus = useBossState((state) => state.status)
  const isPlaying = useCampaignState((state) => state.isPlaying)
  const selectedMissionId = useCampaignState((state) => state.selectedMissionId)
  const [missionIntroVisible, setMissionIntroVisible] = useState(false)
  const paused = usePauseState(state => state.paused)
  const touchMode = useControlSettings(state => state.touchMode)
  const [menuView, setMenuView] = useState('home')
  const [storyOpen, setStoryOpen] = useState(false)
  const [contractReady, setContractReady] = useState(false)
  const [sceneryPreparation, setSceneryPreparation] = useState(null)
  const sceneryRequest = useRef({ id: 0 }), sceneryRound = useRef(null)
  const preparationDialog = useRef(null)
  const cinematic = useCinematic(state => Boolean(state.session))
  useEffect(() => { requireVerifiedMissionVoices(true) }, [])
  const contract = useMissionTwoSequence(state => state.phase !== 'idle')
  const gameplayVisible = isPlaying && !missionIntroVisible && !cinematic && !storyOpen && !contract && !sceneryPreparation
  const activityFinished = useBatch20(s=>Boolean(s.snapshot?.completed && s.snapshot?.rewardSaved && s.snapshot?.id === selectedMissionId && s.snapshot?.round === useGameplayState.getState().roundId))
  const gameplayActive = gameplayVisible && !paused && !activityFinished
  useEffect(() => {
    const lifetime = sceneryRequest.current
    function ready(event) {
      if (sceneryRound.current === null || event.detail?.roundId !== sceneryRound.current || !useCampaignState.getState().isPlaying) return
      sceneryRound.current = null; clearPlayerInput(); setGameHold('revision-scenery', false); setSceneryPreparation(null)
    }
    window.addEventListener('kashi-revision-frame-ready', ready)
    return () => { lifetime.id++; setGameHold('revision-scenery', false); window.removeEventListener('kashi-revision-frame-ready', ready) }
  }, [])
  useEffect(() => { if (sceneryPreparation) preparationDialog.current?.querySelector('button')?.focus() }, [sceneryPreparation])

  useEffect(() => {
    function onEscape(event) {
      if (event.defaultPrevented || storyOpen || event.key !== 'Escape' || !isPlaying) return
      event.preventDefault()
      if (event.repeat) return
      usePauseState.getState().toggle()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [isPlaying, storyOpen])

  useEffect(() => {
    setGameHold('inactive', !isPlaying)
    if (!isPlaying) { usePauseState.getState().reset(); stopCinematic('mission-exit', true) }
    if (!isPlaying) useMissionTwoSequence.getState().reset()
  }, [isPlaying])

  function leaveMission(view) {
    sceneryRequest.current.id++; sceneryRound.current = null; setSceneryPreparation(null); setGameHold('revision-scenery', false)
    setContractReady(false)
    setGameHold('inactive', true)
    stopCinematic('mission-exit', true)
    stopDialogue()
    useMissionTwoSequence.getState().reset()
    setGameHold('story', false)
    setStoryOpen(false)
    usePauseState.getState().reset()
    setMissionIntroVisible(false)
    setMenuView(view)
    useCampaignState.getState().returnToSelection()
  }
  const selectedMission = CAMPAIGN_MISSIONS.find((item) => item.id === selectedMissionId)
  const mission = {
    title: selectedMission?.title ?? 'CAMPAIGN',
    region: selectedMission?.region ?? 'MISSION SELECT',
    sceneTitle: selectedMission?.title ?? 'CAMPAIGN',
  }


  function startMission() {
    const requestId = ++sceneryRequest.current.id
    const requestedMission=useCampaignState.getState().selectedMissionId
    const arenaPreparation=cityEnabled()&&!firstCity()&&Boolean(arcBossFor(requestedMission))
    if(cityEnabled() && (requestedMission==='mission-1'||arenaPreparation)) {
      setSceneryPreparation({state:'loading',city:true,arena:arenaPreparation})
      const prepared=arenaPreparation?loadArena(requestedMission):prepareCityOpening()
      prepared.then(()=>{
        if(requestId!==sceneryRequest.current.id || useCampaignState.getState().selectedMissionId!==requestedMission)return
        if (requestedMission === 'mission-1' && endingPreparationEnabled()) {
          setSceneryPreparation({ state: 'bounds', requestId, city: true })
          return
        }
        setGameHold('revision-scenery',true);setSceneryPreparation({state:'mounting',city:true,arena:arenaPreparation});startMissionReady();sceneryRound.current=useGameplayState.getState().roundId
      }).catch(error=>{if(requestId===sceneryRequest.current.id)setSceneryPreparation({state:'error',city:true,arena:arenaPreparation,message:error.message})})
      return
    }
    if (new URLSearchParams(location.search).get('kashiPrototype') === 'revision' && useCampaignState.getState().selectedMissionId === 'mission-1') {
      setSceneryPreparation({ state: 'loading' })
      prepareRevision().then(() => {
        if (requestId !== sceneryRequest.current.id || useCampaignState.getState().selectedMissionId !== 'mission-1') return
        setSceneryPreparation({ state: 'bounds', requestId })
      }).catch(error => { if (requestId === sceneryRequest.current.id) setSceneryPreparation({ state: 'error', message: error.message }) })
      return
    }
    if (requestedMission === 'mission-1' && endingPreparationEnabled()) {
      setSceneryPreparation({ state: 'bounds', requestId, endingOnly: true })
      return
    }
    sceneryRound.current = null; setSceneryPreparation(null); setGameHold('revision-scenery', false)
    startMissionReady()
  }
  function endingBoundsReady() {
    if (sceneryPreparation?.state !== 'bounds' || sceneryPreparation.requestId !== sceneryRequest.current.id) return
    if (useCampaignState.getState().selectedMissionId !== 'mission-1') return
    if (sceneryPreparation.endingOnly) {
      sceneryRound.current = null; setSceneryPreparation(null); setGameHold('revision-scenery', false)
      startMissionReady()
      return
    }
    setGameHold('revision-scenery', true); setSceneryPreparation({ state: 'mounting', city: sceneryPreparation.city })
    startMissionReady(); sceneryRound.current = useGameplayState.getState().roundId
  }
  function endingBoundsError(error) {
    if (sceneryPreparation?.requestId !== sceneryRequest.current.id) return
    setSceneryPreparation({ state: 'error', city: sceneryPreparation.city, endingOnly: sceneryPreparation.endingOnly, message: error.message })
  }
  function cancelScenery() {
    if (useCampaignState.getState().isPlaying) leaveMission('missions')
    else { sceneryRequest.current.id++; sceneryRound.current = null; setSceneryPreparation(null); setGameHold('revision-scenery', false); setMenuView('missions') }
  }
  function preparationKey(event) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancelScenery() }
    if (event.key === 'Tab') {
      const buttons = [...event.currentTarget.querySelectorAll('button')]
      if (!buttons.length) return
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1).focus() }
      else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0].focus() }
    }
  }
  function startMissionReady() {
    setContractReady(false)
    setMenuView('missions')
    stopCinematic('mission-restart', true)
    stopDialogue()
    setGameHold('inactive', false)
    setGameHold('story', false)
    useMissionTwoSequence.getState().reset()
    setStoryOpen(false)
    usePauseState.getState().reset()
    useGameplayState.getState().restart()
    if (useCampaignState.getState().startMission()) {
      const campaign = useCampaignState.getState()
      if (campaign.selectedMissionId === 'mission-1') {
        setMissionIntroVisible(false)
        const opening = new URLSearchParams(location.search).get('kashiPrototype') === 'revision' ? revisionOpening(kashiEntry) : kashiEntry
        if (!campaign.completedMissionIds.includes('mission-1') && !hasSeenKashiEntry() &&
          startCinematic(opening, getPlayerWorldPosition())) markKashiEntrySeen()
      } else {
        setMissionIntroVisible(false)
        const story = useStoryProgress.getState()
        if (!campaign.completedMissionIds.includes(campaign.selectedMissionId) && !story.seenBriefings.includes(campaign.selectedMissionId)) {
          playStoryBriefing(campaign.selectedMissionId)
        }
      }
    }
  }

  function playStoryBriefing(id = selectedMissionId, replay = false) {
    const story = useStoryProgress.getState()
    const config = createStoryBriefing(id, story.scouting[id])
    if (!config) return
    // During a replay the player already has a valid camera/spawn; no new spawn
    // event is expected. First entry waits for the existing player spawn effect.
    if (replay) { config.waitForSpawn = false; config.storyPlacement = 'explicit-replay' }
    setStoryOpen(false)
    setGameHold('story', false)
    startCinematic(config, getPlayerWorldPosition(), reason => useStoryProgress.getState().markBriefingSeen(id, reason))
  }

  function openStory() {
    setGameHold('story', true)
    clearPlayerInput()
    setStoryOpen(true)
  }

  const startContract = useCallback(() => {
    if (!contractReady || selectedMissionId !== 'mission-2' || !isPlaying || paused || useCinematic.getState().session || bossStatus !== 'dormant') return
    clearPlayerInput()
    useMissionTwoSequence.getState().start(getPlayerWorldPosition())
  }, [contractReady, selectedMissionId, isPlaying, paused, bossStatus])

  useEffect(() => usePlayerInput.subscribe((state, previous) => {
    if (!state.interactQueued || previous.interactQueued) return
    consumePlayerInteract()
    if (!gameplayActive) return
    if (selectedMissionId === 'mission-1') {
      const story = useMissionOneStory.getState()
      if (story.nearby) story.scan(story.nearby)
    } else if (selectedMissionId === 'mission-2') startContract()
    else if (batchMission(selectedMissionId)) interactBatch(getPlayerWorldPosition())
  }), [gameplayActive, selectedMissionId, startContract])

  function continueToNextMission() {
    const campaign = useCampaignState.getState()
    const currentIndex = CAMPAIGN_MISSIONS.findIndex(({ id }) => id === campaign.selectedMissionId)
    const nextMission = CAMPAIGN_MISSIONS.slice(currentIndex + 1).find(
      item => item.playable && campaign.unlockedMissionIds.includes(item.id),
    )
    if (!nextMission || !campaign.selectMission(nextMission.id)) return false
    startMission()
    return true
  }

  const finishMissionIntro = useCallback(() => setMissionIntroVisible(false), [])

  return (
    <main
      className={`game-shell ${isPlaying ? 'is-playing' : ''} touch-controls-${touchMode}${bossStatus !== 'dormant' ? ' boss-mode' : ''}`}
      onPointerDownCapture={() => void unlockAudio()}
      onKeyDownCapture={() => void unlockAudio()}
    >
      {isPlaying && (
        <Suspense fallback={<LoadingScreen mission={selectedMission} />} >
          <GraphicsBoundary><GameCanvas active={gameplayActive} sequenceRunning={isPlaying && !paused && !storyOpen} onContractReady={setContractReady} /></GraphicsBoundary>
        </Suspense>
      )}
      {gameplayVisible && selectedMission?.playable && assistantImplemented(selectedMissionId) && !paused && <BhairavaAssistant key={`${selectedMissionId}:${assistantRoundId}`} />}
      {gameplayVisible && <GameHud onMenu={() => leaveMission('home')} onContinue={continueToNextMission} onBriefing={openStory} onContract={contractReady&&selectedMissionId==='mission-2'&&bossStatus==='dormant'?startContract:null} />}
      {gameplayVisible && <CombatNarrative />}
      {gameplayActive && <MobileControls />}
      {gameplayActive && selectedMissionId === 'mission-1' && new URLSearchParams(location.search).get('cinematicTest') === '1' && (
        <button className="cinematic-test" type="button" onClick={() => startCinematic(missionOneCinematic, getPlayerWorldPosition())}>Play cinematic test</button>
      )}
      <CinematicOverlay />
      {contract && <MissionTwoSequenceOverlay running={!paused} onPause={() => usePauseState.getState().pause()} onStart={startContract} />}
      {storyOpen && <StoryJournal missionId={selectedMissionId} playing={isPlaying} onClose={() => { clearPlayerInput(); setGameHold('story', false); setStoryOpen(false) }} onBriefing={() => playStoryBriefing(selectedMissionId, true)} />}
      <header className="game-header">
        <a className="wordmark" href="/" aria-label="Kalki home">
          K<span>:</span>L
        </a>
        <p className="mission-label">{mission.title}</p>
        <p className="build-label">{isPlaying ? `WORLD BUILD ${selectedMission?.number ?? '01'}` : 'CAMPAIGN'}</p>
        
      </header>
      {isPlaying && !cinematic && !contract ? (
        <>
          <div className="scene-coordinate" aria-hidden="true">
            <span>29° 58′ 08″ N</span>
            <span>UNKNOWN TERRITORY</span>
          </div>
          <div className="crosshair" aria-hidden="true" />
        </>
      ) : (
        !isPlaying && (menuView === 'missions' ? <MissionSelect onStart={startMission} onBack={() => setMenuView('home')} /> : <MainMenu onLevels={() => setMenuView('missions')} onStart={startMission} />)
      )}
      {missionIntroVisible && !paused && <MissionEntryClip onSkip={finishMissionIntro} clip={selectedMission?.entryClip} />}
      {isPlaying && !storyOpen && !cinematic && <button id="game-pause-trigger" className="game-pause-button" type="button" aria-label="Pause game" title="Pause (Esc)" disabled={paused} onClick={() => usePauseState.getState().pause()}>
        <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="3" width="4" height="14" /><rect x="12" y="3" width="4" height="14" /></svg>
      </button>}
      {paused && isPlaying && <PauseMenu onRestart={startMission} onSelection={() => leaveMission('missions')} onExit={() => leaveMission('home')} />}
        {sceneryPreparation && <div ref={preparationDialog} className="revision-preparation" role="dialog" aria-modal="true" aria-label={sceneryPreparation.endingOnly?"Preparing Mission 1":sceneryPreparation.arena?"Preparing boss arena":sceneryPreparation.city?"Preparing Kashi city study":"Preparing revised Kashi"} onKeyDown={preparationKey}>
          {sceneryPreparation.state === 'bounds' && <Suspense fallback={null}><EndingBoundsPreparation key={sceneryPreparation.requestId} onReady={endingBoundsReady} onError={endingBoundsError} /></Suspense>}
        <section><div className="loading-art"><LoadingScreen mission={selectedMission} artworkOnly /></div><small>{sceneryPreparation.endingOnly?'KASHI / MISSION 01':sceneryPreparation.city?'KASHI / PHASE 5.4E OPT-IN STUDY':'KASHI / ISOLATED REVISION'}</small><h2>{sceneryPreparation.state === 'error' ? 'Scenery could not load' : sceneryPreparation.endingOnly?'Preparing the mission':sceneryPreparation.arena?'Preparing the arena':'Preparing the riverfront'}</h2><p role="status">{sceneryPreparation.state === 'error' ? sceneryPreparation.message : sceneryPreparation.endingOnly?'Preparing the ending cinematic…':sceneryPreparation.state === 'mounting' ? 'Confirming the first scene frame…' : sceneryPreparation.arena?'Loading the encounter architecture…':'Loading the near block and licensed civilian assets…'}</p>
          {sceneryPreparation.state === 'error' && <button type="button" onClick={startMission}>RETRY</button>}<button type="button" onClick={cancelScenery}>BACK TO SELECTION</button>
        </section>
      </div>}

    </main>
  )
}

export default App
