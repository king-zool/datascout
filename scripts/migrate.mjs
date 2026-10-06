import { createClient } from '@libsql/client';
import { readdir, readFile } from 'node:fs/promises';
if (!process.env.TURSO_DATABASE_URL) throw new Error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.');
const db = createClient({url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN});
try {
  await db.execute('CREATE TABLE IF NOT EXISTS datascout_migrations (name TEXT PRIMARY KEY NOT NULL)');
  const files = (await readdir(new URL('../drizzle/', import.meta.url))).filter(name=>name.endsWith('.sql')).sort();
  for (const name of files) {
    if ((await db.execute({sql:'SELECT name FROM datascout_migrations WHERE name=?',args:[name]})).rows.length) continue;
    const sql = await readFile(new URL(`../drizzle/${name}`, import.meta.url), 'utf8');
    const statements = sql.split('--> statement-breakpoint').map(sql=>sql.trim()).filter(Boolean);
    await db.batch([...statements, {sql:'INSERT INTO datascout_migrations (name) VALUES (?)',args:[name]}], 'write');
    console.log(`Applied ${name}`);
  }
} finally { db.close(); }
