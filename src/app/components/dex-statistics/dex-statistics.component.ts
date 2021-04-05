import {Component, Input, OnInit} from '@angular/core';
import {DexInfo, Outcome, Pool, Rewards, Stats} from '@interfaces/Dex';

@Component({
  selector: 'app-dex-statistics',
  templateUrl: './dex-statistics.component.html',
  styleUrls: ['./dex-statistics.component.css']
})
export class DexStatisticsComponent implements OnInit {

  @Input()
  apiOnline: boolean;

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
