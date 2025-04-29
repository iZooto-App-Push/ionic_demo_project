import { registerPlugin } from '@capacitor/core';

export interface iZootoPlugin {
  refresh(): Promise<void>;
}

const iZooto = registerPlugin<iZootoPlugin>('iZooto');

export default iZooto;
