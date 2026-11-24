// Original procedural DSP: no recordings, movie dialogue, downloads or silent assets.
export const AUDIO_PROFILES=Object.freeze({
 kashi:{wind:.15,water:.28,crowd:.13,traffic:.09,tonal:.045,nature:.025,weather:.08,frequency:110,waterAt:[395,220],landmark:[256,378]},
 shambala:{wind:.3,water:.24,crowd:.07,traffic:.045,tonal:.065,nature:.06,weather:.12,frequency:146.83,waterAt:[326,160],landmark:[280,144]},
 complex:{wind:.12,water:.045,crowd:.045,traffic:.09,tonal:.2,nature:.02,weather:.13,frequency:55,waterAt:[410,124],landmark:[118,-154]}
})
export const LAYERS=Object.freeze(['wind','water','crowd','traffic','tonal','nature','weather'])
export function synthesizeLayer(world,kind,sampleRate=24000,seconds=2){
 const profile=AUDIO_PROFILES[world];if(!profile||!LAYERS.includes(kind)||!Number.isFinite(sampleRate)||sampleRate<8000||sampleRate>192000||!Number.isFinite(seconds)||seconds<=0||seconds>4)throw Error('Invalid procedural audio request')
 const out=new Float32Array(Math.floor(sampleRate*seconds));let seed=world.length*7351+kind.length*113,brown=0,low=0
 for(let i=0;i<out.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1,t=i/sampleRate;brown=(brown+.025*noise)/1.025;low+=.08*(noise-low);const sine=f=>Math.sin(2*Math.PI*f*t);let value
  if(kind==='wind')value=brown*3*(.65+.25*sine(.5))
  else if(kind==='water')value=(noise*.22+low*.5)*(world==='complex'?.15+.7*Math.max(0,sine(3))**12:.7+.2*sine(2))
  else if(kind==='crowd')value=(sine(121+3*sine(.5))*.14+sine(183+4*sine(1))*.11+low*.2)*(.6+.3*sine(1.5))
  else if(kind==='traffic')value=sine(world==='complex'?66:83)*.28+sine(166)*.08+low*.18
  else if(kind==='tonal')value=world==='complex'?(sine(50)*.3+sine(100)*.09)*(1+.18*sine(2)):(sine(profile.frequency)*.24+sine(profile.frequency*2.01)*.12)*(.6+.3*sine(.5))
  else if(kind==='nature')value=world==='complex'?noise*.3*Math.max(0,sine(4))**28:sine(1300+500*sine(2))*.2*Math.max(0,sine(1))**18
  else value=world==='complex'?noise*.35:(world==='shambala'?low*.4:noise*.15+low*.25)
  // Equal endpoints prevent a click at the noise-loop seam.
  const edge=Math.min(1,i/(sampleRate*.02),(out.length-1-i)/(sampleRate*.02));out[i]=Math.max(-.8,Math.min(.8,value))*edge
 }return out
}
export function synthesizeCue(kind,sampleRate=24000){
 const notes={step:[95],interact:[330,440],discovery:[523.25,659.25,783.99],survey:[392,523.25],relay:[440,554.37],error:[130,110],reward:[523.25,659.25,783.99,1046.5],collect:[659.25,987.77],cinematic:[110,164.81,220],event:[220,329.63,440]};if(!notes[kind])return null
 const frequencies=notes[kind],duration=kind==='step'?.14:kind==='cinematic'?1.2:.22+frequencies.length*.09,out=new Float32Array(Math.floor(sampleRate*duration))
 for(let i=0;i<out.length;i++){const t=i/sampleRate,position=Math.min(frequencies.length-1,Math.floor(t/duration*frequencies.length)),frequency=frequencies[position],envelope=Math.sin(Math.PI*t/duration)**2*Math.exp(-t*(kind==='step'?22:2));out[i]=(Math.sin(t*frequency*2*Math.PI)*.32+Math.sin(t*frequency*4.01*Math.PI)*.08)*envelope}return out
}
