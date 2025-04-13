import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdPluginEvents, BannerAdPluginEvents } from '@capacitor-community/admob';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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

  // Use the following ad units for test ads (ADMOB format: /networkId/adUnitPath) and isTesting = optional (true/false)
  private interstitialIdAdMOB = 'ca-app-pub-3940256099942544/1033173712';
  private adaptiveBannerIdAdMOB = 'ca-app-pub-3940256099942544/9214589741';
  private fixedBannerIdAdMOB = 'ca-app-pub-3940256099942544/6300978111';

  //Uncomment this section for production ad units and isTesting property should be false
  //private interstitialId = '/206696744,22505733620/SpaceLaunch/com.kickstandtech.spacelaunchschedule_interstitial';
  //private adaptiveBannerId = '/206696744,22505733620/SpaceLaunch/com.kickstandtech.spacelaunchschedule_banner';
  //private fixedBannerId = '/206696744,22505733620/SpaceLaunch/com.kickstandtech.spacelaunchschedule_banner';

  // Injecting Angular Router to enable navigation between pages/screens
  constructor(private router: Router) { }

  // Angular initialization lifecycle hook
  async ngOnInit() {
    // Add any initialization logic here if needed
  }

  // Ionic lifecycle hook: Called when the view fully enters and is active
  async ionViewDidEnter() {
    // Automatically show banners when view is active (optional)
    console.log('HomePage is defined');
  }

  // Click handler to manually show fixed banner
  async onClickShowFixedBannerAd() {
    await this.ToShowBannerAd(true);
  }

  // Click handler to show adaptive banner
  async onClickShowAdaptiveBannerAd() {
    await this.ToShowBannerAd(false); // Show GAM adaptive banner
    // this.router.navigate(['/second-screen']); // for new screen 
  }

  // Click handler to show interstitial ad
  async onClickShowInterstitialAd() {
    await this.prepareInterstitialAd(); // Load and show interstitial
  }

  // Click handler to remove banner ad
  async onClickBannerRemove(){
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
        margin: isFixed ? 50 : 120,
        isTesting: false, // Set true for test ads, (false for production and GAM test)
      });

      console.log(`${isFixed ? 'Fixed' : 'Adaptive'} Banner Ad Shown`);

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
}



