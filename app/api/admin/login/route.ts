import {sameOrigin,allowLogin,checkCredentials,createAdminSession} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export async function POST(req:Request){
 if(!sameOrigin(req))return Response.json({error:'Open the login page on this site.'},{status:403});
 try{
  const attempt=await allowLogin(req);
  if(!attempt.allowed)return Response.json({error:'Too many login attempts. Please try again in 15 minutes.'},{status:429,headers:{'Retry-After':'900'}});
  const b=await req.json() as {username?:unknown;password?:unknown};
  if(typeof b.username!=='string'||typeof b.password!=='string'||b.username.length>100||b.password.length>256)return Response.json({error:'Incorrect username or password.'},{status:401});
  if(!await checkCredentials(b.username.trim(),b.password))return Response.json({error:'Incorrect username or password.'},{status:401});
  return Response.json({ok:true},{headers:{'Set-Cookie':await createAdminSession(attempt.key),'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Login is temporarily unavailable. Please try again.'},{status:503});}
}
