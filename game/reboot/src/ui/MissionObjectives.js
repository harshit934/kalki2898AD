import {createElement as h} from 'react'

export default function MissionObjectives({session,objectives=[],checkpoint,activity,onAction,onRetrySave,busy=false}){
 if(!session||!['active','suspended'].includes(session.state))return null
 const required=objectives.filter(o=>o.required!==false),complete=required.filter(o=>session.completedObjectiveIds.includes(o.id)).length,panel=activity?.panel,enabled=session.state==='active'&&session.playerResources.health>0&&!busy&&!activity?.busy
 const button=(label,action,disabled=false)=>h('button',{key:label,type:'button',disabled:!enabled||disabled,onClick:()=>onAction(action)},label)
 return h('div',{className:'mission-objective-system'},
  h('aside',{className:'mission-objective-tracker','aria-label':'Mission objective progress'},
   h('strong',null,`Objectives ${complete} / ${required.length}`),h('progress',{'aria-label':'Required mission objectives',value:complete,max:Math.max(1,required.length)}),
   h('div',{'aria-live':'polite',className:checkpoint?.status==='error'?'objective-save-error':''},checkpoint?.status==='saving'?'Saving checkpoint…':checkpoint?.status==='saved'?'Checkpoint saved':checkpoint?.status==='error'?'Checkpoint not saved: '+checkpoint.error:'Checkpoint preparing'),
   checkpoint?.status==='error'&&h('button',{type:'button',disabled:busy,onClick:onRetrySave},'Retry saving'),
   h('details',null,h('summary',null,'Objective journal'),h('ul',null,...objectives.map(o=>h('li',{key:o.id},`${session.completedObjectiveIds.includes(o.id)?'✓':session.objectiveStates[o.id]==='failed'?'Failed:':session.objectiveStates[o.id]==='active'?'Active:':'Locked:'} ${o.required===false?'Optional · ':''}${o.label??o.id.replaceAll('-',' ')}`)))),
   activity&&h('details',{className:'optional-contract',open:true},h('summary',null,`${activity.title} · ${activity.completed}/${activity.total}`),
    h('small',null,activity.finished?'Contract verified · one-time reward':`Optional contract · ${activity.reward} crystals once`),
    !activity.unlocked&&h('p',null,'Complete the mission briefing to investigate this contract.'),
    activity.next&&h('p',null,activity.next.label+` · ${activity.next.distance} m ${activity.next.direction}`),
    activity.nearby&&h('p',null,'Approach the glowing instrument and press E.'),
    activity.message&&h('p',{'aria-live':'polite'},activity.message),
    activity.records.length>0&&h('details',null,h('summary',null,'Recorded evidence'),...activity.records.map(r=>h('p',{key:r.label},h('strong',null,r.label+': '),r.clue))))),
  panel&&h('section',{className:'mission-activity-panel','aria-label':'Mission activity'},h('h2',null,panel.label),h('p',null,panel.clue),
   panel.mechanic==='survey'&&(panel.scan===null?button('Scan area · stay nearby for 2 seconds','scan'):h('div',null,h('progress',{'aria-label':'Survey scan',value:panel.scan,max:1}),h('p',null,'Scanning — remain near the instrument.'))),
   panel.mechanic==='inspect'&&button('Record this evidence','inspect'),
   panel.mechanic==='collect'&&button('Verify and complete','complete'),
   panel.mechanic==='allocate'&&h('div',null,h('p',{'aria-live':'polite'},'Selected energy units: '+panel.draft),h('div',{className:'activity-choice-grid'},...[0,1,2,3].map(n=>button('Allocate '+n,'set:'+n))),button('Confirm allocation','confirm')),
   ...panel.choices.map(c=>button(c.label,'choose:'+c.id)),
   activity.failures>0&&h('p',{role:'status'},`Rejected answers: ${activity.failures} / ${activity.failureLimit}`),
   activity.message&&h('p',{'aria-live':'polite'},activity.message),button('Close activity','close')))
}
