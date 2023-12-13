import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ion.tabs.standalone',
  appName: 'ion-tabs-standalone',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
