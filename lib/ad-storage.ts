import { put, get, del } from '@vercel/blob';
const pathname = (key: string) => `datascout/ads/${key}`;
export function adStorage() {
  return {
    async put(key: string, bytes: ArrayBuffer, options: {httpMetadata: {contentType: string}}) {
      return put(pathname(key), bytes, {access: 'private', addRandomSuffix: false, contentType: options.httpMetadata.contentType});
    },
    async get(key: string) {
      const result = await get(pathname(key), {access: 'private'});
      if (!result || result.statusCode !== 200) return null;
      return {body: result.stream, httpMetadata: {contentType: result.blob.contentType}};
    },
    async delete(key: string) { await del(pathname(key)); },
  };
}
