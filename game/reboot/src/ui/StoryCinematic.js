import {DialogueCaption} from './DialogueSubtitles.js'
import {createElement as h,useEffect} from 'react'
export default function StoryCinematic({scene,onSkip,audio}){const speaker=scene?.title,text=scene?.text;useEffect(()=>{if(!text)return;void audio?.dialogue?.play({speaker,text});return()=>audio?.dialogue?.stop()},[audio,speaker,text]);
 if(!scene)return null
 return h('section',{'aria-label':'Story cinematic',className:'story-cinematic'},h('small',{className:'cinematic-shot'},scene.shot??scene.kind??'Story'),h('strong',null,scene.title),h(DialogueCaption,{audio,speaker:scene.title,text:scene.text}),h('progress',{'aria-label':'Scene progress',value:scene.elapsed??0,max:scene.duration??1}),h('button',{type:'button',onClick:onSkip},'Skip scene · Esc'))
}
