import { cp, lstat, readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { DIALOGUE_INVENTORY } from '../src/audio/dialogueInventory.js'

const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const inside = (parent, child) => {
  const relative = path.relative(parent, child)
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative)
}
async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Voice packaging audit refuses symlink: ${file}`)
    if (entry.isDirectory()) yield* files(file)
    else if (entry.isFile()) yield file
  }
}

// Build-only policy. Runtime audio gates, source assets and dev serving stay unchanged.
export function excludeUnapprovedCatalogueVoices(catalogue = DIALOGUE_INVENTORY) {
  let config, publicDirectory, outputDirectory
  return {
    name: 'exclude-unapproved-catalogue-voices',
    apply: 'build',
    enforce: 'post',
    configResolved(value) {
      config = value
      publicDirectory = path.resolve(config.publicDir)
      outputDirectory = path.resolve(config.root, config.build.outDir)
      if (config.build.copyPublicDir !== false) throw new Error('Filtered voice packaging requires build.copyPublicDir=false')
      if (!inside(config.root, outputDirectory) || outputDirectory === publicDirectory ||
          inside(publicDirectory, outputDirectory) || inside(outputDirectory, publicDirectory) ||
          outputDirectory === path.join(config.root, 'src') || inside(path.join(config.root, 'src'), outputDirectory)) {
        throw new Error('Unsafe voice packaging output directory')
      }
    },
    async writeBundle(_options, bundle) {
      const deniedPaths = new Set(), blocked = []
      for (const entry of catalogue) {
        if (entry.distributionRights?.verified === true) continue
        if (typeof entry.file !== 'string' || !entry.file.startsWith('/') || entry.file.startsWith('//')) {
          throw new Error(`Unsupported catalogue asset path: ${entry.file}`)
        }
        const relative = decodeURIComponent(entry.file.split(/[?#]/)[0]).slice(1)
        const source = path.resolve(publicDirectory, relative)
        if (!inside(publicDirectory, source)) throw new Error('Catalogue asset escapes public directory')
        deniedPaths.add(source)
        try {
          const bytes = await readFile(source)
          if (!bytes.length) throw new Error(`Empty unapproved recording: ${entry.file}`)
          blocked.push({ file: entry.file, bytes, hash: digest(bytes), base64: Buffer.from(bytes.toString('base64')) })
        } catch (error) {
          if (error.code !== 'ENOENT') throw error // Missing catalogue placeholders remain excluded.
        }
      }
      const hashes = new Set(blocked.map(entry => entry.hash))
      const excluded = []
      await cp(publicDirectory, outputDirectory, {
        recursive: true,
        filter: async (source, destination) => {
          const info = await lstat(source)
          if (info.isSymbolicLink()) throw new Error(`Public symlink requires explicit packaging review: ${source}`)
          if (info.isDirectory()) return true
          const relativeOutput = path.relative(outputDirectory, destination).split(path.sep).join('/')
          if (Object.hasOwn(bundle, relativeOutput)) return false // Preserve Vite's bundle-over-public precedence.
          if (deniedPaths.has(source) || hashes.has(digest(await readFile(source)))) {
            excluded.push(path.relative(publicDirectory, source))
            return false
          }
          return true
        },
      })
      // Fail closed for imported, renamed, embedded, base64 or stale exact-content copies.
      for await (const output of files(outputDirectory)) {
        const bytes = await readFile(output)
        for (const entry of blocked) {
          if (bytes.includes(entry.bytes) || bytes.includes(entry.base64)) {
            throw new Error(`Unapproved catalogue recording found in build output: ${output} (${entry.file})`)
          }
        }
        if (deniedPaths.has(path.resolve(publicDirectory, path.relative(outputDirectory, output)))) {
          throw new Error(`Unapproved catalogue path remains in build output: ${output}`)
        }
      }
      console.info(`[voice packaging] Excluded ${excluded.length} public files; audited ${blocked.length} unapproved recording fingerprints.`)
    },
  }
}
