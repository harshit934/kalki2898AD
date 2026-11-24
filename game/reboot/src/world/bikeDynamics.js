const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
export function stepBike(state,input,delta){
 if(!Number.isFinite(delta)||delta<=0||delta>.1||![state.speed,state.yaw,input.x,input.y].every(Number.isFinite))throw Error('Invalid bounded bike dynamics')
 const target=input.brake?0:input.y>0?18:input.y<0?-4:0,rate=input.brake||state.speed*input.y<0?22:input.y?7:5,speed=state.speed+clamp(target-state.speed,-rate*delta,rate*delta),turn=input.x*Math.min(1.6,.35+Math.abs(speed)*.08)*(speed<0?-1:1),yaw=state.yaw-turn*delta
 return {speed,yaw,turn,dx:-Math.sin(yaw)*speed*delta,dz:-Math.cos(yaw)*speed*delta}
}
