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
  poolQqq!: Pool;

  @Input()
  poolSpy!: Pool;

  @Input()
  poolPltr!: Pool;

  @Input()
  poolSlv!: Pool;

  @Input()
  poolAapl!: Pool;

  @Input()
  poolGld!: Pool;

  @Input()
  poolGme!: Pool;

  @Input()
  poolGoogl!: Pool;

  @Input()
  poolArkk!: Pool;

  @Input()
  poolBaba!: Pool;

  @Input()
  poolVnq!: Pool;

  @Input()
  poolUrth!: Pool;

  @Input()
  poolTlt!: Pool;

  @Input()
  poolAmzn!: Pool;

  @Input()
  poolNvda!: Pool;

  @Input()
  poolCoin!: Pool;

  @Input()
  poolEem!: Pool;

  @Input()
  poolPdbc!: Pool;

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
  dfiProBlockQqq;

  @Input()
  dfiProBlockSpy;

  @Input()
  dfiProBlockPltr;

  @Input()
  dfiProBlockSlv;

  @Input()
  dfiProBlockAapl;

  @Input()
  dfiProBlockGld;

  @Input()
  dfiProBlockGme;

  @Input()
  dfiProBlockGoogl;

  @Input()
  dfiProBlockArkk;

  @Input()
  dfiProBlockBaba;

  @Input()
  dfiProBlockVnq;

  @Input()
  dfiProBlockUrth;

  @Input()
  dfiProBlockTlt;

  @Input()
  dfiProBlockAmzn;

  @Input()
  dfiProBlockNvda;

  @Input()
  dfiProBlockCoin;

  @Input()
  dfiProBlockEem;

  @Input()
  dfiProBlockPdbc;

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
