import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionicBlankApp',
  webDir: 'www'

  plugins: {
    appId: 'ca-app-pub-3940256099942544~3347511713',  // AdMob App ID
    adManagerAppId: 'ca-app-pub-3940256099942544~3347511713', // Ad Manager App ID
  }

};

export default config;
