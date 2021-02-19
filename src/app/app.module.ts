import {enableProdMode, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule} from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EarningComponent } from './earning/earning.component';
import {CountdownModule} from 'ngx-countdown';
import {Integrations} from '@sentry/tracing';
import * as Sentry from '@sentry/angular';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

Sentry.init({
  dsn: 'https://698bab4662af4c5e8832caeea75b7901@o283448.ingest.sentry.io/5645017',
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ['localhost', 'https://www.defichain-income.com'],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});


@NgModule({
  declarations: [
    AppComponent,
    EarningComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    MatTabsModule,
    FormsModule,
    NgApexchartsModule,
    CountdownModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(success => console.log(`Bootstrap success`))
  .catch(err => console.error(err));
