import { Component, Input, OnInit } from '@angular/core';
import { Outcome, Pool } from '@interfaces/Dex'
import { MatomoTracker } from 'ngx-matomo-v9';

@Component({
  selector: 'app-calculator-page',
  templateUrl: './calculator.component.html',
})
export class CalculatorComponent implements OnInit {

  details = 'LM';
  detailsKey = 'detailsKey';

  @Input()
  stakingApyCake: number;

  @Input()
  stakingApyMN: number;

  @Input()
  pools: Pool [];

  @Input()
  poolBtc: Pool;

  @Input()
  fiat: string;

  @Input()
  stakingApy: number;

  constructor(private matomoTracker: MatomoTracker) { }
  ngOnInit(): void {
  }

  onChangeDetails(newValue: string): void {
    this.details = newValue;
    localStorage.setItem(this.detailsKey, newValue);
    this.matomoTracker.trackEvent('Klick', 'Change Details', newValue);
  }
}
