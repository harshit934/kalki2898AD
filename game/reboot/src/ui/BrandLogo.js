import {createElement as h} from 'react'
export const logoUrl=new URL('./branding/kl-logo.png',import.meta.url).href
export default function BrandLogo(){return h('span',{'aria-label':'Kalki logo',style:{display:'inline-flex',alignItems:'center'}},h('img',{src:logoUrl,alt:'K:L',style:{display:'block',height:24,width:'auto',objectFit:'contain'}}))}
