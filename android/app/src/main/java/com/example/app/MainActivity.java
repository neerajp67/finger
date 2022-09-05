package com.lastfinger.app;

import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  public  void onCreate(Bundle savedInstanceState){
    super.onCreate(savedInstanceState);
    registerPlugin(
      com.getcapacitor.community.facebooklogin.FacebookLogin.class
    );
//    registerPlugin(GoogleAuth.class);
  }

}
