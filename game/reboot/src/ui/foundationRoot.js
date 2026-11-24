// Vite's per-module hot data survives entry-module re-evaluation. Reuse the
// React root without a global registry or a second gameplay/world owner.
export function renderFoundation({container,element,createRoot,hotData}){
 if(!container)throw new Error('Foundation root container is missing')
 const saved=hotData?.foundationRoot
 if(saved&&saved.container!==container)throw new Error('Foundation hot root belongs to another container')
 const root=saved?.root??createRoot(container)
 if(hotData&&!saved)hotData.foundationRoot={container,root}
 root.render(element)
 return root
}
