import {CampaignError,clone,requireCondition} from '../campaign/contracts.js'
import {newProgress,validateProgress} from '../campaign/progress.js'
export const SAVE_KEY='kalki-phase5d-disposable:campaign:v1'
export const BACKUP_KEY=SAVE_KEY+':backup'

/** Explicit storage adapter; never reads or writes the old campaign namespace. */
export function createRepository(storage,catalogue){
  let observed=null,loaded=false,current=null,checkpointValidator=null
  const parse=raw=>{try{return raw===null?null:validateProgress(JSON.parse(raw),catalogue)}catch{return null}}
  function load(){
    try{
      observed=storage.getItem(SAVE_KEY);const backupRaw=storage.getItem(BACKUP_KEY),primary=parse(observed),backup=parse(backupRaw)
      requireCondition(primary||backup||(observed===null&&backupRaw===null),'CORRUPT_SAVE','No valid reboot save; preserve existing data for recovery')
      current=primary??backup??newProgress();loaded=true
      return {status:primary?'saved':backup?'recovered':'new',progress:clone(current)}
    }catch(error){loaded=false;throw error instanceof CampaignError?error:new CampaignError('STORAGE_UNAVAILABLE','Reboot storage is unavailable; no legacy save was touched')}
  }
  function commit(progress){
    requireCondition(loaded,'SAVE_NOT_LOADED','Load before committing')
    const validated=validateProgress(progress,catalogue)
    for(const [id,checkpoint] of Object.entries(validated.missionCheckpoints??{})){
      if(JSON.stringify(checkpoint)!==JSON.stringify(current.missionCheckpoints?.[id])){
        requireCondition(checkpointValidator,'CHECKPOINT_VALIDATOR_REQUIRED','New checkpoint requires registered runtime-content validation')
        checkpointValidator(checkpoint)
      }
    }
    requireCondition(validated.revision===current.revision,'SAVE_CONFLICT','Stale reboot revision')
    try{
      requireCondition(storage.getItem(SAVE_KEY)===observed,'SAVE_CONFLICT','Another session changed the reboot save')
      const next={...validated,revision:current.revision+1},raw=JSON.stringify(next)
      if(parse(observed)){
        storage.setItem(BACKUP_KEY,observed)
        requireCondition(storage.getItem(BACKUP_KEY)===observed,'SAVE_FAILED','Backup verification failed')
      }
      storage.setItem(SAVE_KEY,raw)
      requireCondition(storage.getItem(SAVE_KEY)===raw&&parse(raw),'SAVE_FAILED','Save verification failed')
      observed=raw;current=next;return clone(next)
    }catch(error){throw error instanceof CampaignError?error:new CampaignError('SAVE_FAILED','Reboot save failed; existing recovery data was retained')}
  }
  function importFresh(progress){
    requireCondition(storage.getItem(SAVE_KEY)===null&&storage.getItem(BACKUP_KEY)===null,'REBOOT_ALREADY_EXISTS','Import cannot replace an existing reboot save')
    load();return commit({...progress,revision:current.revision})
  }
  // Resolve an ambiguous prior write only if the entire expected transaction
  // is already present. Never merge or overwrite a different newer campaign.
  function reconcileCommit(progress){
    requireCondition(loaded,'SAVE_NOT_LOADED','Load before recovering commit')
    const expected={...validateProgress(progress,catalogue),revision:current.revision+1}
    try{
      const raw=storage.getItem(SAVE_KEY),saved=parse(raw)
      if(saved&&JSON.stringify(saved)===JSON.stringify(expected)){observed=raw;current=saved;return clone(saved)}
    }catch{/* The normal commit path will report any unresolved storage failure. */}
    return null
  }
  function setCheckpointValidator(validator){requireCondition(typeof validator==='function','INVALID_CHECKPOINT','Checkpoint validator required');checkpointValidator=validator}
  return Object.freeze({load,commit,importFresh,reconcileCommit,setCheckpointValidator})
}
