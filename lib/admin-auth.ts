import { cookies } from 'next/headers';
import { getDb, getSql } from '@/db';
export const ADMIN_COOKIE='__Host-datascout_admin';
const enc=new TextEncoder();
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');
export async function digest(value:string){return hex(await crypto.subtle.digest('SHA-256',enc.encode(value)))}
function config(){const e=process.env as unknown as {ADMIN_USERNAME?:string;ADMIN_PASSWORD_HASH?:string};if(!e.ADMIN_USERNAME||!e.ADMIN_PASSWORD_HASH)throw Error('Admin login unavailable');return {username:e.ADMIN_USERNAME,passwordHash:e.ADMIN_PASSWORD_HASH}}
function equal(a:string,b:string){let difference=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)difference|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return difference===0;}
export async function checkCredentials(username:string,password:string){
 const c=config();const [algo,iterations,salt,wanted]=c.passwordHash.split('$');
 if(algo!=='pbkdf2'||Number(iterations)!==100000||!salt||!wanted)throw Error('Admin login unavailable');
 const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);
 const actual=hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:100000,hash:'SHA-256'},key,256));
 return equal(actual,wanted)&&equal(username,c.username);
}
export function sameOrigin(req:Request){
 const origin=req.headers.get('origin'),host=req.headers.get('host')||new URL(req.url).host;
 if(!origin)return false;
 try{const url=new URL(origin);return ['http:','https:'].includes(url.protocol)&&url.origin===origin&&url.host===host;}catch{return false;}
}
export async function allowLogin(req:Request){
 const now=Math.floor(Date.now()/1000);
 const ip=(process.env.VERCEL ? req.headers.get('x-vercel-forwarded-for') : req.headers.get('cf-connecting-ip'))||'shared-site';
 const key=await digest(ip);
 const r=await getSql().prepare('INSERT INTO admin_login_attempts (key,attempts,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN window_start < ? THEN 1 ELSE attempts+1 END, window_start=CASE WHEN window_start < ? THEN ? ELSE window_start END RETURNING attempts').bind(key,now,now-900,now-900,now).first<{attempts:number}>();
 return {allowed:!!r&&r.attempts<=10,key};
}
export async function createAdminSession(attemptKey:string){
 const bytes=new Uint8Array(32);crypto.getRandomValues(bytes);const token=hex(bytes.buffer);
 const tokenHash=await digest(token),authVersion=await digest(config().passwordHash);const expiresAt=Math.floor(Date.now()/1000)+43200;
 const db=getSql();
 await db.batch([db.prepare('INSERT INTO admin_sessions (token_hash,expires_at,auth_version) VALUES (?,?,?)').bind(tokenHash,expiresAt,authVersion),db.prepare('DELETE FROM admin_login_attempts WHERE key=?').bind(attemptKey)]);
 return `${ADMIN_COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=43200`;
}
export async function isAdmin(){
 const token=(await cookies()).get(ADMIN_COOKIE)?.value;
 if(!token||!/^[a-f0-9]{64}$/.test(token))return false;
 try{const row=await getSql().prepare('SELECT expires_at,auth_version FROM admin_sessions WHERE token_hash=?').bind(await digest(token)).first<{expires_at:number;auth_version:string}>();return !!row&&row.expires_at>Math.floor(Date.now()/1000)&&equal(row.auth_version,await digest(config().passwordHash));}catch{return false;}
}
export async function endAdminSession(){
 const token=(await cookies()).get(ADMIN_COOKIE)?.value;
 if(token&&/^[a-f0-9]{64}$/.test(token))await getSql().prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await digest(token)).run();
 return `${ADMIN_COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`;
}
