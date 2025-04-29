import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import {
  AdMob, BannerAdOptions,
  BannerAdSize, BannerAdPosition,
  InterstitialAdPluginEvents,
  BannerAdPluginEvents, RewardAdPluginEvents, AdOptions
} from '@capacitor-community/admob';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { iZooto } from 'capacitor-izooto-plugin';


//Defining Angular component for Ionic
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})

// Main activity class component
export class HomePage {

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


  // Injecting Angular Router to enable navigation between pages/screens
  constructor(private loadingController: LoadingController, private platform: Platform, private router: Router) {
    this.initializeApp();
  }

  // Angular initialization lifecycle hook
  async ngOnInit() {
    try {

      iZooto.initialize().then(() => {
        console.log('iZooto initialized successfully');
        // Put your success logic here
      }).catch(error => {
        console.error('Error during iZooto initialization:', error);
        // Handle the error here
      });

      // Get device token
    const tokenResult = await iZooto.getToken();
    if (tokenResult.token) {
      console.log('Device Token:', tokenResult.token);
    }

 // Delay a bit to make sure prefs are populated
 setTimeout(async () => {
  const result = await iZooto.getInitialNotification();
  if (result.payload) {
    console.log('Cold start notification payload:', result.payload);
  }
}, 3000);
    } catch (error) {
      console.error('iZooto plugin error:', error);
    }
  }

  // Ionic lifecycle hook: Called when the view fully enters and is active
  async ionViewDidEnter() {
    // Automatically show banners when view is active (optional)
    console.log('HomePage is defined');
    this.presentLoading();

  }




  async statusBar() {
    try {
      // Make sure the webview does not extend into the status bar
      await StatusBar.setOverlaysWebView({ overlay: false });
      // Set the background color to something visible
      await StatusBar.setBackgroundColor({ color: '#ADD8E6' });
      // Set the icon style (optional: 'Light' for dark bg, 'Dark' for light bg)
      await StatusBar.setStyle({ style: Style.Dark });
    } catch (err) {
      console.log('StatusBar error:', err);
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 2000,
    });
    await loading.present();
    console.log("loading presented");
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');

    // You can also access the loading instance:
    // const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }

  // Click handler to manually show fixed banner
  async onClickShowFixedBannerAd() {
    await this.ToShowBannerAd(true);
  }

  // Click handler to show adaptive banner
  async onClickShowAdaptiveBannerAd() {
    await this.ToShowBannerAd(false);
  }

  // Click handler to show interstitial ad
  async onClickShowInterstitialAd() {
    await this.prepareInterstitialAd(); // Load and show interstitial
  }

  // Click handler to show rewarded ad
  async onClickRewardedAd() {
    await this.prepareRewardedAd(); // Load and show interstitial
  }

  // Click handler to show app open ad
  async onClickAppOpenAd() {
    this.showAppOpen();
  }

  // Click handler to remove banner ad
  async onClickBannerRemove() {
    await this.removeBanner();
  }

  // Show banner ad (fixed or adaptive based on parameter)
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
      AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        console.log('Banner Ad Loaded');
      });

      AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
        console.error('Banner Ad Failed to Load:', error);
        alert(error.message);
      });

      AdMob.addListener(BannerAdPluginEvents.Opened, () => {
        console.log('Banner Ad Opened');
      });

      AdMob.addListener(BannerAdPluginEvents.AdImpression, () => {
        console.log('Banner Ad AdImpression');
      });

    } catch (error) {
      console.error(`Failed to load ${isFixed ? 'fixed' : 'adaptive'} banner:`, error);
    }
  }


  // Function to remove the currently displayed banner ad
  async removeBanner() {
    try {
      // Attempt to remove the banner ad from the screen
      await AdMob.removeBanner();
    } catch (error) {
      // Log any error encountered while removing the banner
      console.error("Error hiding banner:", error);
    }
  }

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
        alert(error.message);
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

  // Show interstitial ad after it's been prepared
  async showInterstitialAd() {
    try {
      await AdMob.showInterstitial();
      console.log('Interstitial Shown');
    } catch (error) {
      console.error('Error showing interstitial:', error);
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
        alert(error.message);
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
      // Attach interstitial ad event listeners
      AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
        console.log('Interstitial Loaded');
        AdMob.showInterstitial();
      });

      AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
        console.log('Interstitial Failed to Load:', error);
        alert(error.message);
      });

      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        console.log('Interstitial Dismissed');
      });

      await AdMob.prepareInterstitial({
        adId: this.appOpenIdGAM,
        isTesting: false // Set to false in production
      });


    } catch (error) {
      console.error('Failed to show App Open (Interstitial):', error);
    }
  }

  // For initialize App and exit app
  initializeApp() {
    this.platform.ready().then(() => {
      // Show App Open Ad on start
      this.statusBar();
      this.showAppOpen();
      this.platform.backButton.subscribeWithPriority(10, () => {
        (window.navigator as any).app.exitApp(); // Close the app immediately
      });
    });
  }

}
