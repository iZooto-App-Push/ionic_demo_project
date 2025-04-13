import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdPluginEvents, BannerAdPluginEvents } from '@capacitor-community/admob';
import { IonicModule } from '@ionic/angular';

interface MyItem {
  name?: string;
  type?: string;
}

@Component({
  selector: 'app-second-screen',
  templateUrl: './second-screen.page.html',
  styleUrls: ['./second-screen.page.scss'],
  standalone: true,
  imports: [IonicModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})



export class SecondScreenPage implements OnInit {

  // Define the Ad Unit ID for this second screen's banner
  adaptiveBannerId = '/21775744923/example/adaptive-banner';
  items: MyItem[] = [];

  constructor() { }

  ngOnInit() {
    const data: MyItem[] = [
      { name: 'Item 1' },
      { name: 'Item 2' },
      { name: 'Item 3' },
    ];

    this.items = data.reduce<MyItem[]>((acc, item) => {
      return acc.concat([item, { type: 'ad' }]);
    }, []);
  }

  async ionViewDidEnter() {
    await this.loadListBannerAds()
  }

  loadListBannerAds() {
    const adSlots = document.querySelectorAll('[id^="banner-ad-slot-"]');
    adSlots.forEach((slot: any, index) => {
      AdMob.showBanner({
        adId: this.adaptiveBannerId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.TOP_CENTER,
        margin: 0,
        //container: slot, // important
      }).then(() => {
        console.log(`Ad loaded in slot ${index}`);
      }).catch((err) => {
        console.error('Failed to load ad:', err);
      });
    });
  }

}
