import { fileURLToPath } from 'node:url'
import { excludeUnapprovedCatalogueVoices } from './tools/voice-build-policy.mjs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), excludeUnapprovedCatalogueVoices()],
  publicDir: fileURLToPath(new URL('../../../public', import.meta.url)),
  // Benchmarks and rollback builds contain their own HTML bundles. Scan only
  // the real app entry rather than parsing those archives into the dev heap.
  optimizeDeps: { entries: ['index.html'] },
  server: { watch: { ignored: ['**/archives/**','**/phase3/**','**/phase4/**','**/phase5/**'] } },
  build: {
    // Preserve public sources; copy only catalogue-rights-approved voice assets.
    copyPublicDir: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          includeDependenciesRecursively: false,
          groups: [
            { name: 'physics', test: /node_modules[\\/]@dimforge[\\/]/ },
            { name: 'three', test: /node_modules[\\/]three[\\/]/ },
          ],
        },
      },
    },
  },
})
