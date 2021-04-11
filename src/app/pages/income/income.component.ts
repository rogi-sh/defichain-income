import { Component, Input, OnInit } from '@angular/core';
import { Outcome, OutcomeStaking, Pool } from '@interfaces/Dex';

@Component({
  selector: 'app-income-page',
  templateUrl: './income.component.html'
})
export class IncomePageComponent implements OnInit {
  selectedTab: string = 'Staking';

  @Input()
  stakingOut!: OutcomeStaking;

  @Input()
  poolOut!: Outcome;

  @Input()
  poolBtcOut!: Outcome;

  @Input()
  poolEthOut!: Outcome;

  @Input()
  poolUsdtOut!: Outcome;

  @Input()
  poolLtcOut!: Outcome;

  @Input()
  poolBchOut!: Outcome;

  @Input()
  poolDogeOut!: Outcome;

  @Input()
  poolBtc!: Pool;

  @Input()
  usdToEur!: number;

  @Input()
  usdToChf!: number;

  @Input()
  usdToGbp!: number;

  @Input()
  fiat!: string;

  constructor() { }

  ngOnInit(): void {
  }

  handleTab(selectedTab: string): void {
    this.selectedTab = selectedTab
  }
}
