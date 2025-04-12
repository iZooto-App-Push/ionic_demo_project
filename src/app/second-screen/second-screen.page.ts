import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdPluginEvents, BannerAdPluginEvents } from '@capacitor-community/admob';


@Component({
  selector: 'app-second-screen',
  templateUrl: './second-screen.page.html',
  styleUrls: ['./second-screen.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SecondScreenPage implements OnInit {

  // Define the Ad Unit ID for this second screen's banner
  adaptiveBannerId = '/21775744923/example/adaptive-banner';

  constructor() { }

  ngOnInit() { }

  async ionViewDidEnter() {
    await this.clickShowAdaptiveBannerAd()
  }

  // Show a banner on this second screen
  async clickShowAdaptiveBannerAd() {
  
      try {
        await AdMob.showBanner({
          adId: this.adaptiveBannerId, // GAM ad unit ID for adaptive banner
          adSize: BannerAdSize.ADAPTIVE_BANNER, // Use adaptive size
          position: BannerAdPosition.TOP_CENTER, // Show at top
          margin: 120, // Optional margin from top
          isTesting: false, // Set true for test ads, false for production
        });
        console.log('Adaptive Banner Ad Shown at Top');

      } catch (error) {
        console.error('Failed to load banner:', error);
      }
  }

  // Hide the banner
  async clickBannerHide() {
      try {
        await AdMob.hideBanner();
      } catch (error) {
        console.error('Error hiding second screen banner:', error);
      }
    }

  }
