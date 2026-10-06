import { getDb } from '@/db';
import { plans, catalogueImports } from '@/db/schema';
import { eq } from 'drizzle-orm';
import entries from './catalogue-data.json';
import submitted from './submitted-catalogue.json';
// One-time, versioned data bootstrap. Preserve existing plans and edits; deleted
// imported records stay deleted. Schema is managed exclusively by migrations.
async function ensurePublicCatalogueImported(){
 const db=getDb(); const id='public-prices-2026-10-05';
 if((await db.select().from(catalogueImports).where(eq(catalogueImports.id,id))).length)return;
 // Keep each query below D1's parameter limit, while applying the import atomically.
 const first=db.insert(plans).values(entries.slice(0,5)).onConflictDoNothing();
 const rest=[];
 for(let i=5;i<entries.length;i+=5)rest.push(db.insert(plans).values(entries.slice(i,i+5)).onConflictDoNothing());
 await db.batch([first,...rest,db.insert(catalogueImports).values({id,appliedAt:new Date().toISOString()}).onConflictDoNothing()]);
}

// This import is applied once, so subsequent admin edits and deletions persist.
// A zero validity means the source did not provide it; never infer 30 days.
export async function ensureCatalogueImported(){
 await ensurePublicCatalogueImported();
 const db=getDb().$client,id='submitted-csv-2026-10-05-150-v1';
 if(await db.prepare('SELECT id FROM catalogue_imports WHERE id=?').bind(id).first())return;
 const existing=await db.prepare('SELECT id,reseller,network,gb,type,url,days FROM plans').all<{id:string;reseller:string;network:string;gb:number;type:string;url:string;days:number}>();
 const normalize=(name:string)=>name.toLowerCase().replace(/[^a-z0-9]/g,'');
 const commands=submitted.map(row=>{
  const match=existing.results.find(p=>normalize(p.reseller)===normalize(row.reseller)&&p.network===row.network&&p.gb===row.gb&&p.type===row.type);
  return db.prepare('INSERT INTO plans (id,reseller,network,gb,price,days,type,url,updated,source_url,checked_at,tier,label,notes) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM catalogue_imports WHERE id=?) ON CONFLICT(id) DO UPDATE SET price=excluded.price,updated=excluded.updated,source_url=excluded.source_url,checked_at=excluded.checked_at,tier=excluded.tier,label=excluded.label,notes=excluded.notes').bind(match?.id||row.id,row.reseller,row.network,row.gb,row.price,match?.days||row.days,row.type,match?.url||row.url,row.updated,row.sourceUrl,row.checkedAt,row.tier,row.label,row.notes,id);
 });
 commands.push(db.prepare('INSERT INTO catalogue_imports (id,applied_at) VALUES (?,?) ON CONFLICT(id) DO NOTHING').bind(id,new Date().toISOString()));
 await db.batch(commands);
}
