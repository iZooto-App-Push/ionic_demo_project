import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.initializeAdMob();
  }

  async initializeAdMob() {
    try {
      await AdMob.initialize();
      console.log('✅ AdMob initialized successfully');
    } catch (error) {
      console.error('❌ AdMob initialization failed:', error);
    }
  }
}
