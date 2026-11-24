import {execFileSync} from 'node:child_process'
import {writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const revision='402b74b6c1739e355ab75ffeb8aa9a31403eb5ab'
const source=execFileSync('git',['show',revision+':game/reboot/src/main.jsx'],{encoding:'utf8'})
const calls=Object.fromEntries(['MainMenu','MissionSelect'].map(name=>[name,source.slice(source.indexOf('<'+name),source.indexOf('/>',source.indexOf('<'+name))+2)]))
const hashes=Object.fromEntries(['MainMenu.jsx','MissionSelect.jsx','menuScreens.css'].map(name=>[name,createHash('sha256').update(execFileSync('git',['show',revision+':game/reboot/src/ui/'+name])).digest('hex')]))
writeFileSync('tools/menu-baseline.json',JSON.stringify({revision,calls,hashes},null,2)+'\n')
