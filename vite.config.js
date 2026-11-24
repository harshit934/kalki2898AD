import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {mkdirSync,copyFileSync} from 'node:fs'
import {resolve} from 'node:path'
export default defineConfig({
 plugins:[react(),{name:'copy-required-draco-runtime',closeBundle(){const dir=resolve('dist/environment/kashi/draco');mkdirSync(dir,{recursive:true});for(const name of ['draco_decoder.js','draco_wasm_wrapper.js','draco_decoder.wasm'])copyFileSync(resolve('game/public/environment/kashi/draco',name),resolve(dir,name))}}],
 base:'./',
 publicDir:false,
 optimizeDeps:{entries:['index.html']},
 build:{outDir:'dist',assetsInlineLimit:0,rolldownOptions:{output:{codeSplitting:{includeDependenciesRecursively:false,groups:[{name:'physics',test:/node_modules[\\/]@dimforge[\\/]/},{name:'three',test:/node_modules[\\/]three[\\/]/}]}}}}
})
