import { Component, Input, OnInit } from '@angular/core';
import { Outcome, Pool, PoolEemOut, PoolPair } from '@interfaces/Dex';
import { PoolPairsOcean } from '@interfaces/Data';

@Component({
  selector: 'app-pool-income',
  templateUrl: './pool-income.component.html'
})
export class PoolIncomeComponent implements OnInit {

  @Input()
  isIncognitoModeOn: boolean;

  @Input()
  poolPairsOcean: PoolPairsOcean;

  @Input()
  pool: Pool;

  @Input()
  dfiProBlock: number;

  @Input()
  anteilAmPool: number;

  @Input()
  poolBtc: Pool;

  @Input()
  fiat: string;

  @Input()
  poolOut: Outcome;

  constructor() { }

  ngOnInit(): void {
  }


  getCommissionFromTotalBlockreward(pool: Pool): number {

    if (pool === undefined || pool === null) {
      return 0;
    }

    const poolVolumen24 = this.poolPairsOcean?.data.find(p => p.id === pool.id)?.volume.h24;
    const dfiPriceDex = this.poolBtc.priceB;
    return poolVolumen24 * 0.002 / dfiPriceDex / 2880;

  }

  getAprRewards(pool: Pool): number {

    if (pool === undefined || pool === null) {
      return 0;
    }

    const poolOceanReward = this.poolPairsOcean?.data.find(p => p.id === pool.id)?.apr.reward;

    return poolOceanReward * 100;

  }

  getAprFees(pool: Pool): number {

    if (pool === undefined || pool === null) {
      return 0;
    }

    const poolOceanCom = this.poolPairsOcean?.data.find(p => p.id === pool.id)?.apr.commission;

    return poolOceanCom * 100;

  }

  getAprTotal(pool: Pool): number {

    if (pool === undefined || pool === null) {
      return 0;
    }

    const poolOceanReward = this.poolPairsOcean?.data.find(p => p.id === pool.id)?.apr.total;

    return poolOceanReward * 100;

  }

  getPoolPairFromShare(share: number, pool: Pool): PoolPair {
    const pair = new PoolPair();
    pair.dfiOrUsdToken = +pool.reserveB * share / 100;
    pair.poolPairToken = +pool.reserveA * share / 100;

    return pair;
  }

  getSymbolA(pool: Pool): string {
    return pool.symbol?.split('-') [0];
  }

  getSymbolB(pool: Pool): string {
    return pool.symbol?.split('-') [1];
  }
}
