import { usePauseState } from './pauseSystem.js'
import { useEffect, useRef, useState } from 'react'

function MissionEntryClip({ onSkip, clip }) {
  const paused = usePauseState(s => s.paused)
  const wasPlaying = useRef(false)
  const videoRef = useRef(null)
  const [playbackFailed, setPlaybackFailed] = useState(false)
  const src=clip?.src ?? '/videos/mission-entry.mp4'
  const [decoded,setDecoded]=useState(null)
  const hasFrame=decoded===src

  useEffect(()=>{
    const video=videoRef.current
    if(!video?.requestVideoFrameCallback)return undefined
    const handle=video.requestVideoFrameCallback(()=>setDecoded(src))
    return()=>video.cancelVideoFrameCallback?.(handle)
  },[src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const playPromise = video.play()
    playPromise?.catch(() => setPlaybackFailed(true))

    function handleKeyDown(event) {
      if (event.key !== 'Enter' || usePauseState.getState().paused) return
      event.preventDefault()
      onSkip()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSkip])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (paused) { wasPlaying.current = !video.paused; video.pause() }
    else if (wasPlaying.current) { wasPlaying.current = false; void video.play().catch(() => setPlaybackFailed(true)) }
  }, [paused])

  return (
    <section
      className={`mission-entry-clip${hasFrame ? '' : ' awaiting-frame'}`}
      role="dialog"
      aria-modal="true"
      aria-label={clip?.title ?? 'Mission entry clip'}
      aria-busy={!hasFrame&&!playbackFailed}
      onPointerDown={onSkip}
    >
      <video
        ref={videoRef}
        className="mission-entry-video"
        src={src}
        autoPlay
        playsInline
        preload="auto"
        aria-label="Mission entry video"
        onEnded={onSkip}
        onError={() => setPlaybackFailed(true)}
        onLoadedData={()=>{if(!videoRef.current?.requestVideoFrameCallback)setDecoded(src)}}
      />
      {!hasFrame&&<div className="mission-entry-loading" role="status">{playbackFailed ? 'CINEMATIC UNAVAILABLE — CONTINUE WHEN READY' : 'PREPARING CINEMATIC…'}</div>}
      <div className="mission-entry-skip" aria-live="polite">
        <span>{playbackFailed ? 'VIDEO UNAVAILABLE' : clip?.title ?? 'MISSION ENTRY'}</span>
        <button type="button" onClick={onSkip}>
          {playbackFailed ? 'CONTINUE' : 'TAP ANYWHERE OR PRESS ENTER TO SKIP'}
        </button>
      </div>
    </section>
  )
}

export default MissionEntryClip
