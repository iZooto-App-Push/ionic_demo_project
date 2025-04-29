import Capacitor
import iZootoSDK  // Assuming iZooto SDK is already integrated in your Xcode project

@objc(iZootoPush)
public class iZootoPush: NSObject {

    @objc func refresh(call: CAPPluginCall) {
        // Code to refresh push notifications using iZooto SDK
        do {
            // Call the iZooto SDK method to refresh push notification
            // This is just an example, please replace with actual SDK method
            iZooto.refreshPush()
            
            call.resolve()
        } catch {
            call.reject("Failed to refresh push notifications", error.localizedDescription)
        }
    }
}
