import fs from 'node:fs'
import assert from 'node:assert/strict'
const read = path => fs.readFileSync(path, 'utf8').replace(/\r/g, '')
const before = read('tools/memo-before-CombatEnemies.jsx')
const expected = before
  .replace("import { Suspense, useEffect, useRef }", "import { memo, Suspense, useEffect, useRef }")
  .replace('function EnemyModel({ type, rootRef, weaponRef, coreRef, motionRef, hitRef }) {', 'const EnemyModel = memo(function EnemyModel({ type, rootRef, weaponRef, coreRef, motionRef, hitRef }) {')
  .replace('}\n\nfunction Enemy(', '})\n\nfunction Enemy(')
assert.equal(read('src/game/CombatEnemies.jsx'), expected)
assert.ok(read('src/main.jsx').includes('<StrictMode>'))
console.log('PASS: only EnemyModel memo wrapper/import changed; callbacks, refs, props, and component body preserved; StrictMode enabled.')
