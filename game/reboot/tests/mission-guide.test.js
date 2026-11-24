import test from 'node:test'
import assert from 'node:assert/strict'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {missionGuide} from '../src/ui/missionGuide.js'
import MissionObjectives from '../src/ui/MissionObjectives.js'
import {STORY_MISSIONS} from '../src/content/storyMissions.js'
import {withStoryBattle} from '../src/content/storyBattles.js'
import {withMissionActivities} from '../src/content/missionActivities.js'

test('beginner relay directions match each real mission order and advance only from runtime objective state',()=>{
 for(const original of STORY_MISSIONS){const content=withStoryBattle(withMissionActivities(original)),session={missionId:content.missionId,completedObjectiveIds:['briefing','evidence'],objectiveStates:{}}
  for(let i=0;i<3;i++){session.objectiveStates={['align-'+i]:'active'};const guide=missionGuide(session,content.objectives);assert.ok(guide.next.includes(String(content.story.order[i]+1)));assert.equal(guide.steps[2].done,false);session.completedObjectiveIds.push('align-'+i)}
  const guide=missionGuide(session,content.objectives);assert.equal(guide.steps[2].done,true);assert.equal(guide.steps[3].done,false);assert.equal(guide.steps[4].done,false)
  session.completedObjectiveIds.push(...content.objectives.filter(o=>o.required===false).map(o=>o.id));assert.equal(missionGuide(session,content.objectives).steps[3].done,false,'Bonus progress cannot mark the main battle complete')
 }
})

test('saved mission state restores a truthful beginner checklist and leaves the session unchanged',()=>{
 const content=withStoryBattle(withMissionActivities(STORY_MISSIONS[0])),session={missionId:'mission-2',completedObjectiveIds:['briefing','evidence','align-0'],objectiveStates:{'align-1':'active'}},before=structuredClone(session),guide=missionGuide(session,content.objectives)
 assert.equal(guide.steps[0].done,true);assert.equal(guide.steps[1].done,true);assert.equal(guide.steps[2].done,false);assert.equal(guide.next,'Go to relay 1 and press E.');assert.deepEqual(session,before);assert.equal(missionGuide({missionId:'mission-5'},[]),null)
})

test('game HUD shows a clear main goal, next action and aircraft interaction advice',()=>{
 const content=withStoryBattle(withMissionActivities(STORY_MISSIONS[0])),session={missionId:'mission-2',state:'active',playerResources:{health:100},completedObjectiveIds:['briefing','evidence','align-0'],objectiveStates:{'align-1':'active'}},html=renderToStaticMarkup(createElement(MissionObjectives,{session,objectives:content.objectives,flight:true,guidance:{distance:6,direction:'north'},checkpoint:{status:'saved'}}))
 for(const text of ['YOUR GOAL','Find the fake contract','Do this next:','Go to relay 1 and press E.','6 m north','Land nearby','How to finish this mission','Checkpoint saved'])assert.ok(html.includes(text),text)
 assert.equal(renderToStaticMarkup(createElement(MissionObjectives,{session:null})), '')
})
