import { PLAN_TYPES } from "./plan-types";
export class PlanValidationError extends Error {}
export function validatePlan(input:unknown) {
 if(!input || typeof input!=='object' || Array.isArray(input)) throw new PlanValidationError('The plan could not be read. Please reopen the editor and try again.');
 const b=input as Record<string,unknown>;
 const fail=(message:string):never=>{throw new PlanValidationError(message)};
 const reseller=typeof b.reseller==='string'?b.reseller.trim():'';
 if(!reseller || reseller.length>100)fail('Reseller name is required and must be 100 characters or fewer.');
 const network=typeof b.network==='string'?b.network:'';
 if(!['MTN','Airtel','Glo','9mobile'].includes(network))fail('Choose a network: MTN, Airtel, Glo or 9mobile.');
 const type=typeof b.type==='string'?b.type:'';
 if(!(PLAN_TYPES as readonly string[]).includes(type))fail('Choose a valid plan type.');
 const number=(value:unknown)=>typeof value==='number'?value:typeof value==='string'&&value.trim()?Number(value.replace(/,/g,'')):NaN;
 const gb=number(b.gb),price=number(b.price),days=b.days===0||b.days===''?0:number(b.days);
 if(!Number.isFinite(gb)||gb<=0||gb>10000)fail('Data size must be greater than 0 and no more than 10,000 GB.');
 if(!Number.isFinite(price)||price<=0||price>10000000)fail('Total price must be greater than ₦0 and no more than ₦10,000,000.');
 if(!Number.isInteger(days)||days<0||days>365)fail('Validity must be a whole number from 1 to 365 days, or left blank if not supplied.');
 let raw=typeof b.url==='string'?b.url.trim():'';

 // Preserve query strings and referral codes. Add HTTPS only when no scheme is present.
 if(raw&&!/^[a-z][a-z\d+.-]*:/i.test(raw))raw='https://'+raw;
 let url:URL|undefined;
 try{if(raw)url=new URL(raw)}catch{fail('The reseller link could not be read. Example: https://reseller.com');}
 if(url&&(!['https:','http:'].includes(url.protocol)||!url.hostname.includes('.')||/\s/.test(url.hostname)||url.username||url.password))fail('Use a website link such as reseller.com or https://reseller.com.');
 const optional=(key:string,max:number)=>typeof b[key]==='string'?(b[key] as string).trim().slice(0,max):'';
 const tier=optional('tier',40),label=optional('label',120),notes=optional('notes',300);
 let sourceUrl=optional('sourceUrl',2000);
 if(sourceUrl){try{const source=new URL(sourceUrl);if(!['http:','https:'].includes(source.protocol))throw Error();sourceUrl=source.toString();}catch{fail('The price source must be a complete https:// website link.');}}
 const checkedRaw=optional('checkedAt',40);
 const checkedAt=sourceUrl&&checkedRaw&&!Number.isNaN(Date.parse(checkedRaw))?new Date(checkedRaw).toISOString():'';
 return {sourceUrl,checkedAt,tier,label,notes,id:typeof b.id==='string'&&b.id?b.id:crypto.randomUUID(),reseller,network,gb,price,days,type,url:url?.toString()||'',updated:new Date().toISOString()};
}
