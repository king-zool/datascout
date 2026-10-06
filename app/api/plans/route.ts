import { ensureCatalogueImported } from "@/lib/catalogue-import";
import { isAdmin, sameOrigin } from "@/lib/admin-auth";
import { validatePlan, PlanValidationError } from "@/lib/plan-validation";
import { getDb, getSql } from "@/db";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";
export async function GET() { try { await ensureCatalogueImported(); return Response.json(await getDb().select().from(plans),{headers:{"Cache-Control":"no-store"}}); } catch { return Response.json({error:"Unable to load plans"},{status:500}); } }
async function authorize(req:Request) {
 if(!await isAdmin())return false;
 return sameOrigin(req);
}
export async function POST(req:Request) {
 if(!await authorize(req)) return Response.json({error:"Admin authorization required. Please log in to the admin dashboard."},{status:403});
 let row;
 try { row=validatePlan(await req.json()); }
 catch(error) { return Response.json({error:error instanceof PlanValidationError?error.message:"The plan could not be read. Please reopen the editor and try again."},{status:400}); }
 try { await getDb().insert(plans).values(row).onConflictDoUpdate({target:plans.id,set:row});return Response.json(row); }
 catch { return Response.json({error:"Your fields are valid, but the plan could not be saved. Please try again."},{status:500}); }
}
export async function DELETE(req:Request) { if(!await authorize(req)) return Response.json({error:"Unauthorized"},{status:403}); const {id}=await req.json() as {id?:string}; if(typeof id!=="string")return Response.json({error:"Invalid ID"},{status:400}); await getDb().delete(plans).where(eq(plans.id,id)); return Response.json({ok:true}); }
