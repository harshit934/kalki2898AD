// Only the current five-mission batch is a candidate. No candidate is publicly
// playable until its individual end-to-end evidence has been recorded.
const validated = new Set()
const activeBatch = new Set([11, 12, 13, 14, 15])
const at = (x, z) => [x, -.22, z]
const stage = (kind, title, position, extra = {}) => ({ kind, title, position, ...extra })
export const CHAPTER_DEFINITIONS = Object.freeze({
  'mission-11': Object.freeze({
    id:'mission-11', number:11, environment:'kashi', layout:'diagnostic-workshop', reward:765, enemies:[],
    opening:['The receiver is losing its return signal. Ask Bujji to run the diagnostic before changing parts.','We check the readings, then trust the route.'],
    closing:'Bujji identifies the damaged receiver bus from the measured subsystem readings.',
    stages:[stage('talk','Ask Bujji to run the diagnostic',at(0,4)),stage('diagnostic','Compare power, drive and receiver readings',at(-3,-6)),stage('talk','Confirm the damaged subsystem with Bujji',at(0,4))],
  }),
  'mission-12': Object.freeze({
    id:'mission-12',number:12,environment:'kashi',layout:'three-crossings',reward:780,enemies:[],
    opening:['Survey the narrow passage, exposed ramp and service tunnel. A route for you is not always a route for the vehicle.','Mark the clearance and the broken sections. Then we choose.'],
    closing:'The service tunnel is verified as a traversable local ground route.',
    stages:[stage('survey','Inspect all three actual crossings',at(0,-8),{points:[{id:'narrow',name:'Narrow passage',position:at(-5,-8),finding:'Clearance 0.9 m: a person fits, the ground vehicle does not.'},{id:'ramp',name:'Exposed ramp',position:at(4,-22),finding:'The elevated ramp has a missing span; no safe ground-vehicle crossing.'},{id:'tunnel',name:'Service tunnel',position:at(-4,-34),finding:'Clearance 3.0 m, continuous paving and an open exit.'}]}),stage('route-choice','Choose the route supported by the survey',at(0,-37)),stage('interact','Traverse the service-tunnel exit',at(-4,-46))],
  }),
  'mission-13': Object.freeze({
    id:'mission-13',number:13,environment:'kashi',layout:'power-cell-exchange',reward:795,enemies:[],
    opening:['The trader will exchange a power cell for usable salvage. Inspect the offers before trading.','We bring back the cell without spending the campaign account twice.'],
    closing:'Recovered mission-local salvage is exchanged for a borrowed power cell.',
    stages:[stage('talk',"Hear the trader's exchange terms",at(4,-10)),stage('salvage-choice','Recover one usable salvage item',at(-4,-18),{items:[{id:'wire',name:'Usable wire coil',position:at(-4,-18)},{id:'bracket',name:'Intact drive bracket',position:at(3,-28)}]}),stage('barter','Trade the matching salvage for a power cell',at(4,-10)),stage('handoff','Deliver the borrowed cell to Bujji',at(0,4))],
  }),
  'mission-14': Object.freeze({
    id:'mission-14',number:14,environment:'kashi',layout:'buried-junction',reward:810,enemies:[],
    opening:['The return is intermittent. Request readings from different positions and follow the bearing.','We find the junction on the ground, not by guessing at a marker.'],
    closing:"The buried junction is identified and inspected from Bujji's intermittent bearings.",
    stages:[stage('talk','Ask Bujji for the first scan',at(0,4)),stage('signal','Follow intermittent bearings to the buried junction',at(-4,-35)),stage('interact','Inspect and report the exposed junction',at(-4,-35))],
  }),
  'mission-15': Object.freeze({
    id:'mission-15',number:15,environment:'kashi',layout:'console-defense',reward:825,
    enemies:[{id:'mission-15-console-scavenger',type:'warrior',name:'SCAVENGER',position:at(5,-29),phase:0}],
    opening:['Keep the scavenger away while the console finishes its diagnostic. A nearby hostile will interrupt the scan.','You finish the readings. I will keep this one occupied.'],
    closing:'The single scavenger is defeated and the protected console job is recovered.',
    stages:[stage('start-console','Start the protected repair-console job',at(0,-18)),stage('defend','Keep the scavenger away from the console',at(0,-18),{seconds:14,radius:4}),stage('interact','Recover the completed diagnostic',at(0,-18))],
  }),
})
export const isChapterValidated = number => validated.has(number)
export const chapterDefinition = id => CHAPTER_DEFINITIONS[id]
export function chapterFor(id) {
  const n=Number(id?.slice(8))
  const preview=typeof location!=='undefined'&&new URLSearchParams(location.search).get('chapterPreview')==='1'
  return validated.has(n)||(preview&&activeBatch.has(n)) ? CHAPTER_DEFINITIONS[id] : undefined
}
