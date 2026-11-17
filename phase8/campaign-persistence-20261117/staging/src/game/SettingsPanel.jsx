import { useEffect, useState } from 'react'
import AudioControls from '../audio/AudioControls.jsx'
import { useControlSettings } from './controlSettings.js'
import { useVisualSettings } from './visualSettings.js'

function readMotion() { try { return localStorage.getItem('kalki-interface-motion') === 'reduced' } catch { return false } }

export default function SettingsPanel() {
  const touchMode = useControlSettings(s => s.touchMode)
  const quality = useVisualSettings(s => s.quality)
  const hud = useVisualSettings(s => s.hud)
  const [reducedMotion, setReducedMotion] = useState(readMotion)
  const [displayMessage, setDisplayMessage] = useState('')
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  useEffect(() => { const update = () => setFullscreen(Boolean(document.fullscreenElement)); document.addEventListener('fullscreenchange', update); return () => document.removeEventListener('fullscreenchange', update) }, [])
  async function toggleFullscreen() {
    try { if(document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); setDisplayMessage('') }
    catch { setDisplayMessage('Fullscreen is unavailable in this browser. Use the browser display controls.') }
  }
  return <div className="shared-settings">
    <p className="settings-caption">MAKE THE JOURNEY YOURS</p>
    <fieldset><legend>01 / GRAPHICS & DISPLAY</legend>
      <label className="pause-control-setting">Rendering profile<select aria-label="Graphics quality" value={quality} onChange={e=>useVisualSettings.getState().setQuality(e.target.value)}><option value="balanced">Balanced · up to 1080p desktop</option><option value="performance">Performance · lower resolution</option></select></label>
      <p className="setting-note">Performance reduces render resolution. Balanced preserves the existing quality target.</p>
      <button type="button" onClick={toggleFullscreen} disabled={!document.fullscreenEnabled}>{fullscreen ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN'}</button>
      {!document.fullscreenEnabled && <p className="setting-note">Fullscreen is not supported on this device.</p>}
      <p role="status">{displayMessage}</p>
      <label className="motion-option"><input type="checkbox" checked={reducedMotion} onChange={e=>{const value=e.target.checked;setReducedMotion(value);document.documentElement.dataset.interfaceMotion=value?'reduced':'system';try{localStorage.setItem('kalki-interface-motion',value?'reduced':'system')}catch{setDisplayMessage('Motion preference applies this session; browser storage is unavailable.')}}} />Reduce interface motion</label>
    </fieldset>
    <fieldset><legend>02 / AUDIO & DIALOGUE</legend><AudioControls /></fieldset>
    <p className="settings-scroll-cue">↓ Scroll for HUD and controls</p>
    <fieldset><legend>03 / HUD & CONTROLS</legend>
      <label className="pause-control-setting">HUD<select aria-label="HUD mode" value={hud} onChange={e=>useVisualSettings.getState().setHud(e.target.value)}><option value="full">Full HUD</option><option value="compact">Compact HUD</option><option value="minimal">Minimal HUD</option></select></label>
      <label className="pause-control-setting">Touch controls<select aria-label="Touch controls" value={touchMode} onChange={e=>useControlSettings.getState().setTouchMode(e.target.value)}><option value="auto">Automatic</option><option value="always">Always show</option><option value="hidden">Hide</option></select></label>
      <p className="pause-controls-help">WASD / arrows · move<br />Ctrl · sprint (unlimited) / Space · jump<br />J / K · attacks / F · guard / Shift or Q · dodge<br />E · interact / B · Overdrive<br />Esc · pause / resume<br />Touch · drag the stick and use action buttons.</p>
    </fieldset>
  </div>
}
