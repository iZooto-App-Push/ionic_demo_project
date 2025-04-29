package com.datability.izooto

import android.app.Application
import android.content.Context
import com.getcapacitor.PluginCall
import com.izooto.NotificationHelperListener
import com.izooto.NotificationWebViewListener
import com.izooto.Payload
import com.izooto.TokenReceivedListener
import com.izooto.iZooto


class IZootoApplication : Application(), NotificationHelperListener, NotificationWebViewListener, TokenReceivedListener {
  override fun onCreate() {
    super.onCreate()

    iZooto.initialize(this)
      .setNotificationReceiveListener(this)
      .setTokenReceivedListener(this)
      .setLandingURLListener(this)
      .build()

    iZooto.promptForPushNotifications()
  }

  override fun onNotificationOpened(payload: String?) {
    val prefs = getSharedPreferences("izooto_data", Context.MODE_PRIVATE)
    prefs.edit().putString("opened_payload", payload).apply()
  }

  override fun onNotificationReceived(payload: Payload?) {
    val prefs = getSharedPreferences("izooto_data", Context.MODE_PRIVATE)
    prefs.edit().putString("received_title", payload?.title).apply()
  }

  override fun onWebView(url: String?) {
    val prefs = getSharedPreferences("izooto_data", Context.MODE_PRIVATE)
    prefs.edit().putString("received_title", url).apply()
  }

  override fun onTokenReceived(token: String?) {
    val prefs = getSharedPreferences("izooto_data", Context.MODE_PRIVATE)
    prefs.edit().putString("izooto_token", token).apply()
  }
}
