# 📱 Google Ad Manager (GAM) Integration in Ionic (Capacitor)

## 📖 Documentation: Integrating Google Ad Manager (GAM) in Ionic

### 1. Overview

This guide explains how to integrate **Google Ad Manager (GAM)** into an **Ionic (Capacitor)** app to display banner and interstitial ads.

> ⚠️ **Note:** We are using **only GAM**, not AdMob, to serve ads.

---

### 2. Prerequisites

- A Google Ad Manager account ([Sign up here](https://admanager.google.com/home/)).
- A registered GAM App ID and Ad Unit ID.
- Installed: Node.js, Ionic, and Capacitor.
- Configured Android and/or iOS project:
  ```bash
  ionic cap add android
  ionic cap add ios
  ```

---

### 3. Setup in Google Ad Manager

1. Log in to Google Ad Manager.
2. Go to `Inventory → Ad Units`.
3. Create a new Ad Unit and **copy the Ad Unit ID** (e.g., `/21775744923/example/fixed-size-banner`).
4. Note your **App ID** from Google Ad Manager.

---

### 4. Install & Configure AdMob Plugin

> 🧩 Even though we use GAM, we still need the `@capacitor-community/admob` plugin, which supports **both AdMob and GAM**.

#### 📦 Install the plugin:

```bash
npm install @capacitor-community/admob
npx cap sync android
npx cap sync ios
```

---

### ✅ Android Configuration

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
  <application>
    <!-- GAM App ID -->
    <meta-data
      android:name="com.google.android.gms.ads.APPLICATION_ID"
      android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX" />
    
    <!-- Enable Ad Manager -->
    <meta-data
      android:name="com.google.android.gms.ads.AD_MANAGER_APP"
      android:value="true" />
  </application>
</manifest>
```

---

### ✅ iOS Configuration

Edit `ios/App/App/Info.plist`:

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>
```

---

### ✅ Update `capacitor.config.ts`

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.gam',
  appName: 'MyGAMApp',
  webDir: 'www',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // GAM App ID
    }
  }
};

export default config;
```

> 💡 If using both AdMob and GAM, use the following format:

```ts
plugins: {
  AdMob: {
    appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',  // AdMob App ID
    adManagerAppId: 'ca-app-pub-YYYYYYYYYYYYYYYY~YYYYYYYYYY' // GAM App ID
  }
}
```

---

### 5. Display a GAM Banner Ad

#### `home.page.ts`

```ts
import { Component } from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {}

  async ngOnInit() {
    await AdMob.initialize();
    console.log('✅ GAM Initialized');
  }

  async ionViewDidEnter() {
    await this.showBannerAd();
  }

   async ToShowBannerAd(isFixed: boolean) {
    try {
      await this.removeBanner();
      await AdMob.showBanner({
        adId: isFixed ? this.fixedBannerIdGAM : this.adaptiveBannerIdGAM,
        adSize: isFixed ? BannerAdSize.BANNER : BannerAdSize.MEDIUM_RECTANGLE,
        position: isFixed ? BannerAdPosition.BOTTOM_CENTER : BannerAdPosition.TOP_CENTER,
        margin: isFixed ? 50 : 110,
        isTesting: false, // Set true for test ads, (false for production and GAM test)
      });

      console.log(`${isFixed ? 'Fixed' : 'Adaptive'} Banner Ad Shown`);

    } catch (error) {
      console.error(`Failed to load ${isFixed ? 'fixed' : 'adaptive'} banner:`, error);
    }
  }
}
```

> 🎯 To dynamically switch between AdMob and GAM:

```ts
adId: this.useAdMob
  ? 'ca-app-pub-3940256099942544/6300978111'  // AdMob Test Banner
  : '/21775744923/example/banner',            // GAM Banner
