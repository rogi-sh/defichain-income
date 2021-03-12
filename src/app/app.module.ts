import {enableProdMode, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule} from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EarningComponent } from './earning/earning.component';
import {CountdownModule} from 'ngx-countdown';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ChangelogComponent } from './changelog/changelog.component';
import { DexStatisticsComponent } from './dex-statistics/dex-statistics.component';
import { ApyCalculatorComponent } from './apy-calculator/apy-calculator.component';
import { LmTargetCalculatorComponent } from './lm-target-calculator/lm-target-calculator.component';
import { StakingTargetCalculatorComponent } from './staking-target-calculator/staking-target-calculator.component';

@NgModule({
  declarations: [
    AppComponent,
    EarningComponent,
    ChangelogComponent,
    DexStatisticsComponent,
    ApyCalculatorComponent,
    LmTargetCalculatorComponent,
    StakingTargetCalculatorComponent
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
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
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
