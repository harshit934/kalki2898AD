import {deepFreeze} from '../../campaign/contracts.js'
export const SHAMBALA_NETWORK=deepFreeze([
 {label:'Central Sky Court',position:[138,6,18]},
 {label:'Residential Courts',position:[116,-.04,128]},
 {label:'Palace Terrace',position:[280,8,144]},
 {label:'Energy Plaza',position:[330,-.04,128]},
 {label:'Mountain Transit',position:[405,12,128]},
 {label:'Cliff Viewpoint',position:[440,12,170]},
 {label:'Himalayan Bridge',position:[300,12,226]}
])
export function appendShambalaIntegration({box}){
 // Clear-centre route thresholds are paint-thin, with side-mounted sign pillars.
 for(const [x,y,z]of [[76,-.04,60],[196,-.04,60],[207,-.04,128],[345,-.04,128],[405,12,150],[196,-.04,190]]){
  box('trim',[x,y+.015,z],[3,.02,.25]);box('glow',[x,y+.025,z+1],[.2,.02,1.4])
 }
 for(const [x,y,z]of [[70,-.04,54],[190,-.04,90],[214,-.04,120],[338,-.04,136],[416,12,136],[208,12,234]]){
  box('stone',[x,y+.7,z],[.7,1.4,.7],true);box('glow',[x,y+1.2,z-.36],[.4,.4,.05]);box('trim',[x,y+1.5,z],[.9,.15,.9])
 }
}
