import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { EarningComponent } from '@components/earning/earning.component';
import { LmTargetCalculatorComponent } from '@components/lm-target-calculator/lm-target-calculator.component';
import { StakingTargetCalculatorComponent } from '@components/staking-target-calculator/staking-target-calculator.component';
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
import { NewsletterComponent } from '@pages/newsletter/newsletter.component';
import { ApolloModule } from 'apollo-angular';
import { PoolIncomeComponent } from '@components/pool-income/pool-income.component';
import { HistoryModalComponent } from '@components/history-modal/history-modal.component';
import { DfiStatisticsComponent } from '@pages/dfi-statistics/dfi-statistics.component';
import { HistoryComponent } from '@pages/history/history.component';
import { ValueComponent } from '@pages/value/value.component';
import { DexStatisticsComponent } from '@pages/dex-statistics/dex-statistics.component';
import { IncomeComponent } from '@pages/income/income.component';

const appRoutes: Routes = [
  { path: 'address/:address', component: AppComponent },
  { path: 'authKey/:authKey', component: AppComponent },
  { path: 'dashboard', component: AppComponent },
  { path: 'holdings', component: AppComponent },
  { path: 'income', component: AppComponent },
  { path: 'dex', component: AppComponent },
  { path: 'chart', component: AppComponent },
  { path: 'forecast', component: AppComponent },
  { path: 'history', component: AppComponent },
  { path: 'calculator', component: AppComponent },
  { path: 'newsletter', component: AppComponent },
  { path: 'info', component: AppComponent },
  { path: 'settings', component: AppComponent },
  { path: '', component: AppComponent},
  { path: '**', component: AppComponent},
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
    PoolIncomeComponent,
    HistoryModalComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    ApolloModule,
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
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

// required for AOT compilation
// tslint:disable-next-line:typedef
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
