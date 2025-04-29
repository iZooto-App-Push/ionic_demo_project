import { registerPlugin } from '@capacitor/core';

export interface iZootoPlugin {
  initialize(): Promise<void>;
  getInitialNotification(): Promise<{ payload: string | null }>;
  getToken(): Promise<{ token: string | null }>;
}

const iZooto = registerPlugin<iZootoPlugin>('iZooto');

export { iZooto };