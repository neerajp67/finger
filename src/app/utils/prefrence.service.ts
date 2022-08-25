import { Injectable } from '@angular/core';
import { ConfigureOptions, Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PrefrenceService {

  constructor() { }

  setName(keyName: any, valueName: any) {
    Preferences.set({
      key: keyName,
      value: valueName,
    });
  };
  public getStorage = async (key: string) => {
    const { value } = await Preferences.get({ key });
    return `${value}`;
};

  removeName(keyName: any) {
    Preferences.remove({ key: keyName });
  };


  //local data
  myEventdata: any[] = [];
  upcomingEventData: any[] = [];
  walletData: any[] = [];
  profileData: any;
  paystackData: any;
}
