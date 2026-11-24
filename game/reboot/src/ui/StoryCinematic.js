import {createElement as h} from 'react'
export default function StoryCinematic({scene,onSkip}){
 if(!scene)return null
 return h('section',{'aria-label':'Story cinematic',className:'story-cinematic'},h('strong',null,scene.title),h('p',null,scene.text),h('button',{type:'button',onClick:onSkip},'Skip scene'))
}
