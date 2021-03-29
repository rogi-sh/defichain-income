import {enableProdMode, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule} from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EarningComponent } from './components/earning/earning.component';
import {CountdownModule} from 'ngx-countdown';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ChangelogComponent } from './components/changelog/changelog.component';
import { DexStatisticsComponent } from './components/dex-statistics/dex-statistics.component';
import { ApyCalculatorComponent } from './components/apy-calculator/apy-calculator.component';
import { LmTargetCalculatorComponent } from './components/lm-target-calculator/lm-target-calculator.component';
import { StakingTargetCalculatorComponent } from './components/staking-target-calculator/staking-target-calculator.component';
import { IncomeComponent } from './components/income/income.component';
import { ValueComponent } from './components/value/value.component';
import {MatomoModule} from 'ngx-matomo';
import { DfiStatisticsComponent } from './components/dfi-statistics/dfi-statistics.component';
import { GraphQLModule } from './graphql.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    EarningComponent,
    ChangelogComponent,
    DexStatisticsComponent,
    ApyCalculatorComponent,
    LmTargetCalculatorComponent,
    StakingTargetCalculatorComponent,
    IncomeComponent,
    ValueComponent,
    DfiStatisticsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    MatomoModule,
    MatTabsModule,
    FormsModule,
    NgApexchartsModule,
    CountdownModule,
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    GraphQLModule,
    AppRoutingModule,
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

// required for AOT compilation
// tslint:disable-next-line:typedef
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
