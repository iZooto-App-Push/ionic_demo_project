export interface iZootoPlugin {
    initialize(): Promise<void>;
    getInitialNotification(): Promise<{ payload: string | null }>;
    getToken(): Promise<{ token: string | null }>;
}
export declare const iZooto: iZootoPlugin;
