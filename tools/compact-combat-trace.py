import json,pathlib,collections,gzip,shutil
p=pathlib.Path('tools/combat-focused-trace.raw.json');decoder=json.JSONDecoder();kept=[];names=collections.Counter();gpu=collections.Counter();total=0
with p.open(encoding='utf8') as f:
 buf=f.read(1048576);idx=buf.index('[',buf.index('"traceEvents"'))+1
 while True:
  while idx<len(buf) and buf[idx] in ' \r\n\t,':idx+=1
  if idx<len(buf) and buf[idx]==']':break
  try:e,end=decoder.raw_decode(buf,idx)
  except json.JSONDecodeError:
   more=f.read(1048576)
   if not more:raise
   buf=buf[idx:]+more;idx=0;continue
  idx=end;total+=1;name=e.get('name','');cat=e.get('cat','');dur=e.get('dur',0);names[name]+=1
  if 'gpu' in cat:gpu[name]+=dur
  if e.get('ph')=='M' or name in ['combat-profile-start','combat-profile-end','navigationStart'] or ('GC' in name and ('v8' in cat or 'devtools' in cat)) or (e.get('ph')=='X' and dur>5000 and 'gpu' not in cat) or name.startswith('Resource'):kept.append(e)
  if idx>1048576:buf=buf[idx:];idx=0
pathlib.Path('tools/combat-focused-trace.compact.json').write_text(json.dumps({'traceEvents':kept}));pathlib.Path('tools/combat-trace-inventory.json').write_text(json.dumps({'totalEvents':total,'retained':len(kept),'mostCommon':names.most_common(20),'gpuInclusiveMicros':gpu.most_common(15)},indent=2))
with p.open('rb') as source,gzip.open('tools/combat-focused-trace.full.json.gz','wb',compresslevel=1) as target:shutil.copyfileobj(source,target,1048576)
print(json.dumps({'events':total,'retained':len(kept),'gzipBytes':pathlib.Path('tools/combat-focused-trace.full.json.gz').stat().st_size}))
