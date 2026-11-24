import {createElement as h,useEffect} from 'react'
export default function StoryCinematic({scene,onSkip,audio}){const speaker=scene?.title,text=scene?.text;useEffect(()=>{if(!text)return;void audio?.dialogue?.play({speaker,text});return()=>audio?.dialogue?.stop()},[audio,speaker,text]);
 if(!scene)return null
 return h('section',{'aria-label':'Story cinematic',className:'story-cinematic'},h('strong',null,scene.title),h('p',null,scene.text),h('button',{type:'button',onClick:onSkip},'Skip scene'))
}
