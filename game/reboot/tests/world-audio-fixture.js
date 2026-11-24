// Test-only Web Audio graph recorder. This checks ownership/automation contracts,
// NOT a browser/device listening test. Production uses real AudioContext nodes.
export class AudioContextRecorder{
 constructor(){this.sampleRate=8000;this.currentTime=0;this.state='suspended';this.sources=new Set();this.nodes=[];this.destination={};this.closed=0;this.resumes=0}
 node(){const n={connections:new Set(),disconnect(){this.connections.clear()},connect(to){this.connections.add(to);return to}};this.nodes.push(n);return n}
 param(value=0){return {value,cancelScheduledValues(){},setTargetAtTime(v){this.value=v}}}
 createGain(){return Object.assign(this.node(),{gain:this.param(1)})}
 createStereoPanner(){return Object.assign(this.node(),{pan:this.param()})}
 createBiquadFilter(){return Object.assign(this.node(),{frequency:this.param(350),type:'lowpass'})}
 createDynamicsCompressor(){return Object.assign(this.node(),{threshold:this.param(),ratio:this.param()})}
 createBuffer(channels,length,sampleRate){const data=new Float32Array(length);return {length,sampleRate,duration:length/sampleRate,copyToChannel(a){data.set(a)},getChannelData(){return data}}}
 createBufferSource(){const context=this,n=Object.assign(this.node(),{loop:false,buffer:null,onended:null,start(){this.began=context.currentTime;context.sources.add(this)},stop(){context.sources.delete(this)}});return n}
 resume(){this.resumes++;this.state='running';return Promise.resolve()}
 close(){this.closed++;this.state='closed';return Promise.resolve()}
 advance(seconds){this.currentTime+=seconds;for(const source of [...this.sources])if(!source.loop&&this.currentTime-source.began>=source.buffer.duration){this.sources.delete(source);source.onended?.()}}
 activeConnections(){return this.nodes.reduce((n,row)=>n+row.connections.size,0)}
}
