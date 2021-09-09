import {Component, Input, OnInit} from '@angular/core';
import {Correlation, DexInfo, Pool, Stats} from '@interfaces/Dex';
import {Apollo} from 'apollo-angular';
import {CORRELATION} from '@interfaces/Graphql';

@Component({
  selector: 'app-dex-statistics',
  templateUrl: './dex-statistics.component.html',
})
export class DexStatisticsComponent implements OnInit {
  @Input()
  fiat: string;

  @Input()
  dex: DexInfo;

  @Input()
  poolBtc: Pool;

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
  stakingApyMN: number;

  @Input()
  stakingApyCake: number;

  @Input()
  MNCount: number;

  @Input()
  MNCount5Freezer: number;

  @Input()
  MNCount10Freezer: number;

  @Input()
  MNCount0Freezer: number;

  @Input()
  rewards: Stats;

  @Input()
  blockTimeUsed: number;

  @Input()
  blockTimeSecond: number;

  @Input()
  blockCountForCalc: number;

  @Input()
  isIncognitoModeOn: boolean;

  @Input()
  burnedDfi: number;

  corr: Correlation;

  euonsHardforkeBlock = 894000;


  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.loadCor();

  }

  loadCor(): void {
      this.apollo.query({
        query: CORRELATION
      }).subscribe((result: any) => {
        if (result?.data?.getCorrelation) {
          this.corr = result?.data?.getCorrelation;
        } else {
          console.log('No Date for Corr');
        }
      }, (error) => {
        console.log(error);
      });
    }

  getBlockToNextCycle(): string  {
    if (!this.rewards || !this.blockTimeUsed) {
      return '0';
    }

    const blocks = 32690 - (this.rewards?.blockHeight - this.euonsHardforkeBlock) % 32690;
    const time = blocks * this.blockTimeUsed / 60 / 60 / 24;
    return String(blocks) + ' ~ ' + Math.round(time ) + ' d';
  }

  getBlockToNextDiffChange(): string {
    if (!this.rewards || !this.blockTimeUsed) {
      return '0';
    }

    const blocks = 1008 - (this.rewards?.blockHeight - this.euonsHardforkeBlock) % 1008;
    const time = blocks * this.blockTimeUsed / 60 / 60;
    return String(blocks) + ' ~ ' + Math.round(time) + ' h';
  }

  getMasternodeTVL(): number {
    return this.MNCount * 20000 * this.poolUsdc?.priceB;
  }

  getTotalTVL(): number {
    return this.dex?.tvl + this.getMasternodeTVL();
  }

  getDexDFI(): number {
    return +this.poolBtc?.reserveB + +this.poolEth?.reserveB + +this.poolLtc?.reserveB + +this.poolUsdt?.reserveB +
      +this.poolUsdc?.reserveB + +this.poolDoge?.reserveB;
  }

  getTotalDFILocked(): number {
    return this.getDexDFI() + this.MNCount * 20000;
  }

}
