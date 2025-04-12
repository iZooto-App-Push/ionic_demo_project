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
  // Use the following ad units for test ads (GAM format: /networkId/adUnitPath)
  private interstitialId = '/21775744923/example/interstitial';
  adaptiveBannerId = '/21775744923/example/adaptive-banner';
  fixedBannerId = '/21775744923/example/fixed-size-banner';


  //Uncomment this section for production ad units
  //private interstitialId = '/206696744,22505733620/SpaceLaunch/com.kickstandtech.spacelaunchschedule_interstitial';
  //adaptiveBannerId = '/206696744,22505733620/SpaceLaunch/com.kickstandtech.spacelaunchschedule_banner';
  //fixedBannerId = '/206696744,22505733620/SpaceLaunch/com.kickstandtech.spacelaunchschedule_banner';


  // Flags to track which banner is visible
  adaptiveBannerVisible = false;
  fixedBannerVisible = false;

  constructor(private router: Router) { }

  // Angular initialization lifecycle hook
  async ngOnInit() {
    // Add any initialization logic here if needed
  }

  // Ionic lifecycle hook: Called when the view fully enters and is active
  async ionViewDidEnter() {
    // Automatically show banners when view is active (optional)
    // await this.toShowBannerAd(true);  // Show fixed banner
    // await this.toShowBannerAd(false); // Show adaptive banner
    console.log('HomePage has been refreshed or re-entered');
  }

  /**
   * Unified function to show either fixed or adaptive banner based on boolean
   * @param fixed - true for fixed banner, false for adaptive
   */
  async toShowBannerAd(fixed: boolean) {
    if (fixed == true) {
      await this.showFixedBannerAd();
    } else {
      await this.showAdaptiveBannerMobAd();
    }
  }

  // Show fixed banner ad
  async showFixedBannerAd() {
    try {
      await AdMob.showBanner({
        adId: this.fixedBannerId, // GAM ad unit ID for fixed banner
        adSize: BannerAdSize.BANNER, // Standard fixed banner size
        position: BannerAdPosition.BOTTOM_CENTER, // Show at bottom
        margin: 50, // Optional margin from edge
        isTesting: false, // Set true for test ads, false for production
      });
      this.adaptiveBannerVisible = false;
      this.fixedBannerVisible = true;
      console.log('Fixed Banner Ad Shown at Bottom');
    } catch (error) {
      console.error('Failed to load fixed banner:', error);
    }
  }

  // Show adaptive banner ad
  async showAdaptiveBannerMobAd() {
    try {
      await AdMob.showBanner({
        adId: this.adaptiveBannerId, // GAM ad unit ID for adaptive banner
        adSize: BannerAdSize.ADAPTIVE_BANNER, // Use adaptive size
        position: BannerAdPosition.TOP_CENTER, // Show at top
        margin: 120, // Optional margin from top
        isTesting: false, // Set true for test ads, false for production
      });
      this.adaptiveBannerVisible = true;
      console.log('Adaptive Banner Ad Shown at Top');

    } catch (error) {
      console.error('Failed to load banner:', error);
    }
  }

  // Click handler to manually show fixed banner
  async onClickShowFixedBannerAd() {
    await this.showFixedBannerAd(); // Show GAM fixed banner
  }

  // Click handler to show interstitial ad
  async onClickShowInterstitialAd() {
    await this.prepareInterstitialAd(); // Load and show interstitial
  }

  // Click handler to show adaptive banner
  async onClickShowAdaptiveBannerAd() {
    await this.showAdaptiveBannerMobAd(); // Show GAM adaptive banner
    //this.router.navigate(['/second-screen']); // for new screen 
  }

  // Click handler to show adaptive banner
  async onClickBannerHide() {
    try {
      // Only hide the banner if it's currently visible
      if (this.fixedBannerVisible) {
        await AdMob.hideBanner(); // Hide fixed banner if visible
        this.fixedBannerVisible = false;
        console.log("Fixed Banner hidden");
      } else if (this.adaptiveBannerVisible) {
        await AdMob.hideBanner(); // Hide adaptive banner if visible
        this.adaptiveBannerVisible = false;
        console.log("Adaptive Banner hidden");
      }

      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home']); // or whatever your current route is
      //  });

    } catch (error) {
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
        adId: this.interstitialId, // GAM interstitial ad unit
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



