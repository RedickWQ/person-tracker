import { local } from './local';
import { api } from '../api';

// 自动检测环境
// DEV: 使用本地 IndexedDB (Dexie)
// PROD: 使用远程 Cloudflare D1 API
const isLocal = import.meta.env.DEV;

export const storage = isLocal ? local : api;
export { isLocal };
