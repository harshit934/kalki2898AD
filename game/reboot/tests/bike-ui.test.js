import test from 'node:test'
import assert from 'node:assert/strict'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {EquipmentPanelView} from '../src/ui/EquipmentPanel.js'
import MobileControls,{isBikePrompt,isFlightPrompt} from '../src/ui/MobileControls.js'
test('earned bike access exposes separate ride controls; mobile riding does not expose jet ascent or combat commands',()=>{
 const view={weapons:[],ready:true},locked=renderToStaticMarkup(createElement(EquipmentPanelView,{view,open:true,bike:false})),owned=renderToStaticMarkup(createElement(EquipmentPanelView,{view,open:true,bike:true,bikeState:{mode:'riding',speed:10,message:'Bike ready'}}));assert.ok(locked.includes('Complete Mission 2'));assert.ok(owned.includes('Summon bike'));assert.ok(owned.includes('36 km/h'));assert.ok(!owned.includes('riding available with 7H'));const touch=renderToStaticMarkup(createElement(MobileControls,{enabled:true,bike:true,mission:true}));assert.ok(touch.includes('Brake')&&touch.includes('Exit bike'));assert.ok(!touch.includes('Attack')&&!touch.includes('Descend')&&!touch.includes('Rise'));assert.equal(isBikePrompt('Dismount bike'),true);assert.equal(isFlightPrompt('Dismount bike'),false)
})
