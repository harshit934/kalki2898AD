// Apply the game's fitted armor design to the free Ara/MakeHuman exporter.
// The shell geometry is skinned by that exporter, including gloves/fingers.
// Usage: node tools/customize-bhairava-generator.mjs path-to-exporter
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const file = join(process.argv[2], 'src/core/garments/catalog.ts')
let text = readFileSync(file, 'utf8')
const start = text.indexOf("    id: 'leather_armor',")
const end = text.indexOf("  {\n    id: 'tactical_vest',", start)
if (start < 0 || end < 0) throw Error('Exporter armor definition changed; review before applying')
text = text.slice(0, start) + `    id: 'leather_armor', label: 'Bhairava fitted armor', slot: 'acc', patterns: ['leather'], color: '#82786a', color2: '#000000',
    build: (g, st) => {
      const off = g.layered.top ? cm(2.4) : cm(1.2);
      const backing = cloth(g, 'Armor leather backing', leatherStyle('#463626'), { roughness: 0.82 });
      const steel = mat('Weathered titanium plates', null, { color: '#a89e89', metalness: 0.72, roughness: 0.43 });
      const darkSteel = mat('Shoulder layered titanium', null, { color: '#6b665b', metalness: 0.68, roughness: 0.48 });
      const chest = shell(g, {
        covers: (v) => isUpper(v) && v.tt >= 0.38 && (v.tt < 0.81 || Math.abs(v.ax - 0.62 * g.body.L.shoulderX) < 0.2 * g.body.L.shoulderX),
        offset: off, tile: 0.25, relax: 4,
      });
      const parts: GPart[] = chest ? [{ mesh: chest.mesh, material: backing, smooth: true }] : [];
      // Continuous rigid cuirass: bridge the sternum instead of reproducing
      // separate soft chest contours. Preserve its fitted sides and skinning.
      const cuirass = shell(g, {
        covers: (v) => isUpper(v) && v.tt >= 0.50 && v.tt <= 0.88 && Math.abs(v.tth) < 1.16,
        offset: off + cm(1.1), tile: 0.2, relax: 3,
      });
      if (cuirass) {
        const p = cuirass.mesh.positions;
        let front = -Infinity;
        for (let i = 2; i < p.length; i += 3) front = Math.max(front, p[i]);
        for (let i = 0; i < p.length; i += 3) p[i + 2] = Math.max(p[i + 2], front - cm(0.8) - Math.abs(p[i]) * 0.18);
        parts.push({ mesh: cuirass.mesh, material: steel, smooth: true });
      }
      for (const [lo, hi] of [[0.39, 0.46], [0.48, 0.52]]) {
        const plate = shell(g, {
          covers: (v) => isUpper(v) && v.tt >= lo && v.tt <= hi && Math.abs(v.tth) < 1.12,
          offset: off + cm(0.85), tile: 0.2, relax: 2,
        });
        if (plate) parts.push({ mesh: plate.mesh, material: steel, smooth: true });
      }
      const shoulderCap = shell(g, {
        covers: (v) => v.side > 0 && v.region === REGION.torso && v.tt > 0.86 && Math.abs(v.tth) > 0.9 && Math.abs(v.tth) < 2.2,
        offset: off + cm(2.1), tile: 0.2, relax: 2,
      });
      if (shoulderCap) parts.push({ mesh: shoulderCap.mesh, material: darkSteel, smooth: true });
      // Layered shoulder lames articulate with the existing upper-arm weights.
      for (const [lo, hi, extra] of [[0, 0.20, 2.0], [0.18, 0.32, 1.65], [0.30, 0.43, 1.3]]) {
        const lame = shell(g, {
          covers: (v) => v.side > 0 && v.region === REGION.upperarm && v.t >= lo && v.t < hi,
          offset: off + cm(extra), tile: 0.2, relax: 2,
        });
        if (lame) parts.push({ mesh: lame.mesh, material: darkSteel, smooth: true });
      }
      const gloves = shell(g, {
        covers: (v) => v.region === REGION.hand || (v.region === REGION.lowerarm && v.t > 0.82),
        offset: cm(0.28), tile: 0.12, relax: 1,
      });
      if (gloves) parts.push({ mesh: gloves.mesh, material: cloth(g, 'Fitted leather gloves', leatherStyle('#30291f'), { roughness: 0.65 }), smooth: true });
      const bracers = shell(g, {
        covers: (v) => v.region === REGION.lowerarm && v.t > 0.38 && v.t < 0.78,
        offset: cm(0.75), tile: 0.12, relax: 2,
      });
      if (bracers) parts.push({ mesh: bracers.mesh, material: darkSteel, smooth: true });
      return parts;
    },
  },
` + text.slice(end)
writeFileSync(file, text)
console.log('Applied fitted Bhairava chest plates, shoulder lames, gloves and bracers')
