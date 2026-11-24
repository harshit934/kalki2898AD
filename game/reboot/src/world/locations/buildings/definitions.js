import {deepFreeze} from '../../../campaign/contracts.js'
// Entrances are on clear side approaches outside the accepted Complex collider cores.
export const BUILDINGS=deepFreeze([
 {id:'interior-cedar-apartment',label:'Bhairava Room',kind:'residential',parent:'kashi',entrance:[116,-.175,73],outward:[0,1],size:[7,8],color:'#a68b70'},
 {id:'interior-bronze-shop',label:'Bronze Atelier',kind:'shop',parent:'complex',entrance:[14.9,0,-19],outward:[1,0],size:[8,8],color:'#799993'},
 {id:'interior-survey-office',label:'Survey Office',kind:'office',parent:'complex',entrance:[-14.4,0,-30],outward:[-1,0],size:[7,8],color:'#6c8497'},
 {id:'interior-civic-gallery',label:'Civic Gallery',kind:'public',parent:'complex',entrance:[19.4,0,-35],outward:[1,0],size:[8,10],color:'#b2a388',upper:true},
 {id:'interior-mission-archive',label:'Field Archive',kind:'mission',parent:'complex',entrance:[-18.6,0,7],outward:[1,0],size:[8,10],color:'#7f8571'},
])
export const interiorDefinition=b=>({id:b.id,label:b.label,status:'available',space:{units:'metres',upAxis:'Y',position:'local-to-location',maxCoordinate:1000000},environment:'building-interior-'+b.kind,architecture:b.label+' dedicated interior',regions:[{minX:-b.size[0]/2,maxX:b.size[0]/2,minZ:-b.size[1]/2,maxZ:b.size[1]/2}],spawns:[{id:'entry',position:[0,0,b.size[1]/2-1.7]}],entrances:[{id:'exit',position:[0,0,b.size[1]/2-1]}],missionStarts:[],dependencies:[],future:[],npcs:[],activities:[],parking:[],transitionPoints:[]})
