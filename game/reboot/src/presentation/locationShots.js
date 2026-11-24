import {deepFreeze} from '../campaign/contracts.js'
// Existing location-local metre coordinates; optional paths leave Kashi shots unchanged.
export const LOCATION_SHOTS=deepFreeze({complex:[
{time:0,position:[40,38,42],target:[0,12,-28],fov:58,far:420},
{time:3,position:[-28,22,12],target:[0,10,-28],fov:50,far:300},
{time:6,position:[0,12,16],target:[0,6,-25],fov:46,far:240},
{time:9,position:[0,2.45,17.15],target:[0,1.25,13],fov:42,far:180}],
shambala:[
{time:0,position:[38,35,38],target:[0,5,-18],fov:58,far:420},
{time:3,position:[36,22,4],target:[24,5,-44],fov:50,far:300},
{time:6,position:[0,12,18],target:[0,5,-22],fov:46,far:260},
{time:9,position:[0,2.45,22.15],target:[0,1.25,18],fov:42,far:260}]})
