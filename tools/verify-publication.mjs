import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import assert from 'node:assert/strict'
const manifest=JSON.parse(readFileSync('PUBLICATION-MANIFEST.json','utf8'))
for(const row of manifest.files){assert.ok(existsSync(row.path),row.path);assert.equal(createHash('sha256').update(readFileSync(row.path)).digest('hex'),row.sha256,row.path)}
const html=readFileSync('index.html','utf8');assert.ok(html.includes('./game/reboot/src/main.jsx'));assert.ok(html.includes('./game/reboot/src/ui/branding/kl-logo.png'))
for(const path of ['game/reboot/src/world/story/characterField.js','game/reboot/src/campaign/story/foundation.js','game/reboot/src/audio/worldAudio.js'])assert.ok(existsSync(path),path)
console.log('Verified '+manifest.files.length+' release files; Phase7 campaign, story characters and supplied favicon present.')
