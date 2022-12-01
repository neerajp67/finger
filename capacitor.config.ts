import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lastfinger.app',
  appName: 'finger-game',
  webDir: 'dist/finger-game',
  bundledWebRuntime: false,
  backgroundColor: '#080728',
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
      "*.paystack.com",
      "*.cloudwaysapps.com",
      "https://socket.chalesocial.com",
      // "*.paystack.*"
    ],
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#CE0B7C',
      //sound: 'beep.mp3',
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "1093527882296-t21rpdjeqe7jlpi3c868fspdrp364egf.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'alert', 'sound'],
    },
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
    },
  },
};

export default config;
