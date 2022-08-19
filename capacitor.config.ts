import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'finger-game',
  webDir: 'dist/finger-game',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true
  },
  server: {
    cleartext: true,
    //hostname: 'phplaravel-596529-2651231.cloudwaysapps.com',
    //url:'http://192.168.29.222:3000',
    hostname: 'localhost:4200',
    allowNavigation: [
      "localhost:4200",
      "*.paystack.com"
    ],
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#CE0B7C',
      //sound: 'beep.mp3',
    },
    PushNotifications: {
      presentationOptions: ['badge','alert', 'sound'],
    },
  },
};

export default config;
