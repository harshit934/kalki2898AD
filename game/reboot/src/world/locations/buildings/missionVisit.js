import {prepareBuildingInterior} from './interiorEnvironment.js'
import {createWorldExplorer} from '../../worldExploration.js'
// One renderer and physics host; mission resources stay suspended for exact return.
// Only this one interior is prepared. No campaign checkpoint or save writes.
export async function createMissionRoomVisit({host,building,signal,loadPlayerAsset,modelFactory,onExit,onState,onError}){
 const roots=host.scene.children.map(root=>({root,visible:root.visible})),bodies=[],ledger=[];let closed=false,explorer,content
 host.world.forEachRigidBody(body=>bodies.push({body,enabled:body.isEnabled()}));for(const row of roots)row.root.visible=false;for(const row of bodies)row.body.setEnabled(false)
 async function release(){if(closed)return;closed=true;const errors=[];for(const fn of [...ledger].reverse())try{await fn()}catch(e){errors.push(e)}for(const row of bodies)try{if(row.body.isValid())row.body.setEnabled(row.enabled)}catch(e){errors.push(e)}for(const row of roots)row.root.visible=row.visible;if(errors.length)throw new AggregateError(errors,'Mission room cleanup failed')}
 try{content=await prepareBuildingInterior({host,signal,building,own:fn=>ledger.push(fn),onExit,onError});explorer=await createWorldExplorer({host,signal,ownerId:'mission-room-'+building.id,position:content.spawn,own:fn=>ledger.push(fn),worldContent:content,loadPlayerAsset,modelFactory,onWorldState:onState,onError});return {explorer,release}}catch(error){try{await release()}catch(cleanup){throw new AggregateError([error,cleanup],'Mission room entry and recovery failed')}throw error}
}
