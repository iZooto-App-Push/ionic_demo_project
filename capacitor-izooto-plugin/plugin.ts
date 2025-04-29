import { registerPlugin } from '@capacitor/core';

export interface iZootoPlugin {
  refresh(): Promise<void>;
}

export const iZooto = registerPlugin<iZootoPlugin>('iZooto');
