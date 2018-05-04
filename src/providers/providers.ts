export * from './message/message.provider';
export * from './request-headers/request-headers.provider';
export * from './global-events/global-events.provider';

// App Providers

import { MessageProvider } from './message/message.provider';
import { RequestHeadersProvider } from './request-headers/request-headers.provider';
import { GlobalEventsProvider } from './global-events/global-events.provider';

export const APP_PROVIDERS = [
  RequestHeadersProvider,
  MessageProvider,
  GlobalEventsProvider
];

// Ionic Native Providers

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Firebase } from '@ionic-native/firebase';
import { Network } from '@ionic-native/network';
import { UrlInterceptor } from './url-interceptor/url-interceptor.provider';

export const IONIC_NATIVE_PROVIDERS = [
  StatusBar,
  SplashScreen,
  Network,
  Firebase
];

// Interceptor Providers

import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const APP_INTERCEPTORS = [{ provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true }];
