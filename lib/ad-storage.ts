import {env} from "cloudflare:workers";
export function adStorage(){const bucket=(env as unknown as {AD_IMAGES?:R2Bucket}).AD_IMAGES;if(!bucket)throw Error('Banner storage unavailable');return bucket;}
