// World coordinates are metres, Y-up; rewards are one-time wallet receipts.
export const ACTIVITIES=Object.freeze({
 kashi:{discovery:[190,-.22,205],relay:[[220,-.22,350],[220,-.22,354],[220,-.22,358]],survey:[[162,-.22,196],[292,-.22,246],[371,-1.62,220]],title:'Kashi heritage trail'},
 shambala:{discovery:[434,12,170],relay:[[116,-.04,120],[116,-.04,124],[116,-.04,128]],survey:[[76,-.04,84],[280,8,144],[440,12,170]],title:'Himalayan energy trail'},
 complex:{discovery:[98,-.025,-46],relay:[[210,-.025,-20],[210,-.025,-24],[210,-.025,-28]],survey:[[238,-.025,-36],[110,-.025,80],[410,-8,124]],title:'Research inspection trail'}
})
export const ACTIVITY_REWARDS=Object.freeze({discovery:25,relay:40,survey:60})
export const activityReceipt=(world,kind)=>'exploration:'+world+':'+kind
export const ACTIVITY_GRANTS=Object.freeze(Object.fromEntries(Object.keys(ACTIVITIES).flatMap(world=>Object.entries(ACTIVITY_REWARDS).map(([kind,amount])=>[activityReceipt(world,kind),Object.freeze({amount,label:ACTIVITIES[world].title+' — '+kind+' completed'})]))))

