import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from '@interfaces/Data';
import { Outcome, Pool } from '@interfaces/Dex';
import { MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'app-calculator-page',
  templateUrl: './calculator.component.html',
})
export class CalculatorComponent implements OnInit {
  details = 'LM';
  detailsKey = 'detailsKey';

  @Input()
  out: Outcome;

  @Input()
  pool: Pool;

  @Input()
  usdToEur: number;

  @Input()
  usdToChf: number;

  @Input()
  usdToGbp: number;

  @Input()
  fiat: string;

  @Input()
  stakingApyCake: number;

  @Input()
  stakingApyMN: number;

  @Input()
  poolBtc: Pool;

  @Input()
  wallet: Wallet;

  @Input()
  getAnteilBTCPoolAnGesamtLM: Function;

  @Input()
  getAnteilETHPoolAnGesamtLM: Function;

  @Input()
  getAnteilLTCPoolAnGesamtLM: Function;

  @Input()
  getAnteilUSDTPoolAnGesamtLM: Function;

  @Input()
  getAnteilDogePoolAnGesamtLM: Function;

  @Input()
  getAnteilBchPoolAnGesamtLM: Function;

  @Input()
  getDfiCountInLM: Function;

  @Input()
  getLMUsd: Function;

  constructor(private matomoTracker: MatomoTracker) { }
  ngOnInit (): void {
  }

  onChangeDetails (newValue: string): void {
    this.details = newValue;
    localStorage.setItem(this.detailsKey, newValue);
    this.matomoTracker.trackEvent('Klick', 'Change Details', newValue);
  }
}
