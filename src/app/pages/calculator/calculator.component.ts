import { Component, Input, OnInit } from '@angular/core';
import { Pool } from '@interfaces/Dex';
import { MatomoTracker } from 'ngx-matomo-v9';

@Component({
  selector: 'app-calculator-page',
  templateUrl: './calculator.component.html',
})
export class CalculatorComponent implements OnInit {
  details = 'Calc';
  detailsKey = 'detailsKey';

  @Input()
  stakingApyCake: number;

  @Input()
  stakingApyMN: number;

  @Input()
  poolBtc: Pool;

  @Input()
  fiat: string;

  @Input()
  poolEth: Pool;

  @Input()
  poolUsdt: Pool;

  @Input()
  poolUsdc: Pool;

  @Input()
  poolLtc: Pool;

  @Input()
  poolDoge: Pool;

  @Input()
  poolBch: Pool;

  @Input()
  poolUsd: Pool;

  @Input()
  poolTsla: Pool;

  @Input()
  dfiProBlockBtc;

  @Input()
  dfiProBlockEth;

  @Input()
  dfiProBlockUsdt;

  @Input()
  dfiProBlockUsdc;

  @Input()
  dfiProBlockLtc;

  @Input()
  dfiProBlockDoge;

  @Input()
  dfiProBlockBch;

  @Input()
  dfiProBlockUsd;

  @Input()
  dfiProBlockTsla;

  @Input()
  blocktimeInS;

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
