package io.ionic.starter;

import android.os.Bundle;

import com.datability.izooto.iZootoPlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(iZootoPlugin.class);
  }
}
