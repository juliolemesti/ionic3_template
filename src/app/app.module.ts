import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { UrlResolverModule } from '@mbamobi/url-resolver';
import { ConfigurationModule } from '@mbamobi/configuration';
import { APP_CONFIG } from './app.config';
import { Env, ProviderEnv } from './app.env';
import { HttpClientModule } from '@angular/common/http';
import { APP_PROVIDERS, IONIC_NATIVE_PROVIDERS, APP_INTERCEPTORS } from '../providers/providers';
import { APP_SERVICES } from '../services/services';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ConfigurationModule.initialize(APP_CONFIG, Env),
    UrlResolverModule.initialize(),
    IonicStorageModule.forRoot({ name: '__mydb' }),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    APP_PROVIDERS,
    APP_SERVICES,
    IONIC_NATIVE_PROVIDERS,
    ProviderEnv,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    APP_INTERCEPTORS
  ]
})
export class AppModule { }
