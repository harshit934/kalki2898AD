import { create } from 'zustand'
const key = 'kalki-visual-settings-v1'
function read() {
  try { const saved=JSON.parse(localStorage.getItem(key)||'{}');return {quality:saved.quality==='performance'?'performance':'balanced',hud:['full','compact','minimal'].includes(saved.hud)?saved.hud:'compact'} } catch { return {quality:'balanced',hud:'compact'} }
}
function save(state){try{localStorage.setItem(key,JSON.stringify({quality:state.quality,hud:state.hud}))}catch{/* Keep in-session preferences when storage is unavailable. */}}
export const useVisualSettings = create((set,get) => ({
  ...read(),
  setQuality(quality) {
    if (!['balanced', 'performance'].includes(quality)) return
    set({ quality })
    save(get())
  },
  setHud(hud){if(!['full','compact','minimal'].includes(hud))return;set({hud});save(get())},
}))
