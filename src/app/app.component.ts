import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) navCtrl: Nav;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private firebase: Firebase
  ) {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.initAnalytics();

      this.initializePage();
    });

  }

  async initializePage() {
    await this.navCtrl.setRoot('HomePage');

    setTimeout(() => this.splashScreen.hide());
  }

  private async initAnalytics() {
    this.navCtrl.viewDidEnter.subscribe((view: any) => {
      view.instance.pageTitle && this.firebase.setScreenName(view.instance.pageTitle);
    });
  }
}

