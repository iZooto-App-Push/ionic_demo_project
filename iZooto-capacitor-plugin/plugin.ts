import { registerPlugin } from '@capacitor/core';

export interface iZootoPlugin {
  initilize(): Promise<void>;
}

export const iZooto = registerPlugin<iZootoPlugin>('iZooto');
