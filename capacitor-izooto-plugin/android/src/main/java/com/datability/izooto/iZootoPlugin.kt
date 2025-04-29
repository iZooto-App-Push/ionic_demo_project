package com.datability.izooto

import android.content.Context
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "iZooto")
class iZootoPlugin : Plugin() {

  @PluginMethod
  fun initialize(call: PluginCall) {
    call.resolve()
  }

  @PluginMethod
  fun getInitialNotification(call: PluginCall) {
    val prefs = context.getSharedPreferences("izooto_data", Context.MODE_PRIVATE)
    val payload = prefs.getString("opened_payload", null)

    val result = JSObject()
    result.put("payload", payload)

    // Optional: clear after reading
    //prefs.edit().remove("opened_payload").apply()

    call.resolve(result)
  }

  @PluginMethod
  fun getToken(call: PluginCall) {
    val prefs = context.getSharedPreferences("izooto_data", Context.MODE_PRIVATE)
    val token = prefs.getString("izooto_token", null)

    val result = JSObject()
    result.put("token", token)

    call.resolve(result)
  }
}
