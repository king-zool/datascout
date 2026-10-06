import {sameOrigin,endAdminSession} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export async function POST(req:Request){
 if(!sameOrigin(req))return Response.json({error:'Invalid request.'},{status:403});
 try{return Response.json({ok:true},{headers:{'Set-Cookie':await endAdminSession(),'Cache-Control':'no-store'}});}catch{return Response.json({error:'Could not log out. Please try again.'},{status:503});}
}
