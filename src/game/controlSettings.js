import { create } from 'zustand'
const key = 'kalki-control-settings-v1'
const modes = ['auto', 'always', 'hidden']
function read() {
  if (typeof window === 'undefined') return 'auto'
  try { const value = JSON.parse(localStorage.getItem(key) ?? '{}').touchMode; return modes.includes(value) ? value : 'auto' }
  catch { return 'auto' }
}
export const useControlSettings = create(set => ({
  touchMode: read(),
  setTouchMode(touchMode) {
    if (!modes.includes(touchMode)) return
    set({ touchMode })
    try { localStorage.setItem(key, JSON.stringify({ touchMode })) }
    catch (error) { console.warn('[Kalki controls] Could not save preferences.', error) }
  },
}))
