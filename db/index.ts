import { createClient, type InValue } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

let client: ReturnType<typeof createClient> | undefined;
function getClient() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    if (!url) throw new Error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before using DataScout.');
    if (process.env.VERCEL && !/^libsql:\/\/|^https:\/\//.test(url)) throw new Error('Vercel requires a remote database.');
    client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  }
  return client;
}
export function getDb() { return drizzle(getClient(), { schema }); }
class Statement {
  constructor(readonly sql: string, readonly args: InValue[] = []) {}
  bind(...args: InValue[]) { return new Statement(this.sql, args); }
  async all<T = Record<string, unknown>>() {
    const result = await getClient().execute({ sql: this.sql, args: this.args });
    return { results: result.rows.map(row => Object.fromEntries(Object.entries(row))) as T[] };
  }
  async first<T = Record<string, unknown>>() { return (await this.all<T>()).results[0] ?? null; }
  async run() { return getClient().execute({ sql: this.sql, args: this.args }); }
}
// Small compatibility surface for the existing parameterized admin queries.
export function getSql() {
  return {
    prepare: (sql: string) => new Statement(sql),
    batch: (statements: Statement[]) => getClient().batch(statements.map(({sql,args}) => ({sql,args})), 'write'),
  };
}
