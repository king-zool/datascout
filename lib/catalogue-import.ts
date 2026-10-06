import { getDb } from '@/db';
import { plans, catalogueImports } from '@/db/schema';
import { eq } from 'drizzle-orm';
import entries from './migrated-catalogue.json';
// Snapshot of all 180 plans on the existing deployment. Run once; preserve
// later admin edits and deletions. Schema is managed by db:migrate.
export async function ensureCatalogueImported() {
 const db = getDb(), id = 'vercel-catalogue-snapshot-2026-10-06-v1';
 if ((await db.select().from(catalogueImports).where(eq(catalogueImports.id,id))).length) return;
 const first = db.insert(plans).values(entries.slice(0,5)).onConflictDoNothing();
 const rest = [];
 for (let i=5; i<entries.length; i+=5) rest.push(db.insert(plans).values(entries.slice(i,i+5)).onConflictDoNothing());
 await db.batch([first,...rest,db.insert(catalogueImports).values({id,appliedAt:new Date().toISOString()}).onConflictDoNothing()]);
}
