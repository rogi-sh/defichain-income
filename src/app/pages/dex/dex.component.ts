import {Component, Input, OnInit} from '@angular/core';
import {DexInfo, Pool, Stats} from '@interfaces/Dex';

@Component({
  selector: 'app-dex-page',
  templateUrl: './dex.component.html',
})
export class DexComponent implements OnInit {
  @Input()
  fiat: string;

  @Input()
  dex: DexInfo;

  @Input()
  usdToEur: number;

  @Input()
  usdToChf: number;

  @Input()
  usdToGbp: number;

  @Input()
  poolBtc: Pool;

  @Input()
  poolEth: Pool;

  @Input()
  poolUsdt: Pool;

  @Input()
  poolLtc: Pool;

  @Input()
  poolDoge: Pool;

  @Input()
  poolBch: Pool;

  @Input()
  stakingApyMN: number;

  @Input()
  stakingApyCake: number;

  @Input()
  rewards: Stats;

  constructor() { }

  ngOnInit(): void {

  }

}