```

---

### 6. Display a GAM Interstitial Ad

```ts
import {
  AdMob,
  InterstitialAdPluginEvents
} from '@capacitor-community/admob';

  // Prepare interstitial ad (preloading before showing)
  async prepareInterstitialAd() {
    try {
      // Attach interstitial ad event listeners
      AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
        console.log('Interstitial Loaded');
        this.showInterstitialAd(); // Automatically show after loading
      });

      AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
        console.log('Interstitial Failed to Load:', error);
      });

      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        console.log('Interstitial Dismissed');
      });

      // Load the interstitial ad
      await AdMob.prepareInterstitial({
        adId: this.interstitialIdGAM, // GAM interstitial ad unit
        isTesting: false, // Set true for test ads, false for production
      });

    } catch (error) {
      console.error('Error preparing interstitial:', error);
    }
  }

async showInterstitialAd() {
  try {
    await AdMob.showInterstitial();
    console.log('✅ Interstitial Shown');
  } catch (error) {
    console.error('❌ Error showing interstitial:', error);
  }
}


  // Prepare rewarded ad (preloading before showing)
  async prepareRewardedAd() {
    try {
      // Listener: Called when the rewarded video ad has successfully loaded
      AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
        console.log('Rewarded ad loaded');
        this.showRewardedAd();
      });

      AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: any) => {
        console.log('User earned reward:', reward);
      });

      AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
        console.error('Rewarded ad failed to load:', error);
      });

      // Prepare the rewarded ad (this starts loading the ad in background)
      await AdMob.prepareRewardVideoAd({
        adId: this.rewardedIdGAM, // Replace with your test or production rewarded ad unit
        isTesting: false,        // false for real ads
      });

    } catch (error) {
      console.error('Error preparing rewarded video ad:', error);
    }
  }

  // Show rewarded ad after it's been prepared
  async showRewardedAd() {
    try {
      await AdMob.showRewardVideoAd();
      console.log('rewarded Shown');
    } catch (error) {
      console.error('Error showing rewarded:', error);
    }
  }

    // To show app open function
  async showAppOpen() {
    try {
      await AdMob.prepareInterstitial({
        adId: this.appOpenIdGAM,
        isTesting: false // Set to false in production
      });

      await AdMob.showInterstitial();
    } catch (error) {
      console.error('Failed to show App Open (Interstitial):', error);
    }
  }
```

---

### 7. 🧪 Testing & Debugging

Use Android Logcat to check ad logs:

```bash
adb logcat | grep "AdMob"
adb logcat | grep "Banner Ad"
```

- `NO_FILL` = no ads available
- Ensure `AdMob.initialize()` is called before loading ads.

---

### 8. 🛠 Troubleshooting

| Issue                              | Solution                                                                 |
|-----------------------------------|--------------------------------------------------------------------------|
| Ads are not showing               | Check App ID and Ad Unit ID                                              |
| `NO_FILL` error                   | No ads available, try enabling test ads                                  |
| AdMob not initialized             | Call `await AdMob.initialize()` in `ngOnInit()`                          |
| AdMob ads showing instead of GAM  | Ensure Ad Unit ID starts with `/xxxxx/` (not `ca-app-pub-xxxxx`)         |

---

### 🧪 Sample GAM & AD MOB Testing IDs

// Use the following ad units for test ads (GAM format: /networkId/adUnitPath) and isTesting property should be false
  private interstitialIdGAM = '/21775744923/example/interstitial';
  private adaptiveBannerIdGAM = '/21775744923/example/adaptive-banner';
  private fixedBannerIdGAM = '/21775744923/example/fixed-size-banner';
  private rewardedIdGAM = '/21775744923/example/rewarded';
  private appOpenIdGAM = '/21775744923/example/app-open';


  // Use the following ad units for test ads (ADMOB format: /networkId/adUnitPath) and isTesting = optional (true/false)
  private interstitialIdAdMOB = 'ca-app-pub-3940256099942544/1033173712';
  private adaptiveBannerIdAdMOB = 'ca-app-pub-3940256099942544/9214589741';
  private fixedBannerIdAdMOB = 'ca-app-pub-3940256099942544/6300978111';
  private rewardedIdAdMOB = 'ca-app-pub-3940256099942544/5224354917';
  private appOpenIdAdMOB = 'ca-app-pub-3940256099942544/9257395921';

---

### 📁 Demo

👉 Find the source code here: **[Ionic Demo App](#)**

---

Happy coding 🎉
