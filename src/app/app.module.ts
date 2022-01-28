import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CountdownModule } from 'ngx-countdown';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatomoModule } from 'ngx-matomo-v9';
import { GraphQLModule } from './graphql.module';
import { ApyCalculatorComponent } from '@components/apy-calculator/apy-calculator.component';
import { ChangelogComponent } from '@components/changelog/changelog.component';
import { DexStatisticsComponent } from '@components/dex-statistics/dex-statistics.component';
import { DfiStatisticsComponent } from '@components/dfi-statistics/dfi-statistics.component';
import { EarningComponent } from '@components/earning/earning.component';
import { IncomeComponent } from '@components/income/income.component';
import { LmTargetCalculatorComponent } from '@components/lm-target-calculator/lm-target-calculator.component';
import { StakingTargetCalculatorComponent } from '@components/staking-target-calculator/staking-target-calculator.component';
import { ValueComponent } from '@components/value/value.component';
import { IconComponent } from '@components/icon/icon.component';
import { CalculatorComponent } from '@pages/calculator/calculator.component';
import { InfoComponent } from '@pages/info/info.component';
import { PriceComponent } from '@components/price/price.component';
import {DataService} from '@services/data.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import { ForecastComponent } from '@pages/forecast/forecast.component';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@environments/environment';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './components/history/history.component';
import { NewsletterComponent } from '@pages/newsletter/newsletter.component'

const appRoutes: Routes = [
  { path: 'address/:address', component: AppComponent },
  { path: 'authKey/:authKey', component: AppComponent },
  { path: '', component: AppComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ApyCalculatorComponent,
    ChangelogComponent,
    DexStatisticsComponent,
    DfiStatisticsComponent,
    EarningComponent,
    IncomeComponent,
    LmTargetCalculatorComponent,
    StakingTargetCalculatorComponent,
    ValueComponent,
    IconComponent,
    CalculatorComponent,
    InfoComponent,
    NewsletterComponent,
    PriceComponent,
    ForecastComponent,
    HistoryComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    MarkdownModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    MatomoModule,
    MatTabsModule,
    FormsModule,
    NgApexchartsModule,
    CountdownModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      maxOpened: 3,
      positionClass: 'toast-bottom-center',

    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    GraphQLModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
// tslint:disable-next-line:typedef
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
