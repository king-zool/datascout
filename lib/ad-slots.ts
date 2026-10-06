export const AD_SLOTS = [{id:"top",name:"Above the plans",size:"Recommended: 970 × 250 px"},{id:"middle",name:"Below the comparison table",size:"Recommended: 970 × 250 px"},{id:"bottom",name:"Near the footer",size:"Recommended: 970 × 250 px"}] as const;
export type Advertisement={slot:string;title:string;url:string;imageKey:string;active:number};
export function validSlot(value:unknown){return AD_SLOTS.some(s=>s.id===value)}
export function advertiserUrl(value:string){const url=new URL(/^https?:\/\//i.test(value)?value:`https://${value}`);if(!['http:','https:'].includes(url.protocol)||!url.hostname.includes('.')||url.username||url.password)throw TypeError('Enter a valid advertiser website URL.');return url.toString();}
