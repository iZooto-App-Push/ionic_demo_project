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

  async showBannerAd() {
    try {
      const options: BannerAdOptions = {
        adId: '/21775744923/example/fixed-size-banner', // GAM Ad Unit ID
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        isTesting: false,
      };

      await AdMob.showBanner(options);
      console.log('✅ GAM Banner Ad Displayed');
    } catch (error) {
      console.error('❌ Failed to load banner:', error);
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

async prepareInterstitialAd() {
  try {
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
      console.log('Interstitial Loaded');
      this.showInterstitialAd();
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
      console.log('Interstitial Failed to Load:', error);
    });

    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      console.log('Interstitial Dismissed');
    });

    await AdMob.prepareInterstitial({
      adId: '/21775744923/example/interstitial',
      isTesting: false,
    });

  } catch (error) {
    console.error('❌ Error preparing interstitial:', error);
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

### 🧪 Sample GAM Testing IDs

- **GAM App ID:** `ca-app-pub-3940256099942544~3347511713`
- **Adaptive Banner:** `/21775744923/example/adaptive-banner`
- **Fixed Size Banner:** `/21775744923/example/fixed-size-banner`

---

### 📁 Demo

👉 Find the source code here: **[Ionic Demo App](#)**

---

Happy coding 🎉
